/**
 * Hunar (हुनर) - National Rural Skilling & PM-AJAY Livelihood Engine
 * Real Web Audio API Microphone Stream, Dynamic NLP Extraction & Zero-Hardcoded NQR Matching
 */

// ============================================================================
// 1. MASTER NQR QUALIFICATION REGISTER (ACCORDING TO NCVET STANDARDS)
// ============================================================================
const NQR_DATABASE = [
  {
    qpCode: "FIC/Q0104",
    title: "Pulse, Grain & Spice Processing Operator",
    sector: "Food Industry Capacity & Skill Initiative (FICSI)",
    nsqfLevel: 4,
    rplEligible: true,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "Agro-FoodTech (ODOP)",
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
    sector: "Agriculture Skill Council of India (ASCI)",
    nsqfLevel: 4,
    rplEligible: true,
    rplDuration: "16 Hours (2-Day Practical Assessment)",
    category: "Farm Machinery & Solar",
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
    sector: "Construction Skill Development Council (CSDCI)",
    nsqfLevel: 4,
    rplEligible: true,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "Rural Infrastructure",
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
    sector: "Agriculture Skill Council of India (ASCI)",
    nsqfLevel: 3,
    rplEligible: true,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "Dairy & Livestock",
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
    sector: "Handicrafts Sector Skill Council (HCSSC)",
    nsqfLevel: 3,
    rplEligible: true,
    rplDuration: "12 Hours (2-Day Practical Assessment)",
    category: "PM Vishwakarma Artisan",
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
    sector: "Leather Sector Skill Council (LSSC)",
    nsqfLevel: 3,
    rplEligible: true,
    rplDuration: "14 Hours (2-Day Practical Assessment)",
    category: "Traditional Crafts",
    keywords: ["chamda", "leather", "mochi", "joota", "chappal", "cobbler", "shoe", "belt", "slippers", "sandal", "चमड़ा", "जूता", "चप्पल", "मोची", "सिलाई", "जूते"],
    nearestCenter: "State Leather Training Institute, Kanpur (58.0 km - VOID)",
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
  }
];

// ============================================================================
// 2. DYNAMIC DISTRICT GIS & CLUSTERING DATASETS
// ============================================================================
const DISTRICT_DATASETS = {
  banda: {
    name: "Banda District (UP - Bundelkhand)",
    center: [25.4800, 80.3300],
    zoom: 10,
    clusters: [
      { name: "Tindwari Agro Cluster", lat: 25.6200, lng: 80.3800, artisans: 189, trade: "Pulse & Spice Milling (ODOP)", status: "Reachable (11km)", isVoid: false },
      { name: "Baberu Farm Machinery Hub", lat: 25.5500, lng: 80.5200, artisans: 145, trade: "Solar & Agri Pump Repair", status: "Reachable (14km)", isVoid: false },
      { name: "Mahuwa Rural Artisan Cluster", lat: 25.3200, lng: 80.4500, artisans: 142, trade: "Leather Crafts", status: "VOID (58km - Needs Mobile Hub)", isVoid: true },
      { name: "Naraini Construction Cluster", lat: 25.1900, lng: 80.4800, artisans: 310, trade: "Rural Masons & Tank Builders", status: "Reachable (12km)", isVoid: false }
    ]
  },
  vidarbha: {
    name: "Amravati District (Maharashtra - Vidarbha)",
    center: [20.9374, 77.7796],
    zoom: 10,
    clusters: [
      { name: "Achalpur Handloom & Ginning", lat: 21.2580, lng: 77.5090, artisans: 420, trade: "Cotton Spinning & Weaving", status: "Reachable (15km)", isVoid: false },
      { name: "Melghat Tribal Forest Crafts", lat: 21.4900, lng: 77.2000, artisans: 280, trade: "Bamboo & Herbal Processing", status: "VOID (64km - Remote)", isVoid: true },
      { name: "Morshi Citrus / Orange Pack-house", lat: 21.3200, lng: 78.0100, artisans: 340, trade: "Fruit Grading & Cold-Chain", status: "Reachable (9km)", isVoid: false },
      { name: "Chandur Rural Implement Hub", lat: 20.7800, lng: 77.9800, artisans: 210, trade: "Tractor Implements Welding", status: "Reachable (18km)", isVoid: false }
    ]
  },
  salem: {
    name: "Salem District (Tamil Nadu)",
    center: [11.6643, 78.1460],
    zoom: 10,
    clusters: [
      { name: "Attur Tapioca & Sago Cluster", lat: 11.5900, lng: 78.6000, artisans: 540, trade: "Sago & Agro Starch Operator", status: "Reachable (8km)", isVoid: false },
      { name: "Mecheri Livestock & Dairy Hub", lat: 11.8300, lng: 77.9400, artisans: 390, trade: "Sheep & Dairy Processing", status: "Reachable (12km)", isVoid: false },
      { name: "Kolli Hills Tribal Herbal Hub", lat: 11.3100, lng: 78.3400, artisans: 175, trade: "Spices & Pepper Grading", status: "VOID (48km Hill Transit)", isVoid: true }
    ]
  },
  gaya: {
    name: "Gaya District (Bihar)",
    center: [24.7914, 85.0002],
    zoom: 10,
    clusters: [
      { name: "Manpur Agro & Jaggery Cluster", lat: 24.8100, lng: 85.0300, artisans: 380, trade: "Tilkut & Agro Confectionery", status: "Reachable (6km)", isVoid: false },
      { name: "Barabar Stone Artisans", lat: 25.0050, lng: 85.0590, artisans: 220, trade: "Stone Carving & Masonry", status: "VOID (46km Void)", isVoid: true },
      { name: "Bodhgaya Handicrafts Village", lat: 24.6960, lng: 84.9910, artisans: 410, trade: "Wood & Souvenir Craft", status: "Reachable (10km)", isVoid: false }
    ]
  }
};

