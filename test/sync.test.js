'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PORT = 4300 + Math.floor(Math.random() * 500);
const BASE = `http://127.0.0.1:${PORT}`;
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hunar-test-'));
let child;

const rec = (id, t, dev, data = { name: id }, extra = {}) => ({ id, collection: 'intakes', data, updatedAt: t, deviceId: dev, ...extra });
const post = (room, body) => fetch(`${BASE}/api/rooms/${room}/sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((r) => r.json());

before(async () => {
  child = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: String(PORT), DATA_DIR: dataDir }, stdio: 'pipe' });
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`${BASE}/api/health`)).ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('server did not start');
});
after(() => { child.kill(); fs.rmSync(dataDir, { recursive: true, force: true }); });

const T = Date.now();

test('accepts a record and returns it to another device pulling from 0', async () => {
  const a = await post('room-one', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000001', T, 'devAAAAAA')] });
  assert.equal(a.accepted, 1);
  const b = await fetch(`${BASE}/api/rooms/room-one/sync?since=0`).then((r) => r.json());
  assert.equal(b.changes.length, 1);
  assert.equal(b.changes[0].data.name, 'rec000001');
});

test('last writer wins; an older write is rejected', async () => {
  await post('room-lww', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000002', T, 'devAAAAAA', { name: 'new' })] });
  const old = await post('room-lww', { deviceId: 'devBBBBBB', since: 0, changes: [rec('rec000002', T - 1000, 'devBBBBBB', { name: 'stale' })] });
  assert.equal(old.accepted, 0);
  assert.equal(old.changes[0].data.name, 'new');
});

test('equal timestamps converge by deviceId on every replica', async () => {
  await post('room-tie', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000003', T, 'devAAAAAA', { name: 'A' })] });
  const r = await post('room-tie', { deviceId: 'devBBBBBB', since: 0, changes: [rec('rec000003', T, 'devBBBBBB', { name: 'B' })] });
  assert.equal(r.changes[0].data.name, 'B');
});

test('tombstones sync and block resurrection by older writes', async () => {
  await post('room-del', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000004', T, 'devAAAAAA')] });
  await post('room-del', { deviceId: 'devBBBBBB', since: 0, changes: [rec('rec000004', T + 10, 'devBBBBBB', null, { deleted: true })] });
  const zombie = await post('room-del', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000004', T + 5, 'devAAAAAA')] });
  assert.equal(zombie.accepted, 0);
  assert.equal(zombie.changes[0].deleted, true);
});

test('rooms are isolated', async () => {
  await post('room-x-aa', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000005', T, 'devAAAAAA')] });
  const other = await fetch(`${BASE}/api/rooms/room-y-bb/sync?since=0`).then((r) => r.json());
  assert.equal(other.changes.length, 0);
});

test('rejects bad collection, bad ids, future timestamps and bad room codes', async () => {
  const bad = [
    { ...rec('rec000006', T, 'devAAAAAA'), collection: 'users' },
    rec('x', T, 'devAAAAAA'),
    rec('rec000007', T + 7 * 24 * 3600e3, 'devAAAAAA'),
    rec('rec000008', T, 'devAAAAAA', 'not-an-object')
  ];
  const r = await post('room-bad', { deviceId: 'devAAAAAA', since: 0, changes: bad });
  assert.equal(r.accepted, 0);
  const res = await fetch(`${BASE}/api/rooms/BAD!/stats`);
  assert.equal(res.status, 400);
});

test('pull with a cursor only returns newer changes', async () => {
  const first = await post('room-cur', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000009', T, 'devAAAAAA')] });
  await post('room-cur', { deviceId: 'devAAAAAA', since: first.cursor, changes: [rec('rec000010', T + 1, 'devAAAAAA')] });
  const delta = await fetch(`${BASE}/api/rooms/room-cur/sync?since=${first.cursor}`).then((r) => r.json());
  assert.deepEqual(delta.changes.map((c) => c.id), ['rec000010']);
});

test('server-sent events announce a change to other devices', async () => {
  const ctl = new AbortController();
  const res = await fetch(`${BASE}/api/rooms/room-sse/events?deviceId=devListener`, { signal: ctl.signal });
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let seen = '';
  const pump = (async () => { try { for (;;) { const { value, done } = await reader.read(); if (done) break; seen += dec.decode(value); if (seen.includes('event: change')) break; } } catch { /* aborted */ } })();
  await new Promise((r) => setTimeout(r, 150));
  await post('room-sse', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000011', T, 'devAAAAAA')] });
  await Promise.race([pump, new Promise((r) => setTimeout(r, 2000))]);
  ctl.abort();
  assert.match(seen, /event: hello/);
  assert.match(seen, /event: change/);
});

test('does not serve server source or data files', async () => {
  for (const p of ['/server.js', '/data/store.json', '/package.json', '/..%2fserver.js']) {
    assert.equal((await fetch(BASE + p)).status, 404, p);
  }
});

test('data survives a restart', async () => {
  await post('room-persist', { deviceId: 'devAAAAAA', since: 0, changes: [rec('rec000012', T, 'devAAAAAA', { name: 'kept' })] });
  await new Promise((r) => setTimeout(r, 400)); // debounce flush
  child.kill();
  await new Promise((r) => child.once('exit', r));
  child = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: String(PORT), DATA_DIR: dataDir }, stdio: 'pipe' });
  for (let i = 0; i < 50; i++) { try { if ((await fetch(`${BASE}/api/health`)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 100)); }
  const after = await fetch(`${BASE}/api/rooms/room-persist/sync?since=0`).then((r) => r.json());
  assert.equal(after.changes[0].data.name, 'kept');
});
