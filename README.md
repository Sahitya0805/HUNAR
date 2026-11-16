## 🌌 Immersive 3D Experience
* **Live WebGL backdrop** (`scene.js`, Three.js): a particle farmland terrain and a voice orb with orbiting trade satellites. The orb reacts to the microphone level, sends a shockwave on a successful match, and docks in the corner as you scroll.
* **Dark green glass theme**: emerald and harvest-gold on a deep field, frosted-glass cards and a live WebGL scene.
* **3D interface**: pointer-tilt cards, a flip-over holographic **Skill Passport**, perspective view transitions, scroll-reveal sections and animated counters. Honors `prefers-reduced-motion`.
* **Explainable matching**: confidence meter, the exact keywords that matched (highlighted in the narrative) and the runner-up qualifications.
* **Intake register**: every evaluated beneficiary is saved in `localStorage` (works offline), with demand-by-trade bars and CSV export.
* **GIA proposal builder**: adjust per-artisan cost and van capex, preview the district proposal and download it as a PDF.
* **Wage-loss calculator**, **Hindi voice read-out** of the result, a **guided 10-second demo**, and a **command palette** (`Ctrl/Cmd + K`).
* Registry extended to 10 trades (tailor, welder, potter, handloom weaver added). Registry, centre and cluster data are illustrative prototype data.

## 🔄 Offline-first sync backend
`server.js` is a dependency-free Node server that serves the site **and** replicates every kiosk's intake register.

* **Offline first:** every write lands in the device (`localStorage`) and an outbox, so the kiosk works with no network. The outbox is pushed as soon as the server is reachable, with exponential backoff.
* **Rooms:** each CSC/block uses a room code (`?room=banda-csc-01`). Rooms are isolated; the share link in the Sync dialog opens the same room on another device.
* **Conflict-free merge:** last-writer-wins on `(updatedAt, deviceId)` with a hybrid clock; deletes are tombstones, so removals sync too and old writes cannot resurrect them.
* **Realtime:** Server-Sent Events push a ping on every change, so other kiosks update within milliseconds; a 25 s poll is the safety net. Presence shows how many kiosks are online.
* **Durable:** the store is written atomically to `data/store.json` (override with `DATA_DIR`). A service worker caches the app shell for offline loads.
* **Tested:** `npm test` runs 10 tests covering merge, tie-breaking, tombstones, room isolation, validation, SSE, file blocking and restart persistence.

```
GET  /api/rooms/:room/sync?since=N          -> { cursor, changes[] }
POST /api/rooms/:room/sync {deviceId,since,changes[]} -> { cursor, accepted, changes[] }
GET  /api/rooms/:room/events?deviceId=X     -> text/event-stream
GET  /api/rooms/:room/stats | /api/health
```

To try two kiosks locally, open the site in two different browsers (or one normal and one private window) with the same `?room=` code and evaluate a beneficiary in one.

## 💻 Tech Stack & Local Setup
* **Frontend:** HTML5, Tailwind CSS (CDN), Three.js r128, Lucide Icons, Leaflet.js
* **Speech & Audio:** Web Audio API (live analyser), Web Speech API (recognition + synthesis)
* **Matching:** Deterministic keyword scorer over the qualification register
* **GIS:** OpenStreetMap tiles via Leaflet
* **Export:** A4 Action Slip and GIA proposal (PDF) via html2pdf, intake register (CSV)