// ============================================================================
// 3. SAMPLE BENEFICIARY FIELD PROFILES
// ============================================================================
const DEMO_PROFILES = {
  agro_mill: {
    name: "Chhedilal Verma",
    location: "Tindwari Village, Banda (UP)",
    text: "हम 7 साल से दाल मिल में काम करते हैं, चना और अरहर का ग्रेडिंग और पिसाई करते हैं। कोई सरकारी प्रमाण पत्र नहीं है।",
    expYears: "7 Years Practical Work"
  },
  solar_pump: {
    name: "Ramu Prajapati",
    location: "Baberu Block, Banda (UP)",
    text: "हम 8 साल से गाँव में ट्यूबवेल और सोलर पंप की मोटर रिपेयर करते हैं। खेत की सिंचाई वाला सारा काम जानते हैं।",
    expYears: "8 Years Practical Work"
  },
  rural_mason: {
    name: "Ramesh Kumar",
    location: "Naraini Block, Banda (UP)",
    text: "हम 9 साल से राजमिस्त्री का काम कर रहे हैं, खेत की मेड़बंदी, पानी की टंकी और छत ढलाई का काम करते हैं।",
    expYears: "9 Years Practical Work"
  }
};

// ============================================================================
// 4. APPLICATION STATE & INITIALIZATION
// ============================================================================
let isRecording = false;
let recognition = null;
let recordedFinalTranscript = '';
let audioContext = null;
let analyserNode = null;
let microphoneStream = null;
let visualizerAnimationFrame = null;
let leafletMap = null;
let mapCircleLayers = [];
let currentDistrictKey = 'banda';
let activeNQRFilter = 'ALL';
let currentMatchedQP = NQR_DATABASE[0];
let currentSelectedLanguage = 'hi-IN';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  initWaveformCanvas();
  initSpeechEngine();
  renderNQRCards(NQR_DATABASE);

  // Initialize with clean empty intake desk
  executeDynamicAnalysis();
});

// ============================================================================
// 5. VIEW NAVIGATION
// ============================================================================
function switchView(viewName) {
  const views = ['kiosk', 'samples', 'dashboard', 'nqr'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const btn = document.getElementById(`nav-${v}-btn`);
    if (v === viewName) {
      el.classList.remove('hidden');
      btn.classList.add('active');
    } else {
      el.classList.add('hidden');
      btn.classList.remove('active');
    }
  });

  if (viewName === 'dashboard') {
    setTimeout(() => {
      initDistrictMap();
      renderDistrictData(currentDistrictKey);
    }, 120);
  }
  if (window.lucide) window.lucide.createIcons();
}

function selectProfileAndSwitch(key) {
  const profile = DEMO_PROFILES[key];
  if (!profile) return;
  loadProfile(profile);
  switchView('kiosk');
}

function loadProfile(profile) {
  document.getElementById('input-beneficiary-name').value = profile.name;
  document.getElementById('input-beneficiary-loc').value = profile.location;
  document.getElementById('transcript-input').value = profile.text;
  document.getElementById('input-extracted-exp').value = profile.expYears;
  recordedFinalTranscript = profile.text;

  executeDynamicAnalysis();
}

function syncBeneficiaryData() {
  executeDynamicAnalysis();
}

// ============================================================================
// 6. REAL AUDIO SPECTRUM VISUALIZER (WEB AUDIO API)
// ============================================================================
function initWaveformCanvas() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 500;
  canvas.height = 56;
  drawStaticWaveform(canvas);
}

