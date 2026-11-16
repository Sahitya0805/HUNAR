/**
 * Hunar (हुनर) — voice-driven rural RPL matching and PM-AJAY livelihood mapping.
 * Plain browser JS: Web Speech + Web Audio for intake, a deterministic keyword
 * scorer for matching, Leaflet for the district map, localStorage for the register.
 * The 3D backdrop lives in scene.js and is driven through window.HUNAR_FX.
 */

// ============================================================================
// 1. QUALIFICATION REGISTER (illustrative prototype data)
// ============================================================================
const NQR_DATABASE = [
  {
    qpCode: "FIC/Q0104",
    title: "Pulse, Grain & Spice Processing Operator",
    titleHi: "दाल, अनाज और मसाला प्रसंस्करण ऑपरेटर",
    sector: "Food Industry Capacity & Skill Initiative (FICSI)",
    nsqfLevel: 4,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "Agro-FoodTech (ODOP)",
    icon: "wheat",
    keywords: ["daal", "pulse", "grain", "spice", "chana", "masala", "grain mill", "flour", "atta", "grading", "milling", "pisai", "chakki", "rice", "gehu", "kheti", "दाल", "चना", "मसाला", "पिसाई", "ग्रेडिंग", "मिल", "चक्की", "आटा", "मसाले", "राइस", "गेहूं", "अनाज", "फसल"],
    nearestCenter: "KVK Agro Science Center, Banda (11.2 km)",
    distanceKm: 11.2,
    centerAvailable: true,
    stipend: "₹500 DBT + NSQF Level 4 Certification",
    nosList: [
      "FIC/N0114: Perform pre-processing operations (cleaning, sorting, moisture grading)",
      "FIC/N0115: Operate modern pulverizers, dehullers & micro-milling equipment",
      "FIC/N0116: Maintain food hygiene, sanitary standards & moisture packaging (FSSAI norms)",
      "FIC/N9001: Execute preventive machine maintenance and local workplace safety"
    ],
    sampleUtterance: "हम 7 साल से दाल मिल में काम करते हैं, चना और अरहर का ग्रेडिंग और पिसाई करते हैं।"
  },
  {
    qpCode: "AGR/Q1101",
    title: "Solar Agri-Pump & Micro-Irrigation Technician",
    titleHi: "सोलर कृषि पंप और सूक्ष्म सिंचाई तकनीशियन",
    sector: "Agriculture Skill Council of India (ASCI)",
    nsqfLevel: 4,
    rplDuration: "16 Hours (2-Day Practical Assessment)",
    category: "Farm Machinery & Solar",
    icon: "sun",
    keywords: ["solar", "pump", "tubewell", "motor", "sinchai", "borewell", "electrician", "panel", "bijli", "wire", "taar", "repair", "pipe", "boring", "सोलर", "पंप", "मोटर", "सिंचाई", "ट्यूबवेल", "रिपेयर", "तार", "बिजली", "बोरिंग", "पानी का पंप", "पैनल", "सोलर पंप"],
    nearestCenter: "ITI Rural Skill Campus, Baberu (14.5 km)",
    distanceKm: 14.5,
    centerAvailable: true,
    stipend: "PM Vishwakarma Toolset Grant + DBT",
    nosList: [
      "AGR/N1101: Install and test DC submersible solar photovoltaic pump arrays",
      "AGR/N1102: Troubleshoot motor controller units, inverters, and switchgears",
      "AGR/N1103: Service micro-drip and sprinkler emitter filtration systems",
      "AGR/N9908: Comply with electrical high-voltage safety standards on farms"
    ],
    sampleUtterance: "हम 8 साल से गाँव में ट्यूबवेल और सोलर पंप की मोटर रिपेयर करते हैं। खेत की सिंचाई वाला सारा काम जानते हैं।"
  },
  {
    qpCode: "CON/Q0103",
    title: "Rural Mason (Water Harvesting & Farm Structures)",
    titleHi: "ग्रामीण राजमिस्त्री (जल संचयन और कृषि संरचनाएँ)",
    sector: "Construction Skill Development Council (CSDCI)",
    nsqfLevel: 4,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "Rural Infrastructure",
    icon: "brick-wall",
    keywords: ["rajmistri", "chhat", "dhalai", "itai", "jorai", "mason", "bricklayer", "water tank", "plaster", "cement", "construction", "tank", "mistri", "raj", "raaj", "house", "makaan", "grah nirman", "राजमिस्त्री", "मिस्त्री", "जोड़ाई", "ईंट", "छत", "ढलाई", "टंकी", "प्लास्टर", "सीमेंट", "मकान", "दीवार", "भवन"],
    nearestCenter: "PMKK Center, Naraini Road, Banda (12.4 km)",
    distanceKm: 12.4,
    centerAvailable: true,
    stipend: "₹500 DBT + Construction Board Card",
    nosList: [
      "CON/N0111: Lay brickwork, blockwork, and stone masonry for farm boundaries & water tanks",
      "CON/N0112: Apply waterproof cement plastering on groundwater recharge structures",
      "CON/N0113: Reinforce and cast shuttering for rural roof slabs and check-dams",
      "CON/N9001: Adhere to structural scaffolding and personal safety protocols"
    ],
    sampleUtterance: "हम 9 साल से राजमिस्त्री का काम कर रहे हैं, खेत की मेड़बंदी, पानी की टंकी और छत ढलाई का काम करते हैं।"
  },
  {
    qpCode: "AGR/Q0801",
    title: "Dairy Farmer & Milk Chilling Operator",
    titleHi: "डेयरी किसान और दूध चिलिंग ऑपरेटर",
    sector: "Agriculture Skill Council of India (ASCI)",
    nsqfLevel: 3,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "Dairy & Livestock",
    icon: "milk",
    keywords: ["dairy", "doodh", "milk", "pashupalan", "cattle", "gaay", "bhains", "chiller", "ghee", "makkhan", "डेयरी", "दूध", "गाय", "भैंस", "पशुपालन", "चिलर", "दूधवाला", "डेरी", "पशु"],
    nearestCenter: "Banda Milk Producers Cooperative Hub (8.5 km)",
    distanceKm: 8.5,
    centerAvailable: true,
    stipend: "NABARD Livestock Credit Subsidy",
    nosList: [
      "AGR/N0801: Manage scientific livestock housing, breeding, and nutrition feed rations",
      "AGR/N0802: Operate bulk milk chillers (BMC), lactometers, and SNF testers",
      "AGR/N0803: Prevent common cattle diseases and manage hygienic milking cycles",
      "AGR/N9901: Comply with clean dairy processing norms and waste compost recycling"
    ],
    sampleUtterance: "हम 6 साल से 15 गाय-भैंस का दूध उत्पादन और दुग्ध संग्रह केंद्र में चिलर मशीन चलाते हैं।"
  },
  {
    qpCode: "HCS/Q8701",
    title: "Rural Carpenter & Farm Implement Fabricator",
    titleHi: "ग्रामीण बढ़ई और कृषि उपकरण निर्माता",
    sector: "Handicrafts Sector Skill Council (HCSSC)",
    nsqfLevel: 3,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "PM Vishwakarma Artisan",
    icon: "hammer",
    keywords: ["khaati", "badhai", "carpenter", "lakdi", "plough", "woodwork", "trolly", "cart", "furniture", "wood", "बढ़ई", "लकड़ी", "हल", "ट्रॉली", "फर्नीचर", "खाती", "सुथार", "दरवाजा"],
    nearestCenter: "District Rural Extension Center, Banda (19.0 km)",
    distanceKm: 19.0,
    centerAvailable: true,
    stipend: "PM Vishwakarma ₹15,000 Toolkit E-Voucher",
    nosList: [
      "HCS/N8701: Select seasoned timber and fabricate traditional & mechanized seed ploughs",
      "HCS/N8702: Operate wood planers, mortise machines, and angle jointers safely",
      "HCS/N8703: Repair bullock carts, tractor wooden trollies, and threshing frames",
      "HCS/N9001: Maintain hand and power woodworking implements"
    ],
    sampleUtterance: "हम 10 साल से गाँव में बढ़ई का काम कर रहे हैं, लकड़ी का हल, बैलगाड़ी और ट्रैक्टर की ट्रॉली बनाते हैं।"
  },
  {
    qpCode: "LSS/Q5501",
    title: "Footwear & Leather Goods Artisan",
    titleHi: "जूता और चमड़ा उत्पाद कारीगर",
    sector: "Leather Sector Skill Council (LSSC)",
    nsqfLevel: 3,
    rplDuration: "14 Hours (2-Day Practical Assessment)",
    category: "Traditional Crafts",
    icon: "footprints",
    keywords: ["chamda", "leather", "mochi", "joota", "chappal", "cobbler", "shoe", "belt", "slippers", "sandal", "चमड़ा", "चमड़े", "जूता", "चप्पल", "मोची", "जूते", "बेल्ट"],
    nearestCenter: "State Leather Training Institute, Kanpur (58.0 km)",
    distanceKm: 58.0,
    centerAvailable: false,
    stipend: "Requires PM-AJAY GIA Mobile Assessment Hub",
    nosList: [
      "LSS/N5501: Perform pattern cutting, leather skiving, and clicking operations",
      "LSS/N5502: Hand-stitch and machine-stitch raw hide footwear uppers and insoles",
      "LSS/N5503: Treat, dye, and polish traditional handcrafted leather products",
      "LSS/N9001: Handle adhesives, tanning solvents, and workshop safety"
    ],
    sampleUtterance: "हम कई पीढ़ियों से चमड़े के जूते और बेल्ट हाथ से बनाते हैं, कोई प्रमाण पत्र नहीं है और शहर 60 किमी दूर है।"
  },
  {
    qpCode: "AMH/Q1947",
    title: "Self-Employed Tailor",
    titleHi: "स्व-नियोजित दर्जी",
    sector: "Apparel, Made-Ups & Home Furnishing Sector Skill Council (AMHSSC)",
    nsqfLevel: 4,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "PM Vishwakarma Artisan",
    icon: "scissors",
    keywords: ["silai", "darzi", "darji", "tailor", "stitching", "kapda", "blouse", "kurta", "सिलाई", "दर्जी", "कपड़ा", "कपड़े", "ब्लाउज", "कुर्ता", "सिलती", "सिलते"],
    nearestCenter: "RSETI Training Hall, Banda (9.8 km)",
    distanceKm: 9.8,
    centerAvailable: true,
    stipend: "PM Vishwakarma ₹15,000 Toolkit E-Voucher",
    nosList: [
      "AMH/N1947: Take measurements and draft patterns for garments",
      "AMH/N1948: Cut, stitch and finish men's, women's and children's wear",
      "AMH/N1949: Carry out alterations and maintain the sewing machine",
      "AMH/N0103: Maintain a safe and hygienic work area"
    ],
    sampleUtterance: "हम 12 साल से गाँव में सिलाई का काम करते हैं, ब्लाउज, कुर्ता और बच्चों के कपड़े सिलते हैं।"
  },
  {
    qpCode: "CSC/Q0204",
    title: "Manual Metal Arc Welder (Farm Fabrication)",
    titleHi: "मैनुअल मेटल आर्क वेल्डर (कृषि फैब्रिकेशन)",
    sector: "Capital Goods Skill Council (CGSC)",
    nsqfLevel: 3,
    rplDuration: "16 Hours (2-Day Practical Assessment)",
    category: "Farm Machinery & Solar",
    icon: "flame",
    keywords: ["welding", "welder", "weld", "gas cutting", "fabrication", "grill", "lohar", "वेल्डिंग", "वेल्डर", "ग्रिल", "गेट", "लोहा", "लोहार", "लोहे"],
    nearestCenter: "Government ITI Workshop, Atarra (22.0 km)",
    distanceKm: 22.0,
    centerAvailable: true,
    stipend: "₹500 DBT + PM Vishwakarma Toolkit",
    nosList: [
      "CSC/N0204: Prepare joints and perform manual metal arc welding",
      "CSC/N0201: Cut and shape metal with oxy-fuel gas cutting",
      "CSC/N0205: Repair tractor trolleys, harrows and farm implements",
      "CSC/N1335: Use welding PPE and follow fire-safety practice"
    ],
    sampleUtterance: "हम 5 साल से वेल्डिंग का काम करते हैं, ट्रैक्टर ट्रॉली, लोहे के गेट और ग्रिल बनाते हैं।"
  },
  {
    qpCode: "HCS/Q1201",
    title: "Pottery & Terracotta Artisan",
    titleHi: "मिट्टी के बर्तन और टेराकोटा कारीगर",
    sector: "Handicrafts Sector Skill Council (HCSSC)",
    nsqfLevel: 3,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "Traditional Crafts",
    icon: "amphora",
    keywords: ["kumhar", "potter", "pottery", "mitti", "clay", "matka", "diya", "terracotta", "कुम्हार", "मिट्टी", "चाक", "मटका", "मटके", "दीया", "दीये", "घड़ा", "घड़े"],
    nearestCenter: "Mati Kala Common Facility Centre, Banda (16.5 km)",
    distanceKm: 16.5,
    centerAvailable: true,
    stipend: "Electric Potter's Wheel Grant + DBT",
    nosList: [
      "HCS/N1201: Prepare and wedge clay to working consistency",
      "HCS/N1202: Throw, shape and trim ware on the potter's wheel",
      "HCS/N1203: Dry, load and fire ware in an updraft kiln",
      "HCS/N9912: Work safely around kilns and manage clay waste"
    ],
    sampleUtterance: "हम बचपन से कुम्हार का काम करते हैं, चाक पर मिट्टी के मटके, घड़े और दीये बनाते हैं।"
  },
  {
    qpCode: "TSC/Q7303",
    title: "Two-Shaft Handloom Weaver",
    titleHi: "दो-शाफ्ट हथकरघा बुनकर",
    sector: "Textile Sector Skill Council (TSC)",
    nsqfLevel: 4,
    rplDuration: "14 Hours (2-Day Practical Assessment)",
    category: "Traditional Crafts",
    icon: "shirt",
    keywords: ["handloom", "weaver", "weaving", "bunkar", "kargha", "saree", "loom", "बुनकर", "हथकरघा", "करघा", "करघे", "साड़ी", "बुनाई", "बुनते"],
    nearestCenter: "Handloom Cluster Facility, Mau Ranipur (62.0 km)",
    distanceKm: 62.0,
    centerAvailable: false,
    stipend: "Requires PM-AJAY GIA Mobile Assessment Hub",
    nosList: [
      "TSC/N7303: Prepare warp and weft and set up a two-shaft loom",
      "TSC/N7304: Weave plain and twill cloth to the required picks per inch",
      "TSC/N7305: Identify and mend weaving defects",
      "TSC/N9001: Maintain the loom and the work area"
    ],
    sampleUtterance: "हम 15 साल से हथकरघा पर साड़ी और गमछा बुनते हैं, पूरा परिवार बुनकर है।"
  }
];

