import os

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 620" width="1000" height="620">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      text { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
      .title { font-size: 22px; font-weight: 800; fill: #0A281C; }
      .subtitle { font-size: 13px; font-weight: 600; fill: #855628; letter-spacing: 0.5px; }
      .metric-label { font-size: 13px; font-weight: 700; fill: #1A202C; }
      .sublabel { font-size: 11px; font-weight: 600; fill: #718096; }
      .bar-val { font-size: 12px; font-weight: 700; }
      .delta-badge { font-size: 11px; font-weight: 800; fill: #047857; }
    </style>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F382A" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#78350F" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#881337" />
      <stop offset="100%" stop-color="#E11D48" />
    </linearGradient>
    <filter id="softShadow" x="-2%" y="-4%" width="104%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.06"/>
    </filter>
  </defs>

  <!-- Clean Warm Sandstone / Linen Agricultural Canvas Background -->
  <rect width="1000" height="620" fill="#FAF7F2" rx="16"/>
  <rect x="20" y="20" width="960" height="580" fill="#FFFFFF" rx="12" stroke="#E2D9CC" stroke-width="1.5" filter="url(#softShadow)"/>

  <!-- Top Header with Agricultural Emblem Vibe -->
  <g transform="translate(50, 52)">
    <circle cx="16" cy="16" r="16" fill="#0A281C" />
    <path d="M16 8 C18 12 21 14 16 20 C11 14 14 12 16 8 Z" fill="#E2C17C"/>
    <path d="M16 14 C19 17 20 21 16 24 C12 21 13 17 16 14 Z" fill="#10B981"/>
    
    <text x="44" y="14" class="subtitle">PROJECT HUNAR (हुनर) • RURAL LIVELIHOOD IMPACT BENCHMARKS</text>
    <text x="44" y="34" class="title">Horizontal Impact Comparison: Traditional vs. Hunar Engine</text>
  </g>

  <!-- Legend -->
  <g transform="translate(680, 56)">
    <rect x="0" y="0" width="12" height="12" rx="3" fill="#B45309"/>
    <text x="18" y="10" font-size="11" font-weight="600" fill="#4A5568">Traditional Scheme (Before)</text>
    
    <rect x="0" y="18" width="12" height="12" rx="3" fill="#0F382A"/>
    <text x="18" y="28" font-size="11" font-weight="700" fill="#0F382A">Project Hunar (After)</text>
  </g>

  <line x1="50" y1="105" x2="950" y2="105" stroke="#EDE6DC" stroke-width="1.5" />

  <!-- ================= METRIC 1: TIME TO CERTIFY ================= -->
  <g transform="translate(50, 130)">
    <text x="0" y="15" class="metric-label">1. Course Duration to Certification</text>
    <text x="0" y="32" class="sublabel">180-Day Classroom vs. 2-Day Practical RPL</text>
    <text x="890" y="22" text-anchor="end" class="delta-badge">-98.8% Time Saved</text>

    <!-- Before Bar -->
    <rect x="260" y="5" width="480" height="18" rx="4" fill="#D97706" opacity="0.85"/>
    <text x="750" y="19" class="bar-val" fill="#92400E">180 Days (6 Months)</text>

    <!-- After Bar -->
    <rect x="260" y="28" width="14" height="18" rx="4" fill="url(#greenGrad)"/>
    <text x="282" y="42" class="bar-val" fill="#065F46">2 Days (16h RPL)</text>
  </g>

  <!-- ================= METRIC 2: FORFEITED WAGES ================= -->
  <g transform="translate(50, 215)">
    <text x="0" y="15" class="metric-label">2. Forfeited Daily Wage Income</text>
    <text x="0" y="32" class="sublabel">Family daily bread lost during training</text>
    <text x="890" y="22" text-anchor="end" class="delta-badge">100% Wage Protected</text>

    <!-- Before Bar -->
    <rect x="260" y="5" width="440" height="18" rx="4" fill="#E11D48" opacity="0.85"/>
    <text x="710" y="19" class="bar-val" fill="#BE123C">₹42,000 Lost</text>

    <!-- After Bar -->
    <rect x="260" y="28" width="4" height="18" rx="2" fill="url(#greenGrad)"/>
    <text x="272" y="42" class="bar-val" fill="#065F46">₹0 (Full Protection)</text>
  </g>

  <!-- ================= METRIC 3: CANDIDATE DROPOUT RATE ================= -->
  <g transform="translate(50, 300)">
    <text x="0" y="15" class="metric-label">3. Candidate Dropout Rate</text>
    <text x="0" y="32" class="sublabel">Attrition caused by poverty &amp; commute distance</text>
    <text x="890" y="22" text-anchor="end" class="delta-badge">-94.4% Dropouts</text>

    <!-- Before Bar -->
    <rect x="260" y="5" width="420" height="18" rx="4" fill="#B45309" opacity="0.85"/>
    <text x="690" y="19" class="bar-val" fill="#92400E">72% Dropout Rate</text>

    <!-- After Bar -->
    <rect x="260" y="28" width="28" height="18" rx="4" fill="url(#greenGrad)"/>
    <text x="296" y="42" class="bar-val" fill="#065F46">4% (Completion Guaranteed)</text>
  </g>

  <!-- ================= METRIC 4: COMMUTE DISTANCE ================= -->
  <g transform="translate(50, 385)">
    <text x="0" y="15" class="metric-label">4. Commute Distance to Center</text>
    <text x="0" y="32" class="sublabel">Strict ≤ 25 km one-day home return radius</text>
    <text x="890" y="22" text-anchor="end" class="delta-badge">Same-Day Home Return</text>

    <!-- Before Bar -->
    <rect x="260" y="5" width="380" height="18" rx="4" fill="#B45309" opacity="0.85"/>
    <text x="650" y="19" class="bar-val" fill="#92400E">65 km (Urban ITI)</text>

    <!-- After Bar -->
    <rect x="260" y="28" width="85" height="18" rx="4" fill="url(#greenGrad)"/>
    <text x="354" y="42" class="bar-val" fill="#065F46">12.8 km (Local KVK Hub)</text>
  </g>

  <!-- ================= METRIC 5: MONTHLY INCOME ================= -->
  <g transform="translate(50, 470)">
    <text x="0" y="15" class="metric-label">5. Post-Certification Monthly Income</text>
    <text x="0" y="32" class="sublabel">ODOP, JJM &amp; PM-KUSUM contract linkage</text>
    <text x="890" y="22" text-anchor="end" class="delta-badge">+49.5% Income Uplift</text>

    <!-- Before Bar -->
    <rect x="260" y="5" width="280" height="18" rx="4" fill="#94A3B8"/>
    <text x="550" y="19" class="bar-val" fill="#475569">₹9,500 / month (Informal)</text>

    <!-- After Bar -->
    <rect x="260" y="28" width="420" height="18" rx="4" fill="url(#greenGrad)"/>
    <text x="690" y="42" class="bar-val" fill="#065F46">₹14,200 / month (Empaneled)</text>
  </g>

  <!-- Bottom Policy Footer Bar -->
  <g transform="translate(50, 560)">
    <rect x="0" y="0" width="900" height="28" rx="6" fill="#F4EFE6" stroke="#E2D9CC" stroke-width="1"/>
    <text x="14" y="18" font-size="11" font-weight="700" fill="#855628">MoSJE PM-AJAY Policy Outcome:</text>
    <text x="245" y="18" font-size="11" font-weight="600" fill="#2D3748">Protects village household income, resolves the 70% dropout paradox &amp; targets GIA Mobile Van grants.</text>
  </g>
</svg>
"""

with open("/Users/sahityasingh/.gemini/antigravity/scratch/hunar-app/hunar_horizontal_graph.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Horizontal graph SVG created successfully!")