function drawStaticWaveform(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#3D3833';
  const bars = 36;
  const barWidth = canvas.width / bars - 3;
  for (let i = 0; i < bars; i++) {
    const h = Math.sin(i * 0.3) * 6 + 10;
    ctx.beginPath();
    ctx.roundRect(i * (barWidth + 3), (canvas.height - h) / 2, barWidth, h, 2);
    ctx.fill();
  }
}

async function startRealMicrophoneStream() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(microphoneStream);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 64;
    source.connect(analyserNode);

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!isRecording) return;
      visualizerAnimationFrame = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 36;
      const barWidth = canvas.width / bars - 3;

      for (let i = 0; i < bars; i++) {
        const val = dataArray[i % bufferLength] || 0;
        const barHeight = Math.max(6, (val / 255) * (canvas.height - 8));
        ctx.fillStyle = val > 30 ? '#10B981' : '#463D2B';
        ctx.beginPath();
        ctx.roundRect(i * (barWidth + 3), (canvas.height - barHeight) / 2, barWidth, barHeight, 2);
        ctx.fill();
      }
    }
    draw();
  } catch (err) {
    console.warn("Microphone stream not accessible via getUserMedia, using simulated visualizer", err);
    startSimulatedWaveform();
  }
}

function startSimulatedWaveform() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function draw() {
    if (!isRecording) return;
    visualizerAnimationFrame = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bars = 36;
    const barWidth = canvas.width / bars - 3;

    for (let i = 0; i < bars; i++) {
      const barHeight = Math.random() * 28 + 6;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.roundRect(i * (barWidth + 3), (canvas.height - barHeight) / 2, barWidth, barHeight, 2);
      ctx.fill();
    }
  }
  draw();
}

function stopAudioStream() {
  if (visualizerAnimationFrame) {
    cancelAnimationFrame(visualizerAnimationFrame);
  }
  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop());
    microphoneStream = null;
  }
  const canvas = document.getElementById('waveform-canvas');
  if (canvas) drawStaticWaveform(canvas);
}

// ============================================================================
// 7. CONTINUOUS MULTI-DIALECT SPEECH RECOGNITION (WEB SPEECH API)
// ============================================================================
function initSpeechEngine() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
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
        if (event.results[i].isFinal) {
          recordedFinalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      const fullText = (recordedFinalTranscript + interimTranscript).trim();
      if (fullText) {
        document.getElementById('transcript-input').value = fullText;
        executeDynamicAnalysis();
      }
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition event:", e.error);
      if (e.error === 'not-allowed') {
        stopRecordingSession();
        alert("Microphone access was blocked. Please allow microphone access in your browser settings to speak.");
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        try {
          recognition.start();
        } catch (e) {
          stopRecordingSession();
        }
      } else {
        stopRecordingSession();
        executeDynamicAnalysis();
      }
    };
  }
}

function updateRecognitionLanguage(langCode) {
  currentSelectedLanguage = langCode;
  if (recognition) {
    recognition.lang = langCode;
  }
}

function toggleVoiceRecording() {
  if (isRecording) {
    if (recognition) recognition.stop();
    stopRecordingSession();
  } else {
    recordedFinalTranscript = '';
    document.getElementById('transcript-input').value = '';
    if (recognition) {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Recognition restart:", err);
        isRecording = true;
        updateRecordingUI(true);
        startRealMicrophoneStream();
      }
    } else {
      isRecording = true;
      updateRecordingUI(true);
      startRealMicrophoneStream();
    }
  }
}

function stopRecordingSession() {
  isRecording = false;
  updateRecordingUI(false);
  stopAudioStream();
}

function updateRecordingUI(recording) {
  const btn = document.getElementById('record-btn');
  const text = document.getElementById('mic-text');
  const statusText = document.getElementById('mic-status-text');
  const statusDot = document.getElementById('mic-status-dot');
  const hint = document.getElementById('listening-hint');

  if (recording) {
    btn.className = "px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-display font-bold text-xs flex items-center space-x-2 transition shadow-xs";
    text.innerText = "Stop Microphone";
    statusText.innerText = "Recording Live Voice...";
    statusDot.className = "w-2 h-2 rounded-full bg-rose-600 animate-pulse";
    hint.innerText = "Listening continuously... Speak your work and experience in Hindi, Bundelkhandi, or your native dialect.";
  } else {
    btn.className = "px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-display font-bold text-xs flex items-center space-x-2 transition shadow-xs";
    text.innerText = "Start Microphone";
    statusText.innerText = "Microphone Ready";
    statusDot.className = "w-2 h-2 rounded-full bg-emerald-800";
    hint.innerText = "Click to record or speak into your microphone";
  }
}