// ============================================================================
// 2. DISTRICT CLUSTER DATA
// ============================================================================
const DISTRICT_DATASETS = {
  banda: {
    name: "Banda District (UP · Bundelkhand)", short: "Banda",
    center: [25.4800, 80.3300], zoom: 10,
    clusters: [
      { name: "Tindwari Agro Cluster", lat: 25.6200, lng: 80.3800, artisans: 189, trade: "Pulse & Spice Milling (ODOP)", status: "Reachable (11 km)", isVoid: false },
      { name: "Baberu Farm Machinery Hub", lat: 25.5500, lng: 80.5200, artisans: 145, trade: "Solar & Agri Pump Repair", status: "Reachable (14 km)", isVoid: false },
      { name: "Mahuwa Rural Artisan Cluster", lat: 25.3200, lng: 80.4500, artisans: 142, trade: "Leather Crafts", status: "Void (58 km, needs mobile hub)", isVoid: true },
      { name: "Naraini Construction Cluster", lat: 25.1900, lng: 80.4800, artisans: 310, trade: "Rural Masons & Tank Builders", status: "Reachable (12 km)", isVoid: false }
    ]
  },
  vidarbha: {
    name: "Amravati District (Maharashtra · Vidarbha)", short: "Amravati",
    center: [21.1500, 77.6500], zoom: 9,
    clusters: [
      { name: "Achalpur Handloom & Ginning", lat: 21.2580, lng: 77.5090, artisans: 420, trade: "Cotton Spinning & Weaving", status: "Reachable (15 km)", isVoid: false },
      { name: "Melghat Tribal Forest Crafts", lat: 21.4900, lng: 77.2000, artisans: 280, trade: "Bamboo & Herbal Processing", status: "Void (64 km, remote)", isVoid: true },
      { name: "Morshi Citrus Pack-house", lat: 21.3200, lng: 78.0100, artisans: 340, trade: "Fruit Grading & Cold-Chain", status: "Reachable (9 km)", isVoid: false },
      { name: "Chandur Rural Implement Hub", lat: 20.7800, lng: 77.9800, artisans: 210, trade: "Tractor Implements Welding", status: "Reachable (18 km)", isVoid: false }
    ]
  },
  salem: {
    name: "Salem District (Tamil Nadu)", short: "Salem",
    center: [11.6000, 78.2500], zoom: 9,
    clusters: [
      { name: "Attur Tapioca & Sago Cluster", lat: 11.5900, lng: 78.6000, artisans: 540, trade: "Sago & Agro Starch Operator", status: "Reachable (8 km)", isVoid: false },
      { name: "Mecheri Livestock & Dairy Hub", lat: 11.8300, lng: 77.9400, artisans: 390, trade: "Sheep & Dairy Processing", status: "Reachable (12 km)", isVoid: false },
      { name: "Kolli Hills Tribal Herbal Hub", lat: 11.3100, lng: 78.3400, artisans: 175, trade: "Spices & Pepper Grading", status: "Void (48 km hill transit)", isVoid: true }
    ]
  },
  gaya: {
    name: "Gaya District (Bihar)", short: "Gaya",
    center: [24.8400, 85.0200], zoom: 10,
    clusters: [
      { name: "Manpur Agro & Jaggery Cluster", lat: 24.8100, lng: 85.0300, artisans: 380, trade: "Tilkut & Agro Confectionery", status: "Reachable (6 km)", isVoid: false },
      { name: "Barabar Stone Artisans", lat: 25.0050, lng: 85.0590, artisans: 220, trade: "Stone Carving & Masonry", status: "Void (46 km)", isVoid: true },
      { name: "Bodhgaya Handicrafts Village", lat: 24.6960, lng: 84.9910, artisans: 410, trade: "Wood & Souvenir Craft", status: "Reachable (10 km)", isVoid: false }
    ]
  }
};

