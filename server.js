#!/usr/bin/env node
/**
 * HUNAR sync server. Zero dependencies (Node 18+).
 *
 *   node server.js            -> http://localhost:3000  (static site + API)
 *   PORT=8080 DATA_DIR=/var/hunar node server.js
 *
 * Model
 *   - Devices (kiosks) join a "room" (e.g. a CSC / block code). Each room has its own change log.
 *   - Every record has an id, a hybrid timestamp (updatedAt, ms) and the deviceId that wrote it.
 *   - Merge is last-writer-wins on (updatedAt, deviceId); deletes are tombstones, so they sync too.
 *   - Every accepted change gets a monotonically increasing `seq`. Clients pull "everything after seq N".
 *   - Server-Sent Events push a ping on every change so other devices sync within milliseconds.
 *
 * API  (all under /api/rooms/:room)
 *   GET  /sync?since=N                 -> { cursor, changes[] }
 *   POST /sync  { deviceId, since, changes[] } -> { cursor, accepted, changes[] }
 *   GET  /events?deviceId=X            -> text/event-stream (hello | change | presence)
 *   GET  /stats                        -> { records, cursor, online }
 *   GET  /api/health
 */
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const MAX_BODY = 1024 * 1024;
const MAX_CHANGES = 500;
const MAX_RECORD_BYTES = 8 * 1024;
const COLLECTIONS = new Set(['intakes']);
const ROOM_RE = /^[a-z0-9][a-z0-9-]{2,39}$/;
const ID_RE = /^[A-Za-z0-9_-]{6,64}$/;

// ---------------------------------------------------------------- store
/** rooms[room] = { seq: number, records: { [id]: Record } } */
let rooms = Object.create(null);
let saveTimer = null;

function load() {
  try {
    const raw = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    for (const [name, r] of Object.entries(raw.rooms || {})) {
      if (ROOM_RE.test(name) && r && typeof r.seq === 'number' && r.records) rooms[name] = r;
    }
  } catch (e) {
    if (e.code !== 'ENOENT') console.error('Could not read store, starting empty:', e.message);
  }
}

function saveSoon() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => { saveTimer = null; saveNow(); }, 150);
}

function saveNow() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = STORE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify({ rooms }));
    fs.renameSync(tmp, STORE_FILE); // atomic replace: a crash never leaves a half-written store
  } catch (e) { console.error('Save failed:', e.message); }
}

function getRoom(name) {
  return rooms[name] || (rooms[name] = { seq: 0, records: Object.create(null) });
}

/** Is incoming (t, d) newer than existing? Ties broken by deviceId so every replica converges. */
function wins(inc, cur) {
  if (!cur) return true;
  if (inc.updatedAt !== cur.updatedAt) return inc.updatedAt > cur.updatedAt;
  return inc.deviceId > cur.deviceId;
}

function cleanChange(c) {
  if (!c || typeof c !== 'object') return null;
  if (!COLLECTIONS.has(c.collection) || !ID_RE.test(String(c.id))) return null;
  const updatedAt = Number(c.updatedAt);
  if (!Number.isFinite(updatedAt) || updatedAt <= 0 || updatedAt > Date.now() + 24 * 3600e3) return null;
  const deviceId = String(c.deviceId || '').slice(0, 64);
  if (!ID_RE.test(deviceId)) return null;
  const deleted = c.deleted === true;
  let data = null;
  if (!deleted) {
    if (!c.data || typeof c.data !== 'object' || Array.isArray(c.data)) return null;
    if (Buffer.byteLength(JSON.stringify(c.data)) > MAX_RECORD_BYTES) return null;
    data = c.data;
  }
  return { id: String(c.id), collection: c.collection, data, updatedAt, deviceId, deleted };
}

function applyChanges(room, changes) {
  let accepted = 0;
  for (const raw of changes) {
    const ch = cleanChange(raw);
    if (!ch) continue;
    const cur = room.records[ch.id];
    if (!wins(ch, cur)) continue;
    room.records[ch.id] = { ...ch, seq: ++room.seq };
    accepted++;
  }
  if (accepted) saveSoon();
  return accepted;
}

function changesSince(room, since) {
  const out = [];
  for (const id in room.records) if (room.records[id].seq > since) out.push(room.records[id]);
  return out.sort((a, b) => a.seq - b.seq);
}

// ---------------------------------------------------------------- realtime (SSE)
/** clients[room] = Set<{ res, deviceId }> */
const clients = Object.create(null);