function speakCurrentText() {
  const text = document.getElementById('transcript-input').value;
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentSelectedLanguage;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

// ============================================================================
// 8. ZERO-HARDCODED DYNAMIC NLP & NQR MATCHING ENGINE
// ============================================================================
function executeDynamicAnalysis() {
  const rawText = (document.getElementById('transcript-input').value || "").trim();
  const lowerText = rawText.toLowerCase();
  const beneficiaryName = (document.getElementById('input-beneficiary-name').value || "").trim();
  const beneficiaryLoc = (document.getElementById('input-beneficiary-loc').value || "").trim();
  const maxDistance = parseInt(document.getElementById('user-max-distance').value, 10) || 25;

  const emptyStateEl = document.getElementById('rpl-empty-state');
  const unmatchedStateEl = document.getElementById('rpl-unmatched-state');
  const resultCardEl = document.getElementById('rpl-result-card');
  const nsqfBadgeEl = document.getElementById('rpl-nsqf');
  const confValEl = document.getElementById('conf-val');

  // Case 1: If neither text nor beneficiary name is entered -> Clean Standby State
  if (!rawText && !beneficiaryName) {
    if (emptyStateEl) emptyStateEl.classList.remove('hidden');
    if (unmatchedStateEl) unmatchedStateEl.classList.add('hidden');
    if (resultCardEl) resultCardEl.classList.add('hidden');
    if (nsqfBadgeEl) nsqfBadgeEl.classList.add('hidden');
    if (confValEl) confValEl.innerText = "Awaiting Input";
    currentMatchedQP = null;
    return;
  }

  // 1. DYNAMIC EXPERIENCE EXTRACTION VIA REGEX (HINDI, ENGLISH, CONVERSATIONAL)
  let extractedExperience = document.getElementById('input-extracted-exp').value;
  
  // Match digits with years
  const numMatch = lowerText.match(/(\d+)\s*(?:years?|साल|वर्ष|yrs?|saal|varsh|yr)/i);
  // Match Hindi verbal numbers
  const hindiWordMatch = lowerText.match(/(सात|आठ|दस|पाँच|पांच|छह|छे|चार|तीन|दो|एक|नौ|बारह|पंद्रह|बीस|पन्द्रह)\s*(?:years?|साल|वर्ष|yrs?|saal|varsh)/i);
  // Match conversational idioms
  const idiomMatch = lowerText.match(/(bachpan se|बचपन से|कई सालों से|काफी समय से|कई साल|काफी साल)/i);

  if (numMatch) {
    extractedExperience = `${numMatch[1]} Years Practical Work`;
    document.getElementById('input-extracted-exp').value = extractedExperience;
  } else if (hindiWordMatch) {
    const hindiNumMap = { 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पाँच': 5, 'पांच': 5, 'छह': 6, 'छे': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'बारह': 12, 'पंद्रह': 15, 'पन्द्रह': 15, 'बीस': 20 };
    const num = hindiNumMap[hindiWordMatch[1]] || hindiWordMatch[1];
    extractedExperience = `${num} Years Practical Work`;
    document.getElementById('input-extracted-exp').value = extractedExperience;
  } else if (idiomMatch) {
    extractedExperience = `10+ Years Practical Work`;
    document.getElementById('input-extracted-exp').value = extractedExperience;
  }

  // 2. DYNAMIC NQR TRADE SCORING ACROSS ENTIRE NCVET DATABASE
  let bestQP = null;
  let highestScore = 0;
  let matchedKeywordCount = 0;

  if (rawText.length > 0) {
    NQR_DATABASE.forEach(qp => {
      let score = 0;
      let localMatches = 0;
      qp.keywords.forEach(kw => {
        if (lowerText.includes(kw.toLowerCase())) {
          score += 20;
          localMatches++;
        }
      });
      // Boost if title words match
      const titleWords = qp.title.toLowerCase().split(' ');
      titleWords.forEach(w => {
        if (w.length > 3 && lowerText.includes(w)) score += 10;
      });

      if (score > highestScore) {
        highestScore = score;
        bestQP = qp;
        matchedKeywordCount = localMatches;
      }
    });
  }

  // Case 2: Text entered (like "HE" or "hello") but no vocational trade matched
  if (!bestQP || highestScore === 0) {
    currentMatchedQP = null;
    if (emptyStateEl) emptyStateEl.classList.add('hidden');
    if (unmatchedStateEl) unmatchedStateEl.classList.remove('hidden');
    if (resultCardEl) resultCardEl.classList.add('hidden');
    if (nsqfBadgeEl) nsqfBadgeEl.classList.add('hidden');

    const sampleTextEl = document.getElementById('unmatched-sample-text');
    if (sampleTextEl) sampleTextEl.innerText = rawText.length > 30 ? rawText.slice(0, 30) + '...' : (rawText || 'entered text');

    if (confValEl) confValEl.innerHTML = `<span class="text-amber-700 font-semibold">Unmatched (0% Trade Confidence)</span>`;
    return;
  }

  // Case 3: Genuine Positive Match Found
  currentMatchedQP = bestQP;

  if (emptyStateEl) emptyStateEl.classList.add('hidden');
  if (unmatchedStateEl) unmatchedStateEl.classList.add('hidden');
  if (resultCardEl) resultCardEl.classList.remove('hidden');
  if (nsqfBadgeEl) {
    nsqfBadgeEl.classList.remove('hidden');
    nsqfBadgeEl.innerText = `Level ${bestQP.nsqfLevel}`;
  }

  // Confidence calculation
  const confidencePercent = Math.min(99, 78 + (matchedKeywordCount * 7));
  if (confValEl) confValEl.innerHTML = `<span class="text-emerald-700 font-bold">${confidencePercent}% (Verified)</span>`;

  // 3. REACHABILITY EVALUATION
  const isReachable = bestQP.distanceKm <= maxDistance && bestQP.centerAvailable;
  const reachBadge = document.getElementById('reach-badge');
  const reachDesc = document.getElementById('reach-desc');

  if (isReachable) {
    reachBadge.innerText = "100% REACHABLE";
    reachBadge.className = "font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px]";
    reachDesc.innerHTML = `Center is <b>${bestQP.distanceKm} km</b> away. Attainable and returnable within the same day without wage loss.`;
  } else {
    reachBadge.innerText = "REACHABILITY GAP (VOID)";
    reachBadge.className = "font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[10px]";
    reachDesc.innerHTML = `<span class="text-rose-700 font-bold">Nearest center is ${bestQP.distanceKm} km away.</span> Flagged for PM-AJAY GIA Mobile Assessment Van.`;
  }

  // 4. SYNC TO UI CARD
  document.getElementById('rpl-title').innerText = bestQP.title;
  document.getElementById('rpl-code').innerText = bestQP.qpCode;
  document.getElementById('rpl-sector').innerText = bestQP.sector;
  document.getElementById('rpl-category').innerText = bestQP.category;
  document.getElementById('rpl-duration').innerText = bestQP.rplDuration;
  document.getElementById('rpl-center').innerText = bestQP.nearestCenter;

  // 5. SYNC TO PREVIEW MODAL
  document.getElementById('preview-user-name').innerText = beneficiaryName || "Beneficiary";
  document.getElementById('preview-user-dist').innerText = beneficiaryLoc || "District Hub";
  document.getElementById('preview-user-trade').innerText = `${bestQP.title} (Level ${bestQP.nsqfLevel})`;
  document.getElementById('preview-user-center').innerText = bestQP.nearestCenter;

  // 6. SYNC TO DEDICATED PDF EXPORT TEMPLATE
  const hashToken = `HN-2026-${bestQP.qpCode.replace('/', '-')}-${Math.floor(Math.random() * 899 + 100)}`;
  document.getElementById('pdf-user-name').innerText = beneficiaryName || "Beneficiary";
  document.getElementById('pdf-user-dist').innerText = beneficiaryLoc || "District Hub";
  document.getElementById('pdf-user-exp').innerText = extractedExperience || "Documented Practical Work";
  document.getElementById('pdf-user-level').innerText = `NSQF Level ${bestQP.nsqfLevel} (Direct RPL)`;
  document.getElementById('pdf-trade-title').innerText = bestQP.title;
  document.getElementById('pdf-qp-code').innerText = `QP: ${bestQP.qpCode}`;
  document.getElementById('pdf-center-name').innerText = bestQP.nearestCenter;
  document.getElementById('pdf-verif-code').innerText = hashToken;

  if (window.lucide) window.lucide.createIcons();
}

// ============================================================================
// 8B. INTERACTIVE EVALUATE BUTTON HANDLER & NOTIFICATION FEEDBACK
// ============================================================================
let evalToastTimeout = null;

function playSuccessTone() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Audio tone fallback
  }
}