// ============================================================================
// 3. SAMPLE BENEFICIARY PROFILES
// ============================================================================
const DEMO_PROFILES = {
  agro_mill: { name: "Chhedilal Verma", location: "Tindwari Village, Banda (UP)", emoji: "🌾",
    text: "हम 7 साल से दाल मिल में काम करते हैं, चना और अरहर का ग्रेडिंग और पिसाई करते हैं। कोई सरकारी प्रमाण पत्र नहीं है।", expYears: "7 Years Practical Work" },
  solar_pump: { name: "Ramu Prajapati", location: "Baberu Block, Banda (UP)", emoji: "⚡",
    text: "हम 8 साल से गाँव में ट्यूबवेल और सोलर पंप की मोटर रिपेयर करते हैं। खेत की सिंचाई वाला सारा काम जानते हैं।", expYears: "8 Years Practical Work" },
  rural_mason: { name: "Ramesh Kumar", location: "Naraini Block, Banda (UP)", emoji: "🧱",
    text: "हम 9 साल से राजमिस्त्री का काम कर रहे हैं, खेत की मेड़बंदी, पानी की टंकी और छत ढलाई का काम करते हैं।", expYears: "9 Years Practical Work" },
  dairy: { name: "Sunita Devi", location: "Atarra, Banda (UP)", emoji: "🥛",
    text: "हम 6 साल से 15 गाय-भैंस का दूध उत्पादन और दुग्ध संग्रह केंद्र में चिलर मशीन चलाते हैं।", expYears: "6 Years Practical Work" },
  tailor: { name: "Shanti Bai", location: "Bisanda, Banda (UP)", emoji: "🧵",
    text: "हम 12 साल से गाँव में सिलाई का काम करते हैं, ब्लाउज, कुर्ता और बच्चों के कपड़े सिलते हैं।", expYears: "12 Years Practical Work" },
  leather: { name: "Kallu Ahirwar", location: "Mahuwa Block, Banda (UP)", emoji: "👞",
    text: "हम कई सालों से चमड़े के जूते और बेल्ट हाथ से बनाते हैं, कोई प्रमाण पत्र नहीं है और शहर 60 किमी दूर है।", expYears: "10+ Years Practical Work" }
};

const KPI_ROWS = [
  { label: "Time to certification", before: "90–180 days", after: "2 days", bw: 100, aw: 4, delta: "98.8% faster", icon: "timer" },
  { label: "Wages forfeited", before: "₹36,000–54,000", after: "₹0", bw: 100, aw: 2, delta: "100% income preserved", icon: "wallet" },
  { label: "Commute to centre", before: "50–85 km", after: "≤ 25 km", bw: 100, aw: 30, delta: "home the same day", icon: "route" },
  { label: "Candidate dropout", before: "72%", after: "< 4%", bw: 72, aw: 4, delta: "94.4% fewer dropouts", icon: "user-x" },
  { label: "Monthly earning after", before: "₹9,500", after: "₹14,200", bw: 67, aw: 100, delta: "+49.5% wage uplift", icon: "trending-up" },
  { label: "GIA fund utilisation", before: "22%", after: "96%", bw: 22, aw: 96, delta: "grants stop lapsing", icon: "landmark" }
];

// ============================================================================
// 4. STATE + HELPERS
// ============================================================================
const HISTORY_KEY = 'hunar_intake_register_v1'; // legacy local-only register, migrated into sync on first run
const $ = (id) => document.getElementById(id);
const FX = window.HUNAR_FX || (window.HUNAR_FX = { level: 0, burst() {} });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isRecording = false;
let recognition = null;
let recordedFinalTranscript = '';
let audioContext = null;
let analyserNode = null;
let microphoneStream = null;
let simulatedAudio = false;
let demoTyping = false;
let leafletMap = null;
let mapLayers = [];
let currentDistrictKey = 'banda';
let activeNQRFilter = 'ALL';
let currentMatchedQP = null;
let currentMatch = null;
let currentSelectedLanguage = 'hi-IN';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function icons() { if (window.lucide) window.lucide.createIcons(); }
function inr(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
function setText(id, v) { const el = $(id); if (el) el.innerText = v; }

function animateCount(el, to, { prefix = '', suffix = '', decimals = 0, duration = 1400 } = {}) {
  if (!el) return;
  const from = parseFloat(el.dataset.val || '0') || 0;
  el.dataset.val = to;
  if (reducedMotion) { el.innerText = prefix + to.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix; return; }
  const start = performance.now();
  (function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const v = from + (to - from) * (1 - Math.pow(1 - t, 4));
    el.innerText = prefix + v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}

document.addEventListener('DOMContentLoaded', () => {
  renderMarquee();
  renderKPIs();
  renderProfileCards();
  renderNQRPills();
  renderNQRCards(NQR_DATABASE);
  migrateLegacyHistory();
  initSyncUI();
  renderHistory();
  updateCalculator();
  initWaveform();
  initSpeechEngine();
  initMotion();
  initCmdk();
  executeDynamicAnalysis();
  icons();
});

// ============================================================================
// 5. MOTION: reveal, counters, tilt, cursor glow, scroll progress
// ============================================================================
let revealObserver = null;
function observeReveals() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.in)').forEach((el) => revealObserver.observe(el));
}