function online(room) {
  return new Set([...(clients[room] || [])].map((c) => c.deviceId)).size;
}
function broadcast(room, event, payload, exceptDevice) {
  for (const c of clients[room] || []) {
    if (exceptDevice && c.deviceId === exceptDevice) continue;
    c.res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
  }
}

// ---------------------------------------------------------------- http helpers
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function json(res, status, body) {
  const s = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS });
  res.end(s);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('Body too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(Object.assign(new Error('Invalid JSON'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword', '.rtf': 'application/rtf', '.webmanifest': 'application/manifest+json'
};
const PUBLIC_FILES = new Set([
  'index.html', 'app.js', 'scene.js', 'sync.js', 'styles.css', 'sw.js', 'manifest.webmanifest', 'hunar-logo.svg', 'hunar-website-logo.svg',
  'hunar-report.html', 'hunar_horizontal_graph.svg', 'hunar_google_docs.html',
  'HUNAR_Executive_Report.pdf', 'HUNAR_Executive_Report.docx', 'HUNAR_Executive_Report.doc'
]);

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname).replace(/^\/+/, '') || 'index.html';
  if (!PUBLIC_FILES.has(rel)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
  const file = path.join(ROOT, rel);
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': rel === 'sw.js' ? 'no-cache' : 'no-cache'
    });
    res.end(buf);
  });
}

// ---------------------------------------------------------------- router
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  try {
    if (req.method === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }

    if (p === '/api/health') return json(res, 200, { ok: true, rooms: Object.keys(rooms).length, uptime: Math.round(process.uptime()) });

    const m = p.match(/^\/api\/rooms\/([^/]+)\/(sync|events|stats)$/);
    if (m) {
      const [, roomName, action] = m;
      if (!ROOM_RE.test(roomName)) return json(res, 400, { error: 'Room code must be 3-40 chars: a-z, 0-9, hyphen.' });
      const room = getRoom(roomName);

      if (action === 'stats' && req.method === 'GET') {
        const live = Object.values(room.records).filter((r) => !r.deleted).length;
        return json(res, 200, { records: live, cursor: room.seq, online: online(roomName) });
      }

      if (action === 'sync' && req.method === 'GET') {
        const since = Math.max(0, Number(url.searchParams.get('since')) || 0);
        return json(res, 200, { cursor: room.seq, changes: changesSince(room, since) });
      }

      if (action === 'sync' && req.method === 'POST') {
        const body = await readBody(req);
        const changes = Array.isArray(body.changes) ? body.changes.slice(0, MAX_CHANGES) : [];
        const since = Math.max(0, Number(body.since) || 0);
        const deviceId = String(body.deviceId || '');
        const accepted = applyChanges(room, changes);
        if (accepted) broadcast(roomName, 'change', { cursor: room.seq }, deviceId);
        return json(res, 200, { cursor: room.seq, accepted, changes: changesSince(room, since) });
      }

      if (action === 'events' && req.method === 'GET') {
        const deviceId = String(url.searchParams.get('deviceId') || '').slice(0, 64);
        res.writeHead(200, {
          'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive', 'X-Accel-Buffering': 'no', ...CORS
        });
        const client = { res, deviceId: ID_RE.test(deviceId) ? deviceId : 'anon-' + Math.random().toString(36).slice(2, 10) };
        (clients[roomName] = clients[roomName] || new Set()).add(client);
        res.write(`retry: 2000\nevent: hello\ndata: ${JSON.stringify({ cursor: room.seq, online: online(roomName) })}\n\n`);
        broadcast(roomName, 'presence', { online: online(roomName) });
        const beat = setInterval(() => res.write(': hb\n\n'), 20000);
        req.on('close', () => {
          clearInterval(beat);
          clients[roomName].delete(client);
          broadcast(roomName, 'presence', { online: online(roomName) });
        });
        return;
      }
      return json(res, 405, { error: 'Method not allowed' });
    }

    if (p.startsWith('/api/')) return json(res, 404, { error: 'Unknown endpoint' });
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    serveStatic(req, res, p);
  } catch (e) {
    if (!res.headersSent) json(res, e.status || 500, { error: e.status ? e.message : 'Server error' });
    if (!e.status) console.error(e);
  }
});

load();
process.on('SIGINT', () => { saveNow(); process.exit(0); });
process.on('SIGTERM', () => { saveNow(); process.exit(0); });
server.listen(PORT, () => {
  console.log(`HUNAR running  ->  http://localhost:${PORT}`);
  console.log(`Sync data      ->  ${STORE_FILE}`);
});