function handleEvaluateButtonClick() {
  const transcriptEl = document.getElementById('transcript-input');
  const nameEl = document.getElementById('input-beneficiary-name');
  const evalBtn = document.getElementById('evaluate-match-btn');
  const rightCard = document.getElementById('rpl-main-card');

  // If completely empty, load sample profile
  if (!transcriptEl.value.trim() && !nameEl.value.trim()) {
    nameEl.value = DEMO_PROFILES.solar_pump.name;
    document.getElementById('input-beneficiary-loc').value = DEMO_PROFILES.solar_pump.location;
    transcriptEl.value = DEMO_PROFILES.solar_pump.text;
    document.getElementById('input-extracted-exp').value = DEMO_PROFILES.solar_pump.expYears;
  }

  // 1. Loading state on button
  if (evalBtn) {
    evalBtn.classList.add('opacity-90');
    evalBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Evaluating NCVET Registry...</span>
    `;
  }

  // 2. Perform Dynamic Analysis after a brief 320ms processing delay
  setTimeout(() => {
    executeDynamicAnalysis();

    if (currentMatchedQP) {
      playSuccessTone();

      // Pulse animation on the matched card
      if (rightCard) {
        rightCard.classList.remove('eval-success-pulse');
        void rightCard.offsetWidth; // trigger DOM reflow
        rightCard.classList.add('eval-success-pulse');
      }

      // Update button to verified state
      if (evalBtn) {
        evalBtn.classList.remove('opacity-90');
        evalBtn.innerHTML = `
          <i data-lucide="check" class="w-4 h-4 text-emerald-300"></i>
          <span>Qualification Verified (Level ${currentMatchedQP.nsqfLevel})</span>
        `;
        if (window.lucide) window.lucide.createIcons();
      }

      const commuteStatusText = currentMatchedQP.distanceKm <= 25 ? `${currentMatchedQP.distanceKm} km (Reachable)` : `${currentMatchedQP.distanceKm} km (GIA Mobile Van Required)`;
      showEvalToast(`Qualification Verified: Level ${currentMatchedQP.nsqfLevel}`, `${currentMatchedQP.title} (${currentMatchedQP.qpCode}) • ${commuteStatusText}`);
    } else {
      // Unmatched state toast
      if (evalBtn) {
        evalBtn.classList.remove('opacity-90');
        evalBtn.innerHTML = `
          <i data-lucide="alert-circle" class="w-4 h-4 text-amber-300"></i>
          <span>Trade Keywords Needed</span>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
      showEvalToast(`No Trade Matched Yet`, `Please enter or speak your trade (e.g. Solar Pump, Mason, Grain Mill, Carpenter, Dairy).`);
    }

    // Reset button after 2.4 seconds
    setTimeout(() => {
      if (evalBtn) {
        evalBtn.innerHTML = `
          <i data-lucide="check-circle" class="w-4 h-4"></i>
          <span>Evaluate Qualification Match</span>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    }, 2400);

  }, 320);
}


function showEvalToast(title, desc) {
  const toast = document.getElementById('eval-toast');
  const titleEl = document.getElementById('eval-toast-title');
  const descEl = document.getElementById('eval-toast-desc');
  if (!toast) return;

  if (titleEl) titleEl.innerText = title;
  if (descEl) descEl.innerText = desc;

  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('show'), 10);

  if (evalToastTimeout) clearTimeout(evalToastTimeout);
  evalToastTimeout = setTimeout(() => {
    dismissEvalToast();
  }, 4000);
  if (window.lucide) window.lucide.createIcons();
}

function dismissEvalToast() {
  const toast = document.getElementById('eval-toast');
  if (!toast) return;
  toast.classList.remove('show');
  setTimeout(() => toast.classList.add('hidden'), 350);
}



// ============================================================================
// 9. DYNAMIC DISTRICT LIVELIHOOD MAP & AGGREGATOR
// ============================================================================
function initDistrictMap() {
  const container = document.getElementById('district-map');
  if (!container) return;

  if (!leafletMap) {
    leafletMap = L.map('district-map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([25.4800, 80.3300], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors | PM-AJAY GIA'
    }).addTo(leafletMap);
  }

  renderDistrictData(currentDistrictKey);
}

function changeDistrictData(districtKey) {
  currentDistrictKey = districtKey;
  renderDistrictData(districtKey);
}

function renderDistrictData(districtKey) {
  const data = DISTRICT_DATASETS[districtKey] || DISTRICT_DATASETS.banda;
  
  // 1. Calculate Aggregate Metrics Dynamically
  const totalArtisans = data.clusters.reduce((acc, c) => acc + c.artisans, 0);
  const voidClusters = data.clusters.filter(c => c.isVoid);
  const voidCount = voidClusters.length;
  const voidArtisansTotal = voidClusters.reduce((acc, c) => acc + c.artisans, 0);
  const estimatedBudgetLakhs = ((voidArtisansTotal * 15000 + 400000) / 100000).toFixed(1);

  document.getElementById('stat-total-artisans').innerText = totalArtisans.toLocaleString();
  document.getElementById('stat-top-cluster').innerText = data.clusters[0].trade.split('(')[0];
  document.getElementById('stat-top-trade').innerText = data.clusters[0].name;
  document.getElementById('stat-voids').innerText = `${voidCount} Cluster${voidCount > 1 ? 's' : ''}`;
  document.getElementById('stat-budget').innerText = `₹ ${estimatedBudgetLakhs} L`;
  document.getElementById('map-title-district').innerText = `${data.name} Cluster Map:`;

  // 2. Clear old map layers and draw new circles
  if (leafletMap) {
    mapCircleLayers.forEach(layer => leafletMap.removeLayer(layer));
    mapCircleLayers = [];

    leafletMap.setView(data.center, data.zoom);

    data.clusters.forEach(c => {
      const color = c.isVoid ? "#BE123C" : "#0F382A";
      const circle = L.circle([c.lat, c.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        weight: 2,
        radius: c.artisans * 22
      }).addTo(leafletMap);

      circle.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px;">
          <b style="font-size: 12px; color: #161412;">${c.name}</b><br/>
          <b>Artisans:</b> ${c.artisans}<br/>
          <b>Trade:</b> ${c.trade}<br/>
          <b>Status:</b> <span style="font-weight: bold; color: ${color};">${c.status}</span>
        </div>
      `);

      mapCircleLayers.push(circle);
    });

    setTimeout(() => leafletMap.invalidateSize(), 100);
  }

  // 3. Populate Cluster Evidence List
  const evidenceContainer = document.getElementById('cluster-evidence-list');
  if (evidenceContainer) {
    evidenceContainer.innerHTML = '';
    data.clusters.forEach(c => {
      const div = document.createElement('div');
      div.className = "p-3 rounded-xl bg-linen-50 border border-linen-200 space-y-1 hover:border-emerald-800 transition";
      div.innerHTML = `
        <div class="flex justify-between font-bold text-charcoal-900">
          <span>${c.name}</span>
          <span class="${c.isVoid ? 'text-rose-700' : 'text-emerald-800'}">${c.artisans} Artisans</span>
        </div>
        <p class="text-charcoal-600 text-[11px]">
          <b>Trade:</b> ${c.trade} • <b>Status:</b> ${c.status}
        </p>
        <div class="text-[10px] ${c.isVoid ? 'text-rose-700 font-bold' : 'text-emerald-800 font-semibold'}">
          ${c.isVoid ? '• GIA Proposal: Sanction Mobile RPL Van' : '• Assessment Camp Scheduled'}
        </div>
      `;
      evidenceContainer.appendChild(div);
    });
  }
}