function initMotion() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.12 });
  observeReveals();

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      animateCount(e.target, parseFloat(e.target.dataset.count), { duration: 1800 });
      countObserver.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

  const progress = $('scroll-progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Pointer-driven 3D tilt (delegated so dynamically rendered cards get it too)
  const glow = $('cursor-glow');
  let tilted = null;
  const resetTilt = (el) => {
    if (!el) return;
    el.classList.remove('tilting');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--sx', '0px');
    el.style.setProperty('--sy', '0px');
  };
  document.addEventListener('pointermove', (e) => {
    if (glow) glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    if (reducedMotion || e.pointerType === 'touch') return;
    const el = e.target.closest ? e.target.closest('[data-tilt], .passport') : null;
    if (el !== tilted) { resetTilt(tilted); tilted = el; }
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    const max = el.classList.contains('passport') ? 14 : 9;
    el.classList.add('tilting');
    el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty('--rx', `${-(py - 0.5) * 2 * max}deg`);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    el.style.setProperty('--mxn', px);
    el.style.setProperty('--sx', `${-(px - 0.5) * 14}px`);
    el.style.setProperty('--sy', `${-(py - 0.5) * 14}px`);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { resetTilt(tilted); tilted = null; });
}

function renderMarquee() {
  const items = NQR_DATABASE.map((q) => q.title).concat(['PM-AJAY Grants-in-Aid', 'Recognition of Prior Learning', 'One-day commute guarantee', 'हुनर को पहचान']);
  const html = items.map((t) => `<span>${esc(t)}</span>`).join('');
  $('marquee-track').innerHTML = html + html;
}

function renderKPIs() {
  $('kpi-grid').innerHTML = KPI_ROWS.map((k, i) => `
    <div class="glass p-6 reveal" data-tilt style="--d:${(i % 3) * 0.08}s">
      <div class="flex items-center justify-between pop-sm">
        <div class="step-icon" style="width:44px;height:44px;border-radius:14px"><i data-lucide="${k.icon}" class="w-5 h-5"></i></div>
        <span class="chip chip-em">${esc(k.delta)}</span>
      </div>
      <h3 class="font-display font-bold text-lg mt-5 pop">${esc(k.label)}</h3>
      <div class="mt-4 space-y-3">
        <div>
          <div class="flex justify-between text-xs mb-1.5"><span class="text-dim font-bold uppercase tracking-widest">Before</span><span class="font-bold text-rose">${esc(k.before)}</span></div>
          <div class="kpi-bar"><i class="bar-before" style="--w:${k.bw}%"></i></div>
        </div>
        <div>
          <div class="flex justify-between text-xs mb-1.5"><span class="text-dim font-bold uppercase tracking-widest">With Hunar</span><span class="font-bold text-em">${esc(k.after)}</span></div>
          <div class="kpi-bar"><i class="bar-after" style="--w:${k.aw}%"></i></div>
        </div>
      </div>
    </div>`).join('');
}

// ============================================================================
// 6. WAGE-LOSS CALCULATOR
// ============================================================================
function setRangeFill(input) {
  const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.setProperty('--fill', pct + '%');
}

function updateCalculator() {
  const wageEl = $('calc-wage'), monthsEl = $('calc-months'), incomeEl = $('calc-income');
  [wageEl, monthsEl, incomeEl].forEach(setRangeFill);
  const wage = +wageEl.value, months = +monthsEl.value, income = +incomeEl.value;
  const days = months * 30;
  const loss = wage * days;
  const newIncome = income * 1.495;
  const yearGain = (newIncome - income) * 12;

  setText('calc-wage-val', inr(wage));
  setText('calc-months-val', `${months} months`);
  setText('calc-income-val', inr(income));
  setText('calc-trad-days', `${days} days`);
  setText('calc-trad-loss', '−' + inr(loss));
  setText('calc-hunar-loss', '+₹500');
  setText('calc-hunar-note', `no wages lost; the 2 assessment days are covered by the ₹500 DBT allowance`);
  setText('calc-new-income', inr(newIncome));
  setText('calc-year-gain', inr(yearGain));
  $('calc-trad-bar').style.setProperty('--w', Math.max(8, (loss / (900 * 180)) * 100) + '%');
}

// ============================================================================
// 7. VIEW NAVIGATION
// ============================================================================
const VIEWS = ['kiosk', 'samples', 'dashboard', 'nqr', 'history'];

function switchView(viewName) {
  VIEWS.forEach((v) => {
    const el = $(`view-${v}`), btn = $(`nav-${v}-btn`);
    const on = v === viewName;
    el.classList.toggle('hidden', !on);
    btn.classList.toggle('active', on);
    el.classList.remove('view-enter');
    if (on) { void el.offsetWidth; el.classList.add('view-enter'); }
  });

  const rect = $('console').getBoundingClientRect();
  if (rect.top > window.innerHeight * 0.55 || rect.bottom < 120) {
    $('console').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  if (viewName === 'dashboard') setTimeout(() => { initDistrictMap(); renderDistrictData(currentDistrictKey); }, 120);
  if (viewName === 'history') renderHistory();
  icons();
}

function selectProfileAndSwitch(key) {
  const profile = DEMO_PROFILES[key];
  if (!profile) return;
  loadProfile(profile);
  switchView('kiosk');
}

function loadProfile(profile) {
  $('input-beneficiary-name').value = profile.name;
  $('input-beneficiary-loc').value = profile.location;
  $('transcript-input').value = profile.text;
  $('input-extracted-exp').value = profile.expYears;
  recordedFinalTranscript = profile.text;
  executeDynamicAnalysis();
}

function clearDesk() {
  ['input-beneficiary-name', 'input-beneficiary-loc', 'transcript-input', 'input-extracted-exp'].forEach((id) => { $(id).value = ''; });
  recordedFinalTranscript = '';
  executeDynamicAnalysis();
}

function syncBeneficiaryData() { executeDynamicAnalysis(); }

function renderProfileCards() {
  $('profile-cards').innerHTML = Object.entries(DEMO_PROFILES).map(([key, p]) => {
    const m = scoreNarrative(p.text)[0];
    const qp = m ? m.qp : null;
    const isVoid = qp && !qp.centerAvailable;
    return `
      <div class="glass p-6 flex flex-col justify-between gap-5" data-tilt>
        <div class="space-y-3">
          <div class="flex justify-between items-start pop-sm">
            <span class="chip chip-gold">${esc(qp ? qp.category : 'Unmatched')}</span>
            <span class="text-3xl">${p.emoji}</span>
          </div>
          <h3 class="font-display font-bold text-xl pop">${esc(p.name)}</h3>
          <p class="text-xs text-mut flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i>${esc(p.location)} · ${esc(p.expYears.replace(' Practical Work', ''))}</p>
          <div class="inset p-3 text-sm deva text-mut leading-relaxed">“${esc(p.text)}”</div>
          ${isVoid ? '<span class="chip chip-rose">Reachability void case</span>' : ''}
        </div>
        <button onclick="selectProfileAndSwitch('${key}')" class="btn btn-primary btn-block"><i data-lucide="play" class="w-4 h-4"></i>Load into voice desk</button>
      </div>`;
  }).join('');
}

// ============================================================================
// 8. AUDIO SPECTRUM (one render loop: idle, live analyser, or simulated)
// ============================================================================
let wfCtx = null, wfCanvas = null, wfData = null;
const WF_BARS = 56;
const wfLevels = new Float32Array(WF_BARS);

function initWaveform() {
  wfCanvas = $('waveform-canvas');
  if (!wfCanvas) return;
  wfCtx = wfCanvas.getContext('2d');
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    wfCanvas.width = (wfCanvas.offsetWidth || 500) * dpr;
    wfCanvas.height = 84 * dpr;
  };
  size();
  window.addEventListener('resize', size);
  requestAnimationFrame(drawWaveform);
}

function drawWaveform(now) {
  requestAnimationFrame(drawWaveform);
  if (!wfCanvas || wfCanvas.offsetParent === null) { if (!isRecording && !demoTyping) FX.level = 0; return; }
  if (!wfCanvas.width || wfCanvas.width < 10) wfCanvas.width = (wfCanvas.offsetWidth || 500) * Math.min(window.devicePixelRatio || 1, 2);
  const w = wfCanvas.width, h = wfCanvas.height, t = now / 1000;
  let level = 0;

  if (isRecording && analyserNode && !simulatedAudio) {
    analyserNode.getByteFrequencyData(wfData);
    let sum = 0;
    for (let i = 0; i < WF_BARS; i++) {
      const v = wfData[Math.floor((i / WF_BARS) * wfData.length * 0.7)] / 255;
      wfLevels[i] += (v - wfLevels[i]) * 0.35;
      sum += v;
    }
    level = Math.min(1, (sum / WF_BARS) * 2.2);
  } else if (isRecording || demoTyping) {
    for (let i = 0; i < WF_BARS; i++) {
      const v = (0.25 + 0.75 * Math.abs(Math.sin(t * 6 + i * 0.55))) * (0.35 + Math.random() * 0.65);
      wfLevels[i] += (v - wfLevels[i]) * 0.3;
    }
    level = 0.35 + 0.35 * Math.abs(Math.sin(t * 5)) + Math.random() * 0.15;
  } else {
    for (let i = 0; i < WF_BARS; i++) {
      const v = 0.1 + 0.07 * Math.sin(t * 1.6 + i * 0.35);
      wfLevels[i] += (v - wfLevels[i]) * 0.1;
    }
  }
  FX.level = level;

  wfCtx.clearRect(0, 0, w, h);
  const gap = w / WF_BARS, bw = gap * 0.55;
  const live = isRecording || demoTyping;
  const grad = wfCtx.createLinearGradient(0, h, 0, 0);
  grad.addColorStop(0, live ? '#1d7a4b' : '#5a4636');
  grad.addColorStop(0.6, live ? '#ffa30f' : '#8a6a4a');
  grad.addColorStop(1, live ? '#ffd98a' : '#a8855c');
  wfCtx.fillStyle = grad;
  for (let i = 0; i < WF_BARS; i++) {
    const bh = Math.max(4, wfLevels[i] * (h - 6));
    const x = i * gap + (gap - bw) / 2, y = (h - bh) / 2;
    wfCtx.beginPath();
    if (wfCtx.roundRect) wfCtx.roundRect(x, y, bw, bh, bw / 2); else wfCtx.rect(x, y, bw, bh);
    wfCtx.fill();
  }
}

async function startRealMicrophoneStream() {
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') await audioContext.resume();
    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(microphoneStream);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 256;
    analyserNode.smoothingTimeConstant = 0.75;
    source.connect(analyserNode);
    wfData = new Uint8Array(analyserNode.frequencyBinCount);
    simulatedAudio = false;
    setText('audio-rate-text', `${(audioContext.sampleRate / 1000).toFixed(1)} kHz · live`);
  } catch (err) {
    console.warn('Microphone stream not available, using simulated spectrum', err);
    simulatedAudio = true;
    setText('audio-rate-text', 'simulated spectrum');
  }
}

function stopAudioStream() {
  if (microphoneStream) {
    microphoneStream.getTracks().forEach((track) => track.stop());
    microphoneStream = null;
  }
  analyserNode = null;
  setText('audio-rate-text', 'analyser idle');
}

// ============================================================================
// 9. SPEECH RECOGNITION + SYNTHESIS
// ============================================================================
function initSpeechEngine() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = currentSelectedLanguage;

  recognition.onstart = () => {
    isRecording = true;
    updateRecordingUI(true);
    startRealMicrophoneStream();
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) recordedFinalTranscript += transcript + ' ';
      else interimTranscript += transcript;
    }
    const fullText = (recordedFinalTranscript + interimTranscript).trim();
    if (fullText) {
      $('transcript-input').value = fullText;
      executeDynamicAnalysis();
    }
  };

  recognition.onerror = (e) => {
    console.warn('Speech recognition event:', e.error);
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      stopRecordingSession();
      showEvalToast('Microphone blocked', 'Allow microphone access in the browser to speak, or type the narrative instead.');
    }
  };

  recognition.onend = () => {
    if (isRecording) {
      try { recognition.start(); } catch (e) { stopRecordingSession(); }
    } else {
      stopRecordingSession();
      executeDynamicAnalysis();
    }
  };
}

function updateRecognitionLanguage(langCode) {
  currentSelectedLanguage = langCode;
  if (recognition) recognition.lang = langCode;
}

function toggleVoiceRecording() {
  if (isRecording) {
    isRecording = false;
    if (recognition) { try { recognition.stop(); } catch (e) { /* already stopped */ } }
    stopRecordingSession();
    return;
  }
  recordedFinalTranscript = '';
  $('transcript-input').value = '';
  const startWithoutRecognition = () => {
    isRecording = true;
    updateRecordingUI(true);
    startRealMicrophoneStream();
  };
  if (recognition) {
    try { recognition.start(); } catch (err) { console.warn('Recognition start:', err); startWithoutRecognition(); }
  } else {
    startWithoutRecognition();
    showEvalToast('Speech-to-text unavailable', 'This browser has no speech recognition. The mic level still shows; type the narrative.');
  }
}

function stopRecordingSession() {
  isRecording = false;
  updateRecordingUI(false);
  stopAudioStream();
}

function updateRecordingUI(recording) {
  const btn = $('record-btn');
  btn.classList.toggle('btn-primary', !recording);
  btn.classList.toggle('btn-danger', recording);
  btn.classList.toggle('live', recording);
  $('viz-box').classList.toggle('live', recording);
  $('mic-status-dot').classList.toggle('live', recording);
  setText('mic-text', recording ? 'Stop microphone' : 'Start microphone');
  setText('mic-status-text', recording ? 'Recording live voice…' : 'Microphone ready');
  setText('listening-hint', recording
    ? 'Listening continuously. Speak about the work and years of experience.'
    : 'Press and speak. The 3D orb listens with you.');
}

