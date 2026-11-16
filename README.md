## 🌌 Immersive 3D Experience
* **Live WebGL backdrop** (`scene.js`, Three.js): a particle farmland terrain and a voice orb with orbiting trade satellites. The orb reacts to the microphone level, sends a shockwave on a successful match, and docks in the corner as you scroll.
* **3D interface**: pointer-tilt glass cards, a flip-over holographic **Skill Passport**, perspective view transitions, scroll-reveal sections and animated counters. Honors `prefers-reduced-motion`.
* **Explainable matching**: confidence meter, the exact keywords that matched (highlighted in the narrative) and the runner-up qualifications.
* **Intake register**: every evaluated beneficiary is saved in `localStorage` (works offline), with demand-by-trade bars and CSV export.
* **GIA proposal builder**: adjust per-artisan cost and van capex, preview the district proposal and download it as a PDF.
* **Wage-loss calculator**, **Hindi voice read-out** of the result, a **guided 10-second demo**, and a **command palette** (`Ctrl/Cmd + K`).
* Registry extended to 10 trades (tailor, welder, potter, handloom weaver added). Registry, centre and cluster data are illustrative prototype data.

## 💻 Tech Stack & Local Setup
* **Frontend:** HTML5, Tailwind CSS (CDN), Three.js r128, Lucide Icons, Leaflet.js
* **Speech & Audio:** Web Audio API (live analyser), Web Speech API (recognition + synthesis)
* **Matching:** Deterministic keyword scorer over the qualification register
* **GIS:** OpenStreetMap tiles via Leaflet
* **Export:** A4 Action Slip and GIA proposal (PDF) via html2pdf, intake register (CSV)

