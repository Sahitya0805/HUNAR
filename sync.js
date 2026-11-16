/**
 * HunarSync: offline-first replication client for server.js.
 *
 * Every write lands in localStorage first (so the kiosk works with no network), is queued in an
 * outbox, and is pushed whenever the server is reachable. Remote changes arrive through
 * Server-Sent Events (instant) with a slow poll as a safety net. Conflicts resolve
 * last-writer-wins on (updatedAt, deviceId); deletes are tombstones, so they sync too.
 *
 *   HunarSync.init()                      start (reads ?room= and ?api= from the URL)
 *   HunarSync.put('intakes', id, data)    create / update
 *   HunarSync.remove('intakes', id)       delete (tombstone)
 *   HunarSync.list('intakes')             live records, newest first
 *   HunarSync.on('status' | 'data' | 'remote', fn)
 */
(function () {
  'use strict';
  const KEY = 'hunar_sync_v2';
  const DEFAULT_ROOM = 'banda-csc-01';
  const ROOM_RE = /^[a-z0-9][a-z0-9-]{2,39}$/;
  const params = new URLSearchParams(location.search);

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage full or blocked: keep in memory */ } }
  };
  const rid = (n) => {
    const a = new Uint8Array(n); (self.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => { a[i] = Math.random() * 256; });
    return Array.from(a, (b) => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('');
  };

  const listeners = { status: [], data: [], remote: [] };
  const emit = (ev, payload) => listeners[ev].forEach((fn) => { try { fn(payload); } catch (e) { console.error(e); } });

  let deviceId = store.get(KEY + ':device', null);
  if (!deviceId) { deviceId = 'd' + rid(11); store.set(KEY + ':device', deviceId); }

  let room = DEFAULT_ROOM;
  let apiBase = '';
  let state = { records: {}, cursor: 0, outbox: {}, lastTs: 0 };
  let status = { state: 'connecting', online: 1, lastSync: null };
  let es = null, pushTimer = null, poll = null, running = false, again = false, backoff = 0, started = false;

  const stateKey = () => `${KEY}:${room}`;
  const persist = () => store.set(stateKey(), state);
  const pending = () => Object.keys(state.outbox).length;

  function setStatus(patch) {
    status = { ...status, ...patch };
    emit('status', info());
  }
  function info() {
    return { ...status, room, deviceId, pending: pending(), api: apiBase || location.origin, records: list('intakes').length };
  }

  /** Hybrid clock: never goes backwards, even if the device clock is adjusted. */
  function tick() { state.lastTs = Math.max(Date.now(), state.lastTs + 1); return state.lastTs; }

  function wins(inc, cur) {
    if (!cur) return true;
    if (inc.updatedAt !== cur.updatedAt) return inc.updatedAt > cur.updatedAt;
    return inc.deviceId > cur.deviceId;
  }

  function loadRoom(name) {
    room = name;
    state = { records: {}, cursor: 0, outbox: {}, lastTs: 0, ...store.get(stateKey(), {}) };
  }

  // ------------------------------------------------------------ public data API
  function put(collection, id, data) {
    const rec = { id, collection, data, updatedAt: tick(), deviceId, deleted: false };
    state.records[id] = rec; state.outbox[id] = rec;
    persist(); emit('data'); setStatus({}); queuePush();
    return rec;
  }
  function remove(collection, id) {
    const cur = state.records[id];
    if (!cur) return;
    const rec = { id, collection, data: null, updatedAt: tick(), deviceId, deleted: true };
    state.records[id] = rec; state.outbox[id] = rec;
    persist(); emit('data'); setStatus({}); queuePush();
  }
  function list(collection) {
    return Object.values(state.records)
      .filter((r) => !r.deleted && r.collection === collection)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // ------------------------------------------------------------ network
  function queuePush() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(syncNow, 120);
  }

  async function syncNow() {
    if (!apiBase && apiBase !== '') return;
    if (running) { again = true; return; }
    running = true;
    const sent = Object.values(state.outbox).slice(0, 400);
    setStatus({ state: 'syncing' });
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 10000);
    try {
      const res = await fetch(`${apiBase}/api/rooms/${room}/sync`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
        body: JSON.stringify({ deviceId, since: state.cursor, changes: sent })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const body = await res.json();
      if (!body || !Array.isArray(body.changes)) throw new Error('Not a HUNAR sync server');

      sent.forEach((c) => { const o = state.outbox[c.id]; if (o && o.updatedAt === c.updatedAt) delete state.outbox[c.id]; });
      let remote = 0;
      body.changes.forEach((ch) => {
        const cur = state.records[ch.id];
        if (ch.deviceId !== deviceId && wins(ch, cur)) remote++;
        if (wins(ch, cur)) { const { seq, ...rec } = ch; state.records[ch.id] = rec; }
        state.lastTs = Math.max(state.lastTs, ch.updatedAt);
      });
      state.cursor = body.cursor;
      persist();
      backoff = 0;
      setStatus({ state: 'synced', lastSync: Date.now() });
      emit('data');
      if (remote) emit('remote', { count: remote });
    } catch (e) {
      backoff = Math.min(60000, (backoff || 2000) * 2);
      setStatus({ state: navigator.onLine === false || e.name === 'AbortError' || /Failed to fetch|Load failed|NetworkError/i.test(e.message) ? 'offline' : 'local' });
      clearTimeout(pushTimer);
      pushTimer = setTimeout(syncNow, backoff);
    } finally {
      clearTimeout(to);
      running = false;
      if (again) { again = false; syncNow(); }
    }
  }

  function openStream() {
    if (es) { es.close(); es = null; }
    if (!('EventSource' in window)) return;
    es = new EventSource(`${apiBase}/api/rooms/${room}/events?deviceId=${deviceId}`);
    es.addEventListener('hello', (e) => { setStatus({ online: JSON.parse(e.data).online }); syncNow(); });
    es.addEventListener('change', () => syncNow());
    es.addEventListener('presence', (e) => setStatus({ online: JSON.parse(e.data).online }));
    // EventSource reconnects by itself; a manual sync after the link returns catches anything missed.
  }

  // ------------------------------------------------------------ lifecycle
  function init() {
    if (started) return;
    started = true;
    const qRoom = (params.get('room') || '').toLowerCase();
    const qApi = params.get('api');
    if (qApi) store.set(KEY + ':api', qApi.replace(/\/+$/, ''));
    apiBase = qApi !== null ? qApi.replace(/\/+$/, '') : store.get(KEY + ':api', '');
    const saved = store.get(KEY + ':room', DEFAULT_ROOM);
    const wanted = ROOM_RE.test(qRoom) ? qRoom : (ROOM_RE.test(saved) ? saved : DEFAULT_ROOM);
    store.set(KEY + ':room', wanted);
    loadRoom(wanted);

    window.addEventListener('online', syncNow);
    window.addEventListener('offline', () => setStatus({ state: 'offline' }));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
    poll = setInterval(syncNow, 25000);
    openStream();
    syncNow();
    emit('data');
  }

  function setRoom(name) {
    name = String(name || '').toLowerCase().trim();
    if (!ROOM_RE.test(name)) return false;
    persist();
    store.set(KEY + ':room', name);
    loadRoom(name);
    setStatus({ state: 'connecting', online: 1 });
    emit('data');
    openStream();
    syncNow();
    return true;
  }

  window.HunarSync = {
    init, put, remove, list, setRoom, syncNow, info,
    on(ev, fn) { listeners[ev].push(fn); },
    newId: () => 'i' + rid(14)
  };
})();