function speak(text, lang) {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function speakCurrentText() { speak($('transcript-input').value, currentSelectedLanguage); }

function speakResult() {
  const qp = currentMatchedQP;
  if (!qp) return;
  const name = ($('input-beneficiary-name').value || '').trim();
  const max = parseInt($('user-max-distance').value, 10) || 25;
  const reachable = qp.centerAvailable && qp.distanceKm <= max;
  const text = `${name ? name + ' जी, ' : ''}आपका हुनर ${qp.titleHi} से मेल खाता है। यह एन एस क्यू एफ स्तर ${qp.nsqfLevel} की योग्यता है। ` +
    (reachable
      ? `आपका मूल्यांकन केंद्र ${qp.distanceKm} किलोमीटर दूर है। आप उसी दिन घर लौट सकते हैं। `
      : `नज़दीकी केंद्र ${qp.distanceKm} किलोमीटर दूर है, इसलिए आपके गाँव के लिए मोबाइल मूल्यांकन वैन का प्रस्ताव भेजा जाएगा। `) +
    `दो दिन का प्रायोगिक मूल्यांकन पूरी तरह निःशुल्क है।`;
  speak(text, 'hi-IN');
}

// ============================================================================
// 10. DETERMINISTIC MATCHING ENGINE
// ============================================================================
function scoreNarrative(rawText) {
  const lowerText = (rawText || '').toLowerCase();
  if (!lowerText.trim()) return [];
  return NQR_DATABASE.map((qp) => {
    const matched = qp.keywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
    let score = matched.length * 20;
    qp.title.toLowerCase().split(/[^a-z]+/).forEach((w) => { if (w.length > 3 && lowerText.includes(w)) score += 10; });
    return { qp, score, matched };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
}

function extractExperience(lowerText) {
  const numMatch = lowerText.match(/(\d+)\s*(?:years?|साल|वर्ष|yrs?|saal|varsh|yr)/i);
  if (numMatch) return `${numMatch[1]} Years Practical Work`;
  const hindiNumMap = { 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पाँच': 5, 'पांच': 5, 'छह': 6, 'छे': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'बारह': 12, 'पंद्रह': 15, 'पन्द्रह': 15, 'बीस': 20 };
  const word = lowerText.match(new RegExp(`(${Object.keys(hindiNumMap).join('|')})\\s*(?:years?|साल|वर्ष|saal|varsh)`, 'i'));
  if (word) return `${hindiNumMap[word[1]]} Years Practical Work`;
  if (/(bachpan se|बचपन से|कई सालों से|काफी समय से|कई साल|काफी साल|पीढ़ियों से)/i.test(lowerText)) return '10+ Years Practical Work';
  return null;
}

function makeToken(name, qp) {
  const d = new Date();
  const seed = `${name}|${qp.qpCode}|${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  return `HN-${d.getFullYear()}-${qp.qpCode.replace('/', '-')}-${String(h % 10000).padStart(4, '0')}`;
}

function highlightNarrative(rawText, keywords) {
  const box = $('transcript-highlight');
  if (!keywords.length) { box.classList.add('hidden'); return; }
  const sorted = [...keywords].sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const html = esc(rawText).replace(new RegExp(`(${sorted.join('|')})`, 'gi'), '<mark class="kw">$1</mark>');
  box.innerHTML = html;
  box.classList.remove('hidden');
}

function showState(state) {
  $('rpl-empty-state').classList.toggle('hidden', state !== 'empty');
  $('rpl-unmatched-state').classList.toggle('hidden', state !== 'unmatched');
  $('rpl-result-card').classList.toggle('hidden', state !== 'matched');
  $('rpl-nsqf').classList.toggle('hidden', state !== 'matched');
}

function executeDynamicAnalysis() {
  const rawText = ($('transcript-input').value || '').trim();
  const beneficiaryName = ($('input-beneficiary-name').value || '').trim();
  const beneficiaryLoc = ($('input-beneficiary-loc').value || '').trim();
  const maxDistance = parseInt($('user-max-distance').value, 10) || 25;
  const confValEl = $('conf-val');

  if (!rawText && !beneficiaryName) {
    showState('empty');
    confValEl.innerText = 'awaiting input';
    confValEl.className = 'text-mut';
    $('transcript-highlight').classList.add('hidden');
    currentMatchedQP = null; currentMatch = null;
    return;
  }

  const found = extractExperience(rawText.toLowerCase());
  if (found) $('input-extracted-exp').value = found;
  const extractedExperience = $('input-extracted-exp').value;

  const ranked = scoreNarrative(rawText);
  if (!ranked.length) {
    currentMatchedQP = null; currentMatch = null;
    showState('unmatched');
    setText('unmatched-sample-text', rawText.length > 30 ? rawText.slice(0, 30) + '…' : (rawText || 'no narrative yet'));
    confValEl.innerText = 'no trade found';
    confValEl.className = 'text-gold';
    $('transcript-highlight').classList.add('hidden');
    return;
  }

  const best = ranked[0];
  const qp = best.qp;
  const changed = currentMatchedQP !== qp;
  currentMatchedQP = qp;
  showState('matched');
  if (changed) $('passport').classList.remove('flipped');

  const confidence = Math.min(99, 78 + best.matched.length * 7);
  const isReachable = qp.distanceKm <= maxDistance && qp.centerAvailable;
  const token = makeToken(beneficiaryName, qp);
  currentMatch = { qp, confidence, isReachable, token, name: beneficiaryName, loc: beneficiaryLoc, exp: extractedExperience };

  confValEl.innerText = `${confidence}% · ${qp.qpCode}`;
  confValEl.className = 'text-em';
  highlightNarrative(rawText, best.matched);

  // Passport
  setText('rpl-nsqf', `NSQF Level ${qp.nsqfLevel}`);
  setText('rpl-title', qp.title);
  setText('rpl-code', qp.qpCode);
  setText('rpl-sector', qp.sector);
  setText('rpl-category', qp.category);
  setText('rpl-duration', qp.rplDuration.split(' (')[0]);
  setText('rpl-center', qp.nearestCenter);
  setText('pp-level', qp.nsqfLevel);
  setText('pp-name', beneficiaryName || 'Beneficiary');
  setText('pp-token', token);
  setText('pp-stipend', qp.stipend);
  $('pp-nos').innerHTML = qp.nosList.map((n) => {
    const [code, ...rest] = n.split(': ');
    return `<li><span class="mono text-em font-bold">${esc(code)}</span><br><span class="text-mut">${esc(rest.join(': '))}</span></li>`;
  }).join('');

  // Explainability
  setText('conf-pct', `${confidence}%`);
  $('conf-bar').style.setProperty('--w', confidence + '%');
  $('kw-chips').innerHTML = best.matched.map((k) => `<span class="chip chip-gold deva">${esc(k)}</span>`).join('');
  const alts = ranked.slice(1, 3);
  $('alt-wrap').classList.toggle('hidden', !alts.length);
  $('alt-matches').innerHTML = alts.map((a) => `
    <div class="flex items-center gap-3 text-xs">
      <span class="flex-1 truncate text-mut">${esc(a.qp.title)}</span>
      <span class="w-24 kpi-bar go"><i class="bar-gold" style="--w:${Math.round((a.score / best.score) * 100)}%"></i></span>
      <span class="mono text-dim w-9 text-right">${Math.round((a.score / best.score) * 100)}%</span>
    </div>`).join('');

  // Commute
  const scale = Math.max(maxDistance * 1.6, qp.distanceKm * 1.1);
  $('reach-bar').style.setProperty('--w', Math.min(100, (qp.distanceKm / scale) * 100) + '%');
  $('reach-tick').style.setProperty('--t', (maxDistance / scale) * 100 + '%');
  $('reach-meter').classList.toggle('bad', !isReachable);
  const badge = $('reach-badge');
  if (isReachable) {
    badge.innerText = 'Reachable';
    badge.className = 'chip chip-em';
    $('reach-desc').innerHTML = `The centre is <b>${qp.distanceKm} km</b> away, inside the ${maxDistance} km limit. There and back in one day, no wage lost.`;
  } else {
    badge.innerText = 'Reachability void';
    badge.className = 'chip chip-rose';
    $('reach-desc').innerHTML = `<span class="text-rose font-bold">The nearest centre is ${qp.distanceKm} km away, beyond the ${maxDistance} km limit.</span> Flagged for a PM-AJAY GIA mobile assessment van.`;
  }

  // Slip preview + PDF template
  setText('preview-user-name', beneficiaryName || 'Beneficiary');
  setText('preview-user-dist', beneficiaryLoc || 'District Hub');
  setText('preview-user-trade', `${qp.title} (Level ${qp.nsqfLevel})`);
  setText('preview-user-center', qp.nearestCenter);
  setText('pdf-user-name', beneficiaryName || 'Beneficiary');
  setText('pdf-user-dist', beneficiaryLoc || 'District Hub');
  setText('pdf-user-exp', extractedExperience || 'Documented Practical Work');
  setText('pdf-user-level', `NSQF Level ${qp.nsqfLevel} (Direct RPL)`);
  setText('pdf-trade-title', qp.title);
  setText('pdf-qp-code', `QP: ${qp.qpCode}`);
  setText('pdf-duration', qp.rplDuration);
  setText('pdf-center-name', qp.nearestCenter);
  setText('pdf-stipend', qp.stipend);
  setText('pdf-verif-code', token);
}

// ============================================================================
// 11. EVALUATE, TOAST, CONFETTI, GUIDED DEMO
// ============================================================================
let evalToastTimeout = null;
const EVAL_BTN_IDLE = '<i data-lucide="check-circle" class="w-5 h-5"></i><span>Evaluate qualification match</span>';

function playSuccessTone() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = audioContext || (audioContext = new AudioCtx());
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.start(); osc.stop(ctx.currentTime + 0.45);
  } catch (e) { /* tone is optional */ }
}

function handleEvaluateButtonClick() {
  const transcriptEl = $('transcript-input'), nameEl = $('input-beneficiary-name');
  const evalBtn = $('evaluate-match-btn'), card = $('rpl-main-card');

  if (!transcriptEl.value.trim() && !nameEl.value.trim()) loadProfile(DEMO_PROFILES.solar_pump);

  evalBtn.disabled = true;
  evalBtn.innerHTML = '<i data-lucide="loader-circle" class="w-5 h-5 animate-spin"></i><span>Scoring against the register…</span>';
  icons();

  setTimeout(() => {
    executeDynamicAnalysis();
    evalBtn.disabled = false;

    if (currentMatch) {
      const { qp, isReachable } = currentMatch;
      playSuccessTone();
      FX.burst();
      fireConfetti();
      card.classList.remove('eval-pulse'); void card.offsetWidth; card.classList.add('eval-pulse');
      saveIntake(currentMatch);
      evalBtn.innerHTML = `<i data-lucide="badge-check" class="w-5 h-5"></i><span>Verified · NSQF Level ${qp.nsqfLevel} · saved to register</span>`;
      showEvalToast(`Matched: ${qp.title}`, `${qp.qpCode} · ${qp.distanceKm} km · ${isReachable ? 'reachable in one day' : 'flagged for mobile van'}`);
      if (window.innerWidth < 1024) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      evalBtn.innerHTML = '<i data-lucide="alert-circle" class="w-5 h-5"></i><span>Trade words needed</span>';
      showEvalToast('No trade matched yet', 'Mention the work itself, e.g. solar pump, mason, grain mill, tailor, dairy.');
    }
    icons();
    setTimeout(() => { evalBtn.innerHTML = EVAL_BTN_IDLE; icons(); }, 2600);
  }, 420);
}

function showEvalToast(title, desc) {
  const toast = $('eval-toast');
  setText('eval-toast-title', title);
  setText('eval-toast-desc', desc);
  toast.classList.add('show');
  clearTimeout(evalToastTimeout);
  evalToastTimeout = setTimeout(dismissEvalToast, 4500);
}
function dismissEvalToast() { $('eval-toast').classList.remove('show'); }

function fireConfetti() {
  if (reducedMotion) return;
  const canvas = $('confetti'), ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const colors = ['#ffa30f', '#e8412c', '#2a2f8f', '#1d7a4b', '#ff7eb6', '#1a1210'];
  const origin = $('rpl-main-card').getBoundingClientRect();
  const ox = origin.left + origin.width / 2, oy = Math.max(80, origin.top + 80);
  const parts = Array.from({ length: 140 }, () => {
    const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 11;
    return { x: ox, y: oy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, r: 3 + Math.random() * 5, c: colors[(Math.random() * colors.length) | 0], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 1 };
  });
  (function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    parts.forEach((p) => {
      p.vy += 0.32; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.011;
      if (p.life <= 0) return;
      alive = true;
      ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(tick); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

function runGuidedDemo() {
  if (demoTyping) return;
  const p = DEMO_PROFILES.solar_pump;
  clearDesk();
  switchView('kiosk');
  $('console').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  $('input-beneficiary-name').value = p.name;
  $('input-beneficiary-loc').value = p.location;
  const area = $('transcript-input');
  const chars = Array.from(p.text);
  let i = 0;
  demoTyping = true;
  $('viz-box').classList.add('live');
  setText('listening-hint', 'Demo: simulating a spoken narrative…');
  setTimeout(function type() {
    area.value = chars.slice(0, ++i).join('');
    executeDynamicAnalysis();
    if (i < chars.length) return setTimeout(type, reducedMotion ? 0 : 38);
    demoTyping = false;
    $('viz-box').classList.remove('live');
    updateRecordingUI(false);
    setTimeout(handleEvaluateButtonClick, 350);
  }, 900);
}

// ============================================================================
// 12. INTAKE REGISTER (offline-first; replicated by sync.js <-> server.js)
// ============================================================================
function getHistory() {
  return HunarSync.list('intakes').map((r) => ({ ...r.data, id: r.id, deviceId: r.deviceId, ts: r.updatedAt }));
}

function migrateLegacyHistory() {
  try {
    const old = JSON.parse(localStorage.getItem(HISTORY_KEY) || 'null');
    if (Array.isArray(old)) {
      old.forEach((e) => {
        if (!e || !e.token) return;
        const { ts, ...data } = e;
        HunarSync.put('intakes', HunarSync.newId(), data);
      });
    }
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) { /* nothing to migrate */ }
}

function saveIntake(m) {
  const entry = {
    token: m.token, name: m.name || 'Beneficiary', loc: m.loc || '', exp: m.exp || '',
    qp: m.qp.qpCode, title: m.qp.title, level: m.qp.nsqfLevel, center: m.qp.nearestCenter,
    km: m.qp.distanceKm, reachable: m.isReachable
  };
  const existing = getHistory().find((e) => e.token === entry.token);
  HunarSync.put('intakes', existing ? existing.id : HunarSync.newId(), entry);
}

function deleteIntake(id) {
  HunarSync.remove('intakes', id);
}

function renderHistory() {
  const history = getHistory();
  const me = HunarSync.info().deviceId;
  setText('hist-count', history.length ? `(${history.length})` : '');
  setText('hist-room', HunarSync.info().room);
  $('history-empty').classList.toggle('hidden', history.length > 0);
  $('history-body').innerHTML = history.map((e) => {
    const mine = e.deviceId === me;
    const fresh = !mine && Date.now() - e.ts < 6000;
    return `
    <tr class="${fresh ? 'fresh' : ''}">
      <td><div class="font-bold">${esc(e.name)}</div><div class="text-xs text-mut">${esc(e.loc)}</div></td>
      <td><div class="font-semibold">${esc(e.title)}</div><div class="mono text-xs" style="color:var(--indigo)">${esc(e.qp)}</div></td>
      <td><span class="chip chip-gold mono">L${esc(e.level)}</span></td>
      <td class="text-xs text-mut" style="min-width:150px">${esc(e.center)}</td>
      <td>${e.reachable ? '<span class="chip chip-em">Reachable</span>' : '<span class="chip chip-rose">Void</span>'}</td>
      <td><span class="chip ${mine ? '' : 'chip-gold'} mono" title="${esc(e.deviceId)}">${mine ? 'this kiosk' : '…' + esc(String(e.deviceId).slice(-4))}</span></td>
      <td><button class="chip" onclick="deleteIntake('${esc(e.id)}')" title="Delete (syncs to all kiosks)" aria-label="Delete">✕</button></td>
    </tr>`;
  }).join('');

  const byTrade = {};
  history.forEach((e) => { byTrade[e.title] = (byTrade[e.title] || 0) + 1; });
  const rows = Object.entries(byTrade).sort((a, b) => b[1] - a[1]);
  const max = rows.length ? rows[0][1] : 1;
  $('history-bars').innerHTML = rows.length ? rows.map(([t, n]) => `
    <div>
      <div class="flex justify-between text-sm mb-1.5"><span class="font-semibold truncate pr-3">${esc(t)}</span><span class="mono font-bold">${n}</span></div>
      <div class="kpi-bar go"><i class="bar-after" style="--w:${(n / max) * 100}%"></i></div>
    </div>`).join('') : '<p class="text-mut">Demand appears here as intakes are recorded.</p>';
  setText('hist-reach', history.filter((e) => e.reachable).length);
  setText('hist-void', history.filter((e) => !e.reachable).length);
}

function exportHistoryCSV() {
  const history = getHistory();
  if (!history.length) { showEvalToast('Nothing to export', 'Evaluate at least one beneficiary first.'); return; }
  const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Token', 'Name', 'Location', 'Experience', 'QP Code', 'Qualification', 'NSQF Level', 'Centre', 'Distance (km)', 'Reachable', 'Kiosk', 'Updated At'];
  const lines = history.map((e) => [e.token, e.name, e.loc, e.exp, e.qp, e.title, e.level, e.center, e.km, e.reachable ? 'Yes' : 'No', e.deviceId, new Date(e.ts).toISOString()].map(cell).join(','));
  const blob = new Blob(['﻿' + [header.map(cell).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `hunar_intake_register_${HunarSync.info().room}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function clearHistory() {
  const history = getHistory();
  if (!history.length) return;
  if (!confirm(`Delete all ${history.length} intake records in room "${HunarSync.info().room}"? This also removes them from every synced kiosk.`)) return;
  history.forEach((e) => HunarSync.remove('intakes', e.id));
}

// ---- sync status UI -------------------------------------------------------
const SYNC_LABEL = { connecting: 'Connecting', syncing: 'Syncing…', synced: 'Live', offline: 'Offline', local: 'Local only' };

function ago(ts) {
  if (!ts) return 'never';
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function shareLink(i) {
  const u = new URL(location.origin + location.pathname);
  u.searchParams.set('room', i.room);
  if (i.api !== location.origin) u.searchParams.set('api', i.api);
  return u.toString();
}

function paintSync(i) {
  const pill = $('sync-pill');
  if (!pill) return;
  pill.dataset.state = i.state;
  let label = SYNC_LABEL[i.state] || i.state;
  if (i.state === 'synced') label = `Live · ${i.online} kiosk${i.online === 1 ? '' : 's'}`;
  else if (i.pending && i.state !== 'syncing') label += ` · ${i.pending} queued`;
  setText('sync-pill-text', label);
  setText('sync-room-label', i.room);
  setText('hist-room', i.room);
  setText('sync-state-big', SYNC_LABEL[i.state] || i.state);
  setText('sync-online', i.online);
  setText('sync-pending', i.pending);
  setText('sync-last', ago(i.lastSync));
  setText('sync-device', i.deviceId);
  setText('sync-api', i.api.replace(/^https?:\/\//, ''));
  const share = $('sync-share');
  if (share) share.value = shareLink(i);
}

function initSyncUI() {
  HunarSync.on('status', paintSync);
  HunarSync.on('data', () => { renderHistory(); });
  HunarSync.on('remote', ({ count }) => {
    showEvalToast('Synced from another kiosk', `${count} intake record${count === 1 ? '' : 's'} arrived. The register is up to date.`);
    FX.burst();
  });
  HunarSync.init();
  paintSync(HunarSync.info());
  setInterval(() => paintSync(HunarSync.info()), 5000);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
}

function openSyncModal() {
  $('sync-room-input').value = HunarSync.info().room;
  setText('sync-room-error', '');
  paintSync(HunarSync.info());
  $('sync-modal').classList.remove('hidden');
  icons();
}
function closeSyncModal() { $('sync-modal').classList.add('hidden'); }

function joinRoomFromInput() {
  const ok = HunarSync.setRoom($('sync-room-input').value);
  setText('sync-room-error', ok ? '' : 'Use 3-40 characters: lowercase letters, digits and hyphens, starting with a letter or digit.');
  if (ok) { renderHistory(); showEvalToast('Joined room', `This kiosk now syncs with "${HunarSync.info().room}".`); }
}

function copyShareLink() {
  const v = $('sync-share').value;
  const done = () => { setText('sync-copy', 'Copied!'); setTimeout(() => setText('sync-copy', 'Copy'), 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, () => { $('sync-share').select(); });
  else { $('sync-share').select(); document.execCommand('copy'); done(); }
}

// Ink splats on click: purely decorative
document.addEventListener('pointerdown', (e) => {
  if (reducedMotion || e.pointerType === 'touch') return;
  const colors = ['#ffa30f', '#e8412c', '#2a2f8f', '#ff7eb6'];
  for (let i = 0; i < 7; i++) {
    const d = document.createElement('div');
    const size = 5 + Math.random() * 9, a = Math.random() * Math.PI * 2, dist = 18 + Math.random() * 38;
    d.className = 'ink-splat';
    d.style.cssText = `left:${e.clientX - size / 2}px;top:${e.clientY - size / 2}px;width:${size}px;height:${size}px;background:${colors[i % 4]};border:1.5px solid #1a1210`;
    document.body.appendChild(d);
    d.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * dist}px,${Math.sin(a) * dist}px) scale(.2)`, opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => d.remove();
  }
}, { passive: true });

// ============================================================================
// 13. DISTRICT MAP + AGGREGATION
// ============================================================================
const VAN_CAPEX = 400000, COST_PER_ARTISAN = 15000;

function districtTotals(data, perArtisan = COST_PER_ARTISAN, van = VAN_CAPEX) {
  const voids = data.clusters.filter((c) => c.isVoid);
  const voidArtisans = voids.reduce((a, c) => a + c.artisans, 0);
  return {
    total: data.clusters.reduce((a, c) => a + c.artisans, 0),
    voids, voidArtisans,
    budget: voidArtisans ? voidArtisans * perArtisan + van : 0
  };
}

function initDistrictMap() {
  if (leafletMap || !$('district-map') || !window.L) return;
  leafletMap = L.map('district-map', { zoomControl: true, scrollWheelZoom: false }).setView([25.48, 80.33], 10);
  // OpenStreetMap tiles, darkened in CSS (.leaflet-tile-pane) to fit the theme
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(leafletMap);
}

function changeDistrictData(districtKey) {
  currentDistrictKey = districtKey;
  $('district-filter-select').value = districtKey;
  renderDistrictData(districtKey);
}

function renderDistrictData(districtKey) {
  const data = DISTRICT_DATASETS[districtKey] || DISTRICT_DATASETS.banda;
  const t = districtTotals(data);
  const top = [...data.clusters].sort((a, b) => b.artisans - a.artisans)[0];

  animateCount($('stat-total-artisans'), t.total, { duration: 900 });
  setText('stat-top-cluster', top.trade.split('(')[0].trim());
  setText('stat-top-trade', `${top.name} · ${top.artisans} artisans`);
  animateCount($('stat-voids'), t.voids.length, { duration: 600 });
  setText('stat-void-artisans', `${t.voidArtisans} artisans beyond a one-day commute`);
  animateCount($('stat-budget'), t.budget / 100000, { prefix: '₹', suffix: ' L', decimals: 1, duration: 900 });
  setText('map-title-district', data.name);

  if (leafletMap) {
    mapLayers.forEach((l) => leafletMap.removeLayer(l));
    mapLayers = [];
    leafletMap.invalidateSize();
    leafletMap.flyTo(data.center, data.zoom, { duration: reducedMotion ? 0 : 1.1 });

    data.clusters.forEach((c, i) => {
      const color = c.isVoid ? '#e8412c' : '#1d7a4b';
      const circle = L.circle([c.lat, c.lng], { color, fillColor: color, fillOpacity: 0.22, weight: 2, radius: c.artisans * 22 }).addTo(leafletMap);
      const pin = L.marker([c.lat, c.lng], {
        icon: L.divIcon({ className: '', html: `<div class="pulse-pin" style="--c:${color}"><i></i></div>`, iconSize: [16, 16], iconAnchor: [8, 8] })
      }).addTo(leafletMap);
      pin.bindPopup(`<b style="font-size:13px">${esc(c.name)}</b><br><b>${c.artisans}</b> artisans · ${esc(c.trade)}<br><span style="font-weight:700;color:${color}">${esc(c.status)}</span>`);
      pin._clusterIndex = i;
      mapLayers.push(circle, pin);
    });
  }

  const max = Math.max(...data.clusters.map((c) => c.artisans));
  $('cluster-evidence-list').innerHTML = data.clusters.map((c, i) => `
    <button class="inset p-4 w-full text-left block hover:bg-[#ffd98a] transition" onclick="focusCluster(${i})">
      <div class="flex justify-between gap-3 font-bold text-sm">
        <span>${esc(c.name)}</span>
        <span class="${c.isVoid ? 'text-rose' : 'text-em'} mono whitespace-nowrap">${c.artisans}</span>
      </div>
      <p class="text-xs text-mut mt-1">${esc(c.trade)} · ${esc(c.status)}</p>
      <div class="kpi-bar go mt-3"><i class="${c.isVoid ? 'bar-before' : 'bar-after'}" style="--w:${(c.artisans / max) * 100}%"></i></div>
      <div class="text-[11px] mt-2 font-bold ${c.isVoid ? 'text-rose' : 'text-em'}">${c.isVoid ? 'GIA proposal: sanction mobile RPL van' : 'Assessment camp can be scheduled'}</div>
    </button>`).join('');
}

function focusCluster(i) {
  if (!leafletMap) return;
  const pin = mapLayers.find((l) => l._clusterIndex === i);
  if (!pin) return;
  leafletMap.flyTo(pin.getLatLng(), 12, { duration: reducedMotion ? 0 : 0.8 });
  pin.openPopup();
}

// GIA proposal builder
function generateGIAProposalPDF() {
  $('gia-modal').classList.remove('hidden');
  renderGIAProposal();
  icons();
}
function closeGIAModal() { $('gia-modal').classList.add('hidden'); }

function renderGIAProposal() {
  const perEl = $('gia-per'), vanEl = $('gia-van');
  [perEl, vanEl].forEach(setRangeFill);
  const per = +perEl.value, van = +vanEl.value;
  const data = DISTRICT_DATASETS[currentDistrictKey] || DISTRICT_DATASETS.banda;
  const t = districtTotals(data, per, van);

  setText('gia-per-val', inr(per));
  setText('gia-van-val', inr(van));
  setText('gia-total', `₹${(t.budget / 100000).toFixed(1)} L`);
  setText('gia-per-head', t.voidArtisans ? `${inr(t.budget / t.voidArtisans)} per unserved artisan, all-in` : 'No reachability voids in this district.');

  const hist = getHistory();
  const fieldEvidence = hist.length ? `<p><b>Field evidence.</b> ${hist.length} beneficiar${hist.length === 1 ? 'y has' : 'ies have'} been assessed at kiosks in room ${esc(HunarSync.info().room)}; ${hist.filter((e) => !e.reachable).length} fall outside a one-day commute.</p>` : '';
  const row = (c) => `<tr><td style="padding:5px 6px;border-bottom:1px solid #eee">${esc(c.name)}</td><td style="padding:5px 6px;border-bottom:1px solid #eee">${esc(c.trade)}</td><td style="padding:5px 6px;border-bottom:1px solid #eee;text-align:right;font-weight:700">${c.artisans}</td></tr>`;
  $('gia-paper').innerHTML = `
    <div style="text-align:center;border-bottom:2px solid #0F382A;padding-bottom:10px;margin-bottom:12px">
      <div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#855628">PM-AJAY · Grants-in-Aid Component</div>
      <div style="font-size:16px;font-weight:900;color:#0F382A;margin-top:2px">District Project Proposal (Draft)</div>
      <div style="font-size:11px;color:#5C544D;font-weight:600">${esc(data.name)} · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    </div>
    <p><b>Need.</b> ${t.total.toLocaleString('en-IN')} uncertified artisans are recorded across ${data.clusters.length} clusters. ${t.voids.length} cluster${t.voids.length === 1 ? '' : 's'} (${t.voidArtisans} artisans) lie beyond a one-day commute of any accredited assessment centre.</p>
    <table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:11px">
      <tr style="background:#F5F2EB"><th style="padding:5px 6px;text-align:left">Unserved cluster</th><th style="padding:5px 6px;text-align:left">Trade</th><th style="padding:5px 6px;text-align:right">Artisans</th></tr>
      ${t.voids.map(row).join('') || '<tr><td colspan="3" style="padding:8px 6px;color:#7F756B">None</td></tr>'}
    </table>
    ${fieldEvidence}
    <p><b>Proposed action.</b> Sanction one mobile RPL and practical testing van to assess these artisans in their own villages.</p>
    <table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:11px">
      <tr><td style="padding:4px 6px">Assessment and certification (${t.voidArtisans} × ${inr(per)})</td><td style="padding:4px 6px;text-align:right">${inr(t.voidArtisans * per)}</td></tr>
      <tr><td style="padding:4px 6px">Mobile tooling van (capex)</td><td style="padding:4px 6px;text-align:right">${inr(t.voidArtisans ? van : 0)}</td></tr>
      <tr style="font-weight:900;color:#0F382A;border-top:2px solid #0F382A"><td style="padding:6px">Total GIA grant requested</td><td style="padding:6px;text-align:right">${inr(t.budget)}</td></tr>
    </table>
    <p style="font-size:10px;color:#7F756B;margin-top:10px">Generated by the Hunar aggregation engine from CSC intake records. Prototype figures for demonstration.</p>`;
}

function downloadGIAProposal() {
  const data = DISTRICT_DATASETS[currentDistrictKey] || DISTRICT_DATASETS.banda;
  if (!window.html2pdf) { window.print(); return; }
  window.html2pdf().set({
    margin: 12, filename: `Hunar_GIA_Proposal_${data.short}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#ffffff', logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from($('gia-paper')).save();
}

// ============================================================================
// 14. REGISTRY
// ============================================================================
function renderNQRPills() {
  const cats = ['ALL', ...new Set(NQR_DATABASE.map((q) => q.category))];
  $('nqr-pills').innerHTML = cats.map((c) => `<button class="chip ${c === activeNQRFilter ? 'active' : ''}" data-cat="${esc(c)}">${c === 'ALL' ? 'All sectors' : esc(c)}</button>`).join('');
  $('nqr-pills').onclick = (e) => {
    const btn = e.target.closest('[data-cat]');
    if (btn) filterNQRByCategory(btn.dataset.cat);
  };
}

function renderNQRCards(items) {
  const container = $('nqr-cards-container');
  container.innerHTML = items.length ? items.map((item) => `
    <div class="glass p-6 flex flex-col justify-between gap-5" data-tilt>
      <div class="space-y-4">
        <div class="flex items-center justify-between pop-sm">
          <div class="step-icon" style="width:44px;height:44px;border-radius:14px"><i data-lucide="${item.icon}" class="w-5 h-5"></i></div>
          <span class="chip chip-gold mono">Level ${item.nsqfLevel}</span>
        </div>
        <div class="pop">
          <span class="mono text-xs text-em font-bold">${esc(item.qpCode)}</span>
          <h3 class="font-display font-bold text-lg leading-snug mt-1">${esc(item.title)}</h3>
          <p class="text-xs text-mut mt-1">${esc(item.category)}</p>
        </div>
        <div class="inset p-3 space-y-2 text-xs">
          <div class="flex justify-between gap-3"><span class="text-dim">Assessment</span><span class="font-bold text-right">${esc(item.rplDuration.split(' (')[0])}</span></div>
          <div class="flex justify-between gap-3"><span class="text-dim">Centre</span><span class="font-semibold text-right ${item.centerAvailable ? '' : 'text-rose'}">${esc(item.nearestCenter)}</span></div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button onclick="openNQRDetailModal('${item.qpCode}')" class="btn btn-ghost btn-sm"><i data-lucide="book-open" class="w-4 h-4"></i>Standards</button>
        <button onclick="testThisQualificationInKiosk('${item.qpCode}')" class="btn btn-primary btn-sm"><i data-lucide="play" class="w-4 h-4"></i>Try it</button>
      </div>
    </div>`).join('') : '<div class="glass p-10 text-center text-mut md:col-span-2 lg:col-span-3">No qualification matches that search.</div>';
  icons();
}

function filterNQRInteractive() {
  const query = ($('nqr-search-input').value || '').toLowerCase().trim();
  renderNQRCards(NQR_DATABASE.filter((item) => {
    const inCat = activeNQRFilter === 'ALL' || item.category === activeNQRFilter;
    const inQuery = !query || [item.title, item.qpCode, item.category, item.sector, ...item.keywords].some((s) => s.toLowerCase().includes(query));
    return inCat && inQuery;
  }));
}

function filterNQRByCategory(category) {
  activeNQRFilter = category;
  renderNQRPills();
  filterNQRInteractive();
}

let detailQP = null;
function openNQRDetailModal(qpCode) {
  const item = NQR_DATABASE.find((q) => q.qpCode === qpCode) || NQR_DATABASE[0];
  detailQP = item;
  setText('detail-qp-code', item.qpCode);
  setText('detail-title', item.title);
  setText('detail-sector', item.sector);
  setText('detail-category-badge', item.category);
  setText('detail-level', `Level ${item.nsqfLevel}`);
  setText('detail-rpl', item.rplDuration.split(' (')[0]);
  setText('detail-center', item.nearestCenter);
  $('detail-nos-list').innerHTML = item.nosList.map((n) => `<li>${esc(n)}</li>`).join('');
  $('nqr-detail-modal').classList.remove('hidden');
  icons();
}
function closeNQRDetailModal() { $('nqr-detail-modal').classList.add('hidden'); }

function testThisQualificationInKiosk(qpCode) {
  closeNQRDetailModal();
  const item = qpCode ? NQR_DATABASE.find((q) => q.qpCode === qpCode) : detailQP;
  if (!item) return;
  loadProfile({
    name: $('input-beneficiary-name').value || 'Rural Beneficiary',
    location: $('input-beneficiary-loc').value || 'Banda District (UP)',
    text: item.sampleUtterance,
    expYears: $('input-extracted-exp').value || ''
  });
  switchView('kiosk');
}

// ============================================================================
// 15. ACTION SLIP PDF
// ============================================================================
function openPrintModal() { $('print-modal').classList.remove('hidden'); icons(); }
function closePrintModal() { $('print-modal').classList.add('hidden'); }

function downloadSlipDirectPDF() {
  const element = $('pdf-clean-export-container'), wrapper = $('pdf-export-wrapper');
  if (!element || !wrapper) return;
  const beneficiaryName = $('input-beneficiary-name').value || 'Beneficiary';
  if (!window.html2pdf) { window.print(); return; }
  wrapper.style.opacity = '1';
  const done = () => { wrapper.style.opacity = '0'; };
  window.html2pdf().set({
    margin: [10, 10, 10, 10],
    filename: `Hunar_Action_Slip_${beneficiaryName.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0, scrollX: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save().then(() => { done(); closePrintModal(); }).catch((err) => { done(); console.error(err); });
}

// ============================================================================
// 16. COMMAND PALETTE (Ctrl/Cmd + K)
// ============================================================================
let cmdkSel = 0, cmdkItems = [];

function cmdkActions() {
  return [
    { icon: 'mic', label: 'Go to voice desk', run: () => switchView('kiosk') },
    { icon: 'users', label: 'Go to demo profiles', run: () => switchView('samples') },
    { icon: 'map', label: 'Go to district map', run: () => switchView('dashboard') },
    { icon: 'book-open', label: 'Go to qualification register', run: () => switchView('nqr') },
    { icon: 'clipboard-list', label: 'Go to intake register', run: () => switchView('history') },
    { icon: 'play', label: 'Run the guided demo', run: runGuidedDemo },
    { icon: 'radio', label: 'Start / stop microphone', run: () => { switchView('kiosk'); toggleVoiceRecording(); } },
    ...Object.entries(DEMO_PROFILES).map(([k, p]) => ({ icon: 'user', label: `Load profile: ${p.name}`, run: () => selectProfileAndSwitch(k) })),
    ...Object.entries(DISTRICT_DATASETS).map(([k, d]) => ({ icon: 'map-pin', label: `Map: ${d.short} district`, run: () => { switchView('dashboard'); setTimeout(() => changeDistrictData(k), 200); } })),
    { icon: 'file-text', label: 'Draft GIA proposal for current district', run: generateGIAProposalPDF },
    { icon: 'download', label: 'Export intake register as CSV', run: exportHistoryCSV },
    { icon: 'refresh-cw', label: 'Sync now / open sync settings', run: () => { HunarSync.syncNow(); openSyncModal(); } },
    { icon: 'calculator', label: 'Open wage-loss calculator', run: () => $('calculator').scrollIntoView({ behavior: 'smooth' }) }
  ];
}

function initCmdk() {
  document.addEventListener('keydown', (e) => {
    const open = !$('cmdk').classList.contains('hidden');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open ? closeCmdk() : openCmdk(); return; }
    if (e.key === 'Escape') { closeCmdk(); closeNQRDetailModal(); closePrintModal(); closeGIAModal(); closeSyncModal(); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdkSel = Math.min(cmdkItems.length - 1, cmdkSel + 1); paintCmdk(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdkSel = Math.max(0, cmdkSel - 1); paintCmdk(); }
    else if (e.key === 'Enter') { e.preventDefault(); runCmdk(cmdkSel); }
  });
}

function openCmdk() {
  $('cmdk').classList.remove('hidden');
  $('cmdk-input').value = '';
  renderCmdk();
  icons();
  setTimeout(() => $('cmdk-input').focus(), 30);
}
function closeCmdk() { $('cmdk').classList.add('hidden'); }

function renderCmdk() {
  const q = $('cmdk-input').value.toLowerCase().trim();
  cmdkItems = cmdkActions().filter((a) => !q || a.label.toLowerCase().includes(q));
  cmdkSel = 0;
  paintCmdk();
}

function paintCmdk() {
  $('cmdk-list').innerHTML = cmdkItems.length ? cmdkItems.map((a, i) => `
    <div class="cmd-item ${i === cmdkSel ? 'sel' : ''}" onclick="runCmdk(${i})"><i data-lucide="${a.icon}" class="w-4 h-4"></i><span>${esc(a.label)}</span></div>`).join('')
    : '<div class="px-3 py-6 text-center text-sm text-mut">No matching command.</div>';
  icons();
  const sel = $('cmdk-list').querySelector('.sel');
  if (sel) sel.scrollIntoView({ block: 'nearest' });
}

function runCmdk(i) {
  const a = cmdkItems[i];
  if (!a) return;
  closeCmdk();
  a.run();
}