// ============================================================================
// 10. NQR REGISTRY & BLUEPRINT MODAL
// ============================================================================
function renderNQRCards(items) {
  const container = document.getElementById('nqr-cards-container');
  if (!container) return;
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = "bg-white p-5 rounded-2xl border border-linen-300 shadow-sm hover:border-emerald-800 transition space-y-3.5 flex flex-col justify-between";
    
    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="bg-linen-100 text-charcoal-700 font-bold text-[10px] px-2 py-0.5 rounded border border-linen-300">
            ${item.category}
          </span>
          <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-800 text-white">
            Level ${item.nsqfLevel}
          </span>
        </div>

        <div>
          <span class="font-mono text-xs text-charcoal-500 font-bold">${item.qpCode}</span>
          <h3 class="font-display font-bold text-base text-charcoal-900 leading-snug mt-0.5">
            ${item.title}
          </h3>
          <p class="text-[11px] text-charcoal-500 mt-0.5">${item.sector}</p>
        </div>

        <div class="bg-linen-50 p-3 rounded-xl border border-linen-200 space-y-1.5 text-xs text-charcoal-700">
          <div class="flex justify-between">
            <span class="text-charcoal-500 text-[11px]">Evaluation:</span>
            <span class="font-bold text-charcoal-900">${item.rplDuration}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-charcoal-500 text-[11px]">Center:</span>
            <span class="font-semibold text-right truncate max-w-[170px] ${item.centerAvailable ? 'text-charcoal-800' : 'text-rose-700'}">
              ${item.nearestCenter}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-1">
        <button onclick="openNQRDetailModal('${item.qpCode}')" class="py-2 px-2.5 rounded-lg bg-linen-100 hover:bg-linen-200 text-charcoal-800 font-display font-bold text-xs transition border border-linen-300 flex items-center justify-center space-x-1">
          <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
          <span>NOS Standards</span>
        </button>
        <button onclick="testThisQualificationInKiosk('${item.qpCode}')" class="py-2 px-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-display font-bold text-xs transition flex items-center justify-center space-x-1">
          <i data-lucide="play" class="w-3.5 h-3.5"></i>
          <span>Load to Desk</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

function filterNQRInteractive() {
  const query = (document.getElementById('nqr-search-input').value || "").toLowerCase();
  const filtered = NQR_DATABASE.filter(item => {
    const matchesCategory = (activeNQRFilter === 'ALL' || item.category === activeNQRFilter);
    const matchesQuery = item.title.toLowerCase().includes(query) ||
                         item.qpCode.toLowerCase().includes(query) ||
                         item.category.toLowerCase().includes(query) ||
                         item.keywords.some(k => k.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  renderNQRCards(filtered);
}

function filterNQRByCategory(category) {
  activeNQRFilter = category;
  
  const pills = document.querySelectorAll('.nqr-filter-pill');
  pills.forEach(p => {
    p.className = "nqr-filter-pill px-3 py-1 rounded-md font-semibold bg-linen-100 text-charcoal-700 hover:bg-linen-200 transition whitespace-nowrap border border-linen-300";
  });

  if (event && event.currentTarget) {
    event.currentTarget.className = "nqr-filter-pill active px-3 py-1 rounded-md font-bold bg-emerald-800 text-white transition whitespace-nowrap";
  }

  filterNQRInteractive();
}

function openNQRDetailModal(qpCode) {
  const item = NQR_DATABASE.find(q => q.qpCode === qpCode) || NQR_DATABASE[0];
  currentMatchedQP = item;

  document.getElementById('detail-qp-code').innerText = item.qpCode;
  document.getElementById('detail-title').innerText = item.title;
  document.getElementById('detail-sector').innerText = item.sector;
  document.getElementById('detail-category-badge').innerText = item.category;
  document.getElementById('detail-level').innerText = `Level ${item.nsqfLevel}`;
  document.getElementById('detail-rpl').innerText = item.rplDuration;
  document.getElementById('detail-center').innerText = item.nearestCenter;

  const nosListEl = document.getElementById('detail-nos-list');
  if (nosListEl && item.nosList) {
    nosListEl.innerHTML = '';
    item.nosList.forEach(nos => {
      const li = document.createElement('li');
      li.innerText = nos;
      nosListEl.appendChild(li);
    });
  }

  const modal = document.getElementById('nqr-detail-modal');
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeNQRDetailModal() {
  const modal = document.getElementById('nqr-detail-modal');
  if (modal) modal.classList.add('hidden');
}

function testThisQualificationInKiosk(qpCode) {
  closeNQRDetailModal();
  const item = qpCode ? NQR_DATABASE.find(q => q.qpCode === qpCode) : currentMatchedQP;
  if (!item) return;

  const dynamicProfile = {
    name: document.getElementById('input-beneficiary-name').value || "Rural Beneficiary",
    location: document.getElementById('input-beneficiary-loc').value || "Banda District (UP)",
    text: item.sampleUtterance,
    expYears: "6 Years Practical Work"
  };

  loadProfile(dynamicProfile);
  switchView('kiosk');
}

// ============================================================================
// 11. ACTION SLIP & A4 PDF EXPORT
// ============================================================================
function openPrintModal() {
  const modal = document.getElementById('print-modal');
  if (modal) {
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closePrintModal() {
  const modal = document.getElementById('print-modal');
  if (modal) modal.classList.add('hidden');
}

function downloadSlipDirectPDF() {
  const element = document.getElementById('pdf-clean-export-container');
  const wrapper = document.getElementById('pdf-export-wrapper');
  if (!element || !wrapper) return;

  wrapper.style.opacity = '1';

  const beneficiaryName = document.getElementById('input-beneficiary-name').value || "Beneficiary";

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Hunar_Action_Slip_${beneficiaryName.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
      scrollX: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(element).save().then(() => {
      wrapper.style.opacity = '0';
      closePrintModal();
    }).catch((err) => {
      wrapper.style.opacity = '0';
      console.error(err);
    });
  } else {
    wrapper.style.opacity = '0';
    window.print();
  }
}

function generateGIAProposalPDF() {
  const data = DISTRICT_DATASETS[currentDistrictKey] || DISTRICT_DATASETS.banda;
  const voidClusters = data.clusters.filter(c => c.isVoid);
  const voidArtisansTotal = voidClusters.reduce((acc, c) => acc + c.artisans, 0);
  const totalArtisans = data.clusters.reduce((acc, c) => acc + c.artisans, 0);
  const estimatedBudgetLakhs = ((voidArtisansTotal * 15000 + 400000) / 100000).toFixed(1);

  alert(`PM-AJAY GIA District Proposal Summary\n\nDistrict: ${data.name}\nTotal Uncertified Population: ${totalArtisans} Artisans\nReachability Voids Identified: ${voidClusters.length} Clusters\n\nProposed Action: Sanction Mobile RPL & Practical Testing Van\nTotal GIA Grant Budget Justified: ₹ ${estimatedBudgetLakhs} Lakhs\n\nBased on aggregated rural CSC intake data.`);
}
