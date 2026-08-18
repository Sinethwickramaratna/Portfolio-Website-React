/**
 * AETHER — the world configuration.
 *
 * Everything about the shape of the experience lives here: the palette,
 * the order of the stations you fly through, and the content each one
 * carries. Nothing here imports React or three, so it is safe for the
 * flat fallback document to read too.
 */

export const PALETTE = {
  void: '#050505',
  deep: '#08090B',
  slate: '#0D0F10',
  cyan: '#00D9F5',
  violet: '#7C5CFF',
  rose: '#E585E4',
  bright: '#F5F5F5',
  muted: '#A0A5AA',
};

/* ------------------------------------------------------------------ *
 * Stations
 *
 * The site is one continuous flight, not a stack of pages. Each entry
 * is a station the camera passes; `vh` is how much scroll runway it is
 * given, which is also what sets the pace of the 3D transition into it.
 * `group` is only for the navigation rail, which collapses the four
 * project stations into a single mark.
 * ------------------------------------------------------------------ */
export const STATIONS = [
  { id: 'hero', vh: 130, group: 'origin', mark: '00', label: 'ORIGIN' },
  { id: 'intro', vh: 130, group: 'thesis', mark: '—', label: 'THESIS' },
  { id: 'profile', vh: 150, group: 'profile', mark: '01', label: 'PROFILE' },
  { id: 'skills', vh: 160, group: 'skills', mark: '—', label: 'NEURAL MAP' },
  { id: 'work-1', vh: 140, group: 'work', mark: '02', label: 'SELECTED WORK' },
  { id: 'work-2', vh: 140, group: 'work' },
  { id: 'work-3', vh: 140, group: 'work' },
  { id: 'work-4', vh: 140, group: 'work' },
  { id: 'work-5', vh: 140, group: 'work' },
  { id: 'work-6', vh: 140, group: 'work' },
  { id: 'work-7', vh: 140, group: 'work' },
  { id: 'journey', vh: 170, group: 'journey', mark: '03', label: 'JOURNEY' },
  { id: 'research', vh: 155, group: 'research', mark: '04', label: 'RESEARCH LAB' },
  { id: 'credentials', vh: 150, group: 'credentials', mark: '05', label: 'CREDENTIALS' },
  { id: 'creative', vh: 175, group: 'creative', mark: '06', label: 'CREATIVE ENGINE' },
  { id: 'philosophy', vh: 135, group: 'philosophy', mark: '—', label: 'DOCTRINE' },
  { id: 'contact', vh: 150, group: 'contact', mark: '07', label: 'CONNECTION' },
];

export const STATION_INDEX = Object.fromEntries(
  STATIONS.map((s, i) => [s.id, i])
);

/** Distance in world units between two neighbouring stations. */
export const STATION_SPREAD = 16;

/** Total document height, in vh. */
export const TOTAL_VH = STATIONS.reduce((sum, s) => sum + s.vh, 0);

/** Rail entries — one per named group, in flight order. */
export const RAIL = STATIONS.filter((s) => s.label).map((s) => ({
  id: s.id,
  mark: s.mark,
  label: s.label,
}));

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */
export const HERO_LABELS = [
  { text: 'AI', angle: -0.35, radius: 5.4, y: 2.1, depth: 0.6 },
  { text: 'DATA', angle: 1.25, radius: 6.1, y: -1.4, depth: -0.9 },
  { text: 'SYSTEMS', angle: 2.55, radius: 5.0, y: 1.5, depth: 1.1 },
  { text: 'RESEARCH', angle: 3.75, radius: 6.4, y: -2.2, depth: -0.4 },
  { text: 'DESIGN', angle: 5.15, radius: 5.2, y: 2.6, depth: 0.2 },
];

/* ------------------------------------------------------------------ *
 * Thesis — the four faces of the practice, carried as nodes inside the
 * constellation rather than laid out as cards.
 * ------------------------------------------------------------------ */
export const THESIS_NODES = [
  { text: 'DATA', note: 'raw signal', p: [-4.6, 1.9, 0.8] },
  { text: 'INTELLIGENCE', note: 'inferred structure', p: [4.1, 2.6, -1.2] },
  { text: 'ENGINEERING', note: 'load-bearing systems', p: [-3.4, -2.7, -0.6] },
  { text: 'CREATIVITY', note: 'the part no model has', p: [4.4, -2.1, 1.0] },
];

/* ------------------------------------------------------------------ *
 * Profile
 * ------------------------------------------------------------------ */
export const PROFILE_META = [
  ['BASED IN', 'SRI LANKA'],
  ['FOCUS', 'DATA SCIENCE'],
  ['INTEREST', 'AI + ML'],
  ['BUILD', 'DIGITAL SYSTEMS'],
];

/* ------------------------------------------------------------------ *
 * Neural map
 *
 * Positions are hand-placed rather than generated: a random cloud reads
 * as noise, a composed one reads as a diagram. `links` are indices into
 * this same array.
 * ------------------------------------------------------------------ */
export const SKILL_NODES = [
  {
    name: 'PYTHON',
    note: 'Primary language for modelling, analysis and services.',
    p: [-5.2, 2.4, 0.9],
    r: 0.42,
    links: [1, 2, 7],
  },
  {
    name: 'MACHINE LEARNING',
    note: 'Classification, regression, evaluation, tuning.',
    p: [-2.1, 3.6, -1.4],
    r: 0.52,
    links: [2, 3, 6],
  },
  {
    name: 'NLP',
    note: 'Transformer fine-tuning, tokenisation, text classification.',
    p: [1.9, 3.9, 0.6],
    r: 0.46,
    links: [6],
  },
  {
    name: 'COMPUTER VISION',
    note: 'Image pipelines, spatial features, perception systems.',
    p: [5.0, 2.6, -0.8],
    r: 0.44,
    links: [6],
  },
  {
    name: 'REACT',
    note: 'Interface layer for everything that has to be used.',
    p: [5.6, -0.6, 1.2],
    r: 0.40,
    links: [5, 9],
  },
  {
    name: 'NEXT.JS',
    note: 'Routing, rendering and delivery for production front-ends.',
    p: [4.4, -3.0, -0.5],
    r: 0.36,
    links: [9],
  },
  {
    name: 'PYTORCH',
    note: 'Training loops, custom heads, CPU-optimised inference.',
    p: [0.6, -3.7, -1.1],
    r: 0.46,
    links: [7],
  },
  {
    name: 'DATA ANALYTICS',
    note: 'Pandas, NumPy, feature engineering, statistical read-outs.',
    p: [-3.6, -3.1, 0.7],
    r: 0.48,
    links: [0, 8],
  },
  {
    name: 'UI / UX',
    note: 'Structure, hierarchy, motion — before any pixel is chosen.',
    p: [-6.0, -1.0, -1.0],
    r: 0.38,
    links: [9],
  },
  {
    name: 'CREATIVE DESIGN',
    note: 'Identity, editorial layout, campaign and event design.',
    p: [-5.4, 0.7, 1.4],
    r: 0.40,
    links: [8, 4],
  },
];

/* ------------------------------------------------------------------ *
 * Selected work
 *
 * `visual` selects the 3D metaphor. No two projects share one — the
 * geometry is part of the description.
 * ------------------------------------------------------------------ */
export const PROJECTS = [
  {
    n: '01',
    station: 'work-1',
    lines: ['MULTI-AGENT', 'TRIAGE'],
    name: 'Clario',
    year: '2026 —',
    category: 'AGENTIC AI / NLP',
    stack: ['Gemma-3', 'QLoRA', 'LangGraph', 'ChromaDB', 'Next.js'],
    visual: 'agents',
    blurb:
      'A customer-support triage system that reads a ticket the way a senior agent would — category, priority, sentiment and a proposed resolution in one pass, entirely offline.',
    body: [
      'Gemma-3-1B was fine-tuned with QLoRA — 4-bit NF4, rank 16 — to generate all four fields jointly rather than running four separate classifiers. On a 2,000-ticket held-out set it reaches 95.8% category accuracy and 75.7% on priority, which is 14.5 points ahead of a fine-tuned BERT baseline on the harder of the two tasks.',
      'That choice was earned rather than assumed. Ten classical and neural classifiers were benchmarked across both tasks — SVM, logistic regression, XGBoost, random forest, naive Bayes, gradient boosting, decision tree, TextCNN, BiLSTM and BERT — reproducing a published triage methodology on our own domain data and documenting the accuracy-against-compute trade-off that justified a compact LLM.',
      'The model sits inside a 14-node LangGraph pipeline: PII redaction, classification, routing, retrieval specialists, validation, bounded reflection and human escalation. Retrieval runs on ChromaDB, so nothing leaves the machine and no external LLM API is called.',
    ],
    facts: [
      ['CATEGORY ACC.', '95.8%'],
      ['PRIORITY ACC.', '75.7%  ·  +14.5 vs BERT'],
      ['PIPELINE', '14-node LangGraph'],
      ['DATASET', '20,000 tickets'],
    ],
    note: 'Group project  ·  CS3501 Data Science & Engineering Project  ·  ongoing',
    contribution:
      'Fine-tuning and evaluation, the ten-model benchmark, pipeline nodes, and customer-facing work in the Next.js front-end — voice-to-text ticket submission and the Supabase-backed ticket history.',
    repo: 'https://github.com/RanugaVW/Clario-multiAgent-triage',
    live: null,
  },
  {
    n: '02',
    station: 'work-2',
    lines: ['AI TEXT', 'DETECTION'],
    name: 'VeriText AI',
    year: '2026',
    category: 'NLP / DETECTION',
    stack: ['PyTorch', 'MiniLM', 'FastAPI', 'Docker', 'React'],
    visual: 'filaments',
    blurb:
      'A transformer classifier that separates machine-generated text from human writing, served over REST and published openly on Hugging Face.',
    body: [
      'A classifier built on all-MiniLM-L6-v2 was trained in PyTorch to tell synthetic prose from human prose, and the trained model is public on Hugging Face rather than locked inside the repository.',
      'Around it sits a FastAPI inference service exposing the model over REST with PDF text extraction, and a React and Tailwind interface that accepts either pasted text or an uploaded document.',
      'The whole stack is containerised with Docker Compose behind Nginx, which makes deployment a single command rather than a runbook.',
    ],
    facts: [
      ['MODEL', 'all-MiniLM-L6-v2'],
      ['INPUT', 'Raw text / PDF'],
      ['PUBLISHED', 'Hugging Face'],
      ['STATUS', 'Live'],
    ],
    note: 'Solo project',
    repo: 'https://github.com/Sinethwickramaratna/AI-Text-Checker',
    live: 'https://veritextai.sinethwickramaratna.dev/',
    extra: {
      label: 'HUGGING FACE',
      href: 'https://huggingface.co/SineWick/AITextChecker',
    },
  },
  {
    n: '03',
    station: 'work-3',
    lines: ['DIAGNOSTIC', 'VISION'],
    name: 'CheXpert RAG Agent',
    year: '2026 —',
    category: 'COMPUTER VISION / RAG',
    stack: ['PyTorch', 'LangChain', 'FastAPI', 'React', 'Docker'],
    visual: 'eye',
    blurb:
      'Chest radiograph classification joined to retrieval, so a prediction arrives with the evidence and the context that support it.',
    body: [
      'DenseNet-121, ViT and Swin Transformer backbones are being benchmarked for multi-label classification using patient-level splits and per-class AUROC with calibration analysis — patient-level because splitting on images leaks the same patient across train and test.',
      'Symptom and treatment retrieval agents run over a vector database with LangChain, and a rule-based fusion layer reconciles what the classifier found with what was retrieved, rather than letting either speak alone.',
      'It is served as a full application: a FastAPI inference API returning predictions, Grad-CAM explanations and RAG-backed recommendations, with a React and TypeScript front-end, containerised with Docker.',
    ],
    facts: [
      ['BACKBONES', 'DenseNet-121 · ViT · Swin'],
      ['SPLIT', 'Patient-level'],
      ['EXPLAINS', 'Grad-CAM + retrieval'],
      ['STATUS', 'In progress'],
    ],
    note: 'Solo project  ·  in progress',
    repo: null,
    live: null,
  },
  {
    n: '04',
    station: 'work-4',
    lines: ['MALNUTRITION', 'HOTSPOTS'],
    name: 'Identifying & Predicting Malnutrition Hotspots',
    year: '2026',
    category: 'RESEARCH / CLASSIFICATION',
    stack: ['scikit-learn', 'XGBoost', 'CatBoost', 'Plotly', 'LaTeX'],
    visual: 'atlas',
    blurb:
      'An end-to-end pipeline that sorts 136 countries into four malnutrition-severity tiers, then asks what the tiers are actually made of.',
    body: [
      'Nine socioeconomic, food-accessibility and health indicators from FAOSTAT, the World Bank, UNDP and the WHO Global Health Observatory were integrated into a single 3,100-record panel spanning 2000 to 2022.',
      'Child stunting and overweight prevalence pull in opposite directions, so both were min-max normalised into one composite Malnutrition Index — collapsing two competing outcomes into a single supervised target that can be labelled consistently at country level.',
      'Five classifiers were benchmarked with GridSearchCV tuning and stratified cross-validation. Random Forest reached 93.8% accuracy, 0.938 F1 and 0.99 ROC-AUC, more than thirty points ahead of the linear baselines. PCA, correlation studies and Plotly dashboards then tied severity back to GDP per capita, HDI, food supply and maternal anaemia.',
    ],
    facts: [
      ['COUNTRIES', '136  ·  3,100 records'],
      ['BEST MODEL', 'Random Forest'],
      ['SCORES', '93.8% acc  ·  F1 0.938  ·  AUC 0.99'],
      ['OUTPUT', 'ACM-format paper'],
    ],
    note: 'Research project  ·  team of six  ·  Introduction to Data Science, University of Moratuwa',
    contribution:
      'Data acquisition, cleaning, exploratory analysis and model evaluation; co-author of the resulting paper.',
    repo: null,
    live: null,
  },
  {
    n: '05',
    station: 'work-5',
    lines: ['LIVESTOCK', 'TELEMETRY'],
    name: 'Cattle.io',
    year: '2026',
    category: 'IOT / APPLIED ML',
    stack: ['MQTT', 'InfluxDB', 'MongoDB', 'FastAPI', 'Flutter'],
    visual: 'telemetry',
    blurb:
      'A smart-collar platform that turns a herd into a time series — and the time series back into something a farmer can act on.',
    body: [
      'The ingestion path was designed end to end: MQTT sensor telemetry into a Node.js and Express service, with MongoDB holding records and InfluxDB holding the high-frequency time-series data, because one store cannot serve both shapes well.',
      'An SVM classifier trained on IMU data detects cattle behaviour and is served through FastAPI. Simulators were written for methane, heat-stress and oestrus alerts so those flows could be exercised without live hardware.',
      'The Flutter client covers herd health records, milk-yield tracking, geofenced location alerts and QR-based smart-collar registration.',
    ],
    facts: [
      ['INGEST', 'MQTT → Influx + Mongo'],
      ['MODEL', 'SVM on IMU data'],
      ['CLIENT', 'Flutter'],
      ['STATUS', 'Complete'],
    ],
    note: 'Group project  ·  full-stack and ML',
    repo: 'https://github.com/orgs/Team-Aquilon/repositories',
    live: null,
  },
  {
    n: '06',
    station: 'work-6',
    lines: ['STUDY', 'COMPANION'],
    name: 'Academent',
    year: '2026',
    category: 'APPLIED AI / EDUCATION',
    stack: ['Node.js', 'Express', 'Google GenAI', 'Firebase', 'React'],
    visual: 'archive',
    blurb:
      'Seven study tools on one API — planner, notes, flashcards, generated quizzes, tutor, reminders and progress analytics.',
    body: [
      'The Node.js and Express API layer integrates Google GenAI with per-user rate limiting and Firebase Admin token verification, plus an admin dashboard for account and system monitoring — the unglamorous half that decides whether a generative feature survives real users.',
      'Seven modules ship against that API on React and Vite with Firebase Authentication, each a different way of turning the same course material into practice rather than reading.',
    ],
    facts: [
      ['MODULES', 'Seven, one API'],
      ['MODEL', 'Google GenAI'],
      ['AUTH', 'Firebase + rate limiting'],
      ['STATUS', 'Complete'],
    ],
    note: 'Solo project',
    repo: 'https://github.com/Sinethwickramaratna/Academent-AI-Study-Comapanion',
    live: null,
  },
  {
    n: '07',
    station: 'work-7',
    lines: ['MOVIE', 'RECOMMENDATION'],
    name: 'CineMatch AI',
    year: '2026',
    category: 'RECOMMENDER SYSTEMS',
    stack: ['scikit-learn', 'pandas', 'FastAPI', 'React 19', 'TMDB'],
    visual: 'orbit',
    blurb:
      'A discovery engine that treats taste as a coordinate rather than a category, and moves through a catalogue the way a person actually browses.',
    body: [
      'Content similarity is computed over a feature space built from genre, cast, keywords and synopsis, then served through a FastAPI layer that keeps the round trip short enough for a debounced search field to feel instantaneous.',
      'The interface is deliberately quiet: a search that responds while you type, a watchlist that persists locally, and no account to create before the product will talk to you.',
    ],
    facts: [
      ['SIGNAL', 'Content-based similarity'],
      ['SOURCE', 'TMDB live catalogue'],
      ['STATE', 'Local-first watchlist'],
      ['STATUS', 'Live'],
    ],
    note: 'Solo project',
    repo: 'https://github.com/Sinethwickramaratna/Movie-Recommendation-Website.git',
    live: 'https://cinematchai.sinethwickramaratna.dev/',
  },
];

/* ------------------------------------------------------------------ *
 * Journey — a trajectory, not a timeline. `t` is the position along the
 * curve, 0 → 1; the node is placed by the curve, not by a grid.
 * ------------------------------------------------------------------ */
export const JOURNEY = [
  {
    t: 0.04,
    key: 'UNIVERSITY',
    title: 'University of Moratuwa',
    detail: 'Computer Science & Engineering — Data Science Engineering track.',
    year: '2023 →',
  },
  {
    t: 0.20,
    key: 'DESIGN',
    title: 'Mathematics Society',
    detail: 'Design committee. The first place the visual work became a discipline.',
    year: '2024',
  },
  {
    t: 0.36,
    key: 'ROTARACT',
    title: 'Rotaract — Moratuwa',
    detail: 'Assistant Treasurer, then Public Relations Avenue Director.',
    year: '2024 →',
  },
  {
    t: 0.52,
    key: 'LEADERSHIP',
    title: 'Hand in Hand · Binara Padhura',
    detail: 'Co-Chairperson. Ran the projects end to end, not just the artwork.',
    year: '2024 — 25',
  },
  {
    t: 0.66,
    key: 'IEEE',
    title: 'IEEE RAS · IEEE SB',
    detail: 'Design committee for MoraForesight 3.0; design lead for Bot Talk 3.0.',
    year: '2025',
  },
  {
    t: 0.82,
    key: 'RESEARCH',
    title: 'Sensor-driven ML research',
    detail: 'Cattle behaviour classification from IoT accelerometer streams.',
    year: '2025',
  },
  {
    t: 0.96,
    key: 'AI PROJECTS',
    title: 'VeriText · CineMatch · Academent',
    detail: 'Shipped intelligence — trained, containerised and deployed.',
    year: '2026',
  },
];

/* ------------------------------------------------------------------ *
 * Research lab
 * ------------------------------------------------------------------ */
export const RESEARCH_PILLARS = [
  {
    key: 'DATA',
    head: 'DATA',
    body: 'Accelerometer streams from collar-mounted IoT sensors, segmented with a sliding window before a single feature is computed.',
    stat: '517',
    statNote: 'test observations',
  },
  {
    key: 'MODELS',
    head: 'MODELS',
    body: 'Cross-validated across candidate classifiers; a support vector machine carried the structured feature space best.',
    stat: 'SVM',
    statNote: 'selected estimator',
  },
  {
    key: 'EXPERIMENTS',
    head: 'EXPERIMENTS',
    body: 'Hyperparameter search over the margin and kernel scale, scored on stratified cross-validation rather than a single split.',
    stat: '0.865',
    statNote: 'cross-val accuracy',
  },
  {
    key: 'RESULTS',
    head: 'RESULTS',
    body: 'Strong on the dominant behaviour class, honest about the long tail — the minority classes are a sampling problem, not a model one.',
    stat: '94%',
    statNote: 'test accuracy',
  },
];

export const RESEARCH_FIELDS = [
  'NLP',
  'MACHINE LEARNING',
  'CLASSIFICATION',
  'COMPUTER VISION',
  'DATA ANALYSIS',
];

/* ------------------------------------------------------------------ *
 * Creative engine — the exhibition. Images are remote; each plate keeps
 * its own depth so the room has actual volume.
 * ------------------------------------------------------------------ */
/* Positions keep the upper-left quadrant clear: the section title is
   set very large in that corner and a plate behind it would turn two
   good pieces of design into one unreadable one. */
/* ------------------------------------------------------------------ *
 * Creative engine — the exhibition.
 *
 * Hung on three walls of a room rather than scattered in a void: a back
 * wall the visitor faces on arrival, and two side walls that only come
 * into view once they have moved. `w` is the plate's width in world
 * units; the height follows from the image.
 * ------------------------------------------------------------------ */
export const EXHIBITION = [
  {
    title: 'BOT TALK 3.0',
    kind: 'EVENT IDENTITY',
    org: 'IEEE RAS · University of Moratuwa',
    src: 'https://i.imgur.com/7Azjxca.jpg',
    p: [-3.5, 1.5, -6.2],
    w: 3.0,
    tilt: 0,
  },
  {
    title: 'DATA STORM 3.0',
    kind: 'CAMPAIGN',
    org: 'Registration close',
    src: 'https://i.imgur.com/RfVjQAS.jpg',
    p: [0, 1.7, -6.2],
    w: 3.2,
    tilt: 0,
  },
  {
    title: 'MORAFORESIGHT 3.0',
    kind: 'POSTER SERIES',
    org: 'Special category',
    src: 'https://i.imgur.com/LwMOUVa.jpg',
    p: [3.5, 1.5, -6.2],
    w: 3.0,
    tilt: 0,
  },
  {
    title: 'HAND IN HAND',
    kind: 'MERCHANDISE',
    org: 'T-shirt pre-order',
    src: 'https://i.imgur.com/zKcLx5S.jpg',
    p: [-3.4, -2.1, -6.2],
    w: 2.7,
    tilt: 0,
  },
  {
    title: 'ARE YOU READY 2026',
    kind: 'RECRUITMENT',
    org: 'Design & editorial committee',
    src: 'https://i.imgur.com/otnGW84.jpg',
    p: [0, -2.2, -6.2],
    w: 2.8,
    tilt: 0,
  },
  {
    title: 'SAKURA 2025',
    kind: 'ANNOUNCEMENT',
    org: 'Date reveal',
    src: 'https://i.imgur.com/GzOvudg.jpg',
    p: [3.4, -2.1, -6.2],
    w: 2.7,
    tilt: 0,
  },
  {
    title: 'BINARA PADURA 2.0',
    kind: 'SPONSORSHIP',
    org: 'Platinum sponsor reveal',
    src: 'https://i.imgur.com/2ctJHHe.jpg',
    p: [-7.4, 1.4, -3.4],
    w: 2.9,
    tilt: 0.42,
  },
  {
    title: 'BINARA PADURA 2.0',
    kind: 'OPEN CALL',
    org: 'Dance performers',
    src: 'https://i.imgur.com/4lP9XoI.jpg',
    p: [-7.4, -2.0, -3.4],
    w: 2.7,
    tilt: 0.42,
  },
  {
    title: 'ARTEGRAFICO',
    kind: 'COMPETITION',
    org: 'Graphic design competition',
    src: 'https://i.imgur.com/BngWGBz.jpg',
    p: [-7.9, 1.3, 0.6],
    w: 2.8,
    tilt: 0.62,
  },
  {
    title: 'SLIOT CHALLENGE 2026',
    kind: 'OPEN CALL',
    org: 'Calling for comperes',
    src: 'https://i.imgur.com/uWgmDjd.jpg',
    p: [7.4, 1.4, -3.4],
    w: 2.9,
    tilt: -0.42,
  },
  {
    title: 'DATA STORM 3.0',
    kind: 'PARTNERSHIP',
    org: 'Digital media partner',
    src: 'https://i.imgur.com/mgO55Hp.jpg',
    p: [7.4, -2.0, -3.4],
    w: 2.7,
    tilt: -0.42,
  },
  {
    title: 'IEEE RAS',
    kind: 'SEASONAL',
    org: 'Sinhala & Tamil New Year',
    src: 'https://i.imgur.com/QJSvcV6.jpg',
    p: [7.9, 1.3, 0.6],
    w: 2.8,
    tilt: -0.62,
  },
  {
    title: 'MORAFORESIGHT 3.0',
    kind: 'PRODUCT',
    org: 'Wristband design',
    src: 'https://i.imgur.com/dMu7z6W.jpg',
    p: [-3.6, 4.4, -5.4],
    w: 2.6,
    tilt: 0,
  },
  {
    title: 'IRON MAN',
    kind: 'PERSONAL',
    org: 'Poster study',
    src: 'https://i.imgur.com/kDop0gB.jpg',
    p: [3.6, 4.4, -5.4],
    w: 2.6,
    tilt: 0,
  },
];

export const CREATIVE_DISCIPLINES = [
  'POSTERS',
  'BRANDING',
  'EVENT DESIGN',
  'UI DESIGN',
  'VISUAL IDENTITY',
];

/* ------------------------------------------------------------------ *
 * Doctrine
 * ------------------------------------------------------------------ */
export const DOCTRINE = [
  { word: 'THINK.', note: 'define the problem before the model' },
  { word: 'BUILD.', note: 'a result that does not run is a note' },
  { word: 'EXPERIMENT.', note: 'the first architecture is never the one' },
  { word: 'EVOLVE.', note: 'ship, measure, dismantle, repeat' },
];

/* ------------------------------------------------------------------ *
 * Connection
 * ------------------------------------------------------------------ */
export const AVAILABLE_FOR = [
  'RESEARCH',
  'COLLABORATION',
  'INNOVATIVE PROJECTS',
  'CREATIVE TECHNOLOGY',
];

/* ------------------------------------------------------------------ *
 * CV
 *
 * >>> PASTE YOUR CV LINK HERE. <<<
 *
 * This is the only place the address appears — the button in the
 * profile section and the entry in the contact channels both read it,
 * so changing this one line changes both.
 *
 * If it is a Google Drive share link, use the /preview or /view form
 * (the /edit form will not open for anyone but you). Leave it as an
 * empty string and the button is not rendered at all, which is better
 * than shipping one that 404s.
 * ------------------------------------------------------------------ */
export const CV_URL = '';

export const LINKS = [
  {
    key: 'EMAIL',
    value: 'sinethwickramaratna@gmail.com',
    href: 'mailto:sinethwickramaratna@gmail.com',
  },
  {
    key: 'GITHUB',
    value: 'github.com/Sinethwickramaratna',
    href: 'https://github.com/Sinethwickramaratna',
  },
  {
    key: 'LINKEDIN',
    value: 'in/sineth-wickramaratna',
    href: 'https://www.linkedin.com/in/sineth-wickramaratna-a4332a2b8/',
  },
];


/* ------------------------------------------------------------------ *
 * Credentials
 *
 * Presented as a ledger rather than a wall of badges: issuer, date and
 * what it was for, with the certificate itself available on demand.
 * `image` is resolved against src/assets/Certificates by the section.
 * ------------------------------------------------------------------ */
export const CERTIFICATES = [
  {
    title: 'SLIIT Robofest 2025 — Finalists',
    issuer: 'SLIIT',
    date: 'Oct 2025',
    kind: 'COMPETITION',
    note: 'Reached the finals of a competitive robotics event.',
    image: 'RoboFest.jpg',
  },
  {
    title: 'Board of Directors — Certificate of Appreciation',
    issuer: 'Rotaract Club of University of Moratuwa',
    date: 'Jun 2025',
    kind: 'LEADERSHIP',
    note: 'Service on the club board across the 2024–25 term.',
    image: 'Board of Directors.jpg',
  },
  {
    title: 'Certificate of Active Membership',
    issuer: 'Rotaract Club of University of Moratuwa',
    date: 'Jun 2025',
    kind: 'SERVICE',
    note: 'Sustained project and committee work through the year.',
    image: 'Rotaract Active Membership.jpg',
  },
  {
    title: 'Intro to Machine Learning',
    issuer: 'Kaggle',
    date: 'Feb 2026',
    kind: 'COURSE',
    note: 'Model fitting, validation and underfitting/overfitting.',
    image: 'Sineth Wickramaratna - Intro to Machine Learning.png',
  },
  {
    title: 'Pandas',
    issuer: 'Kaggle',
    date: 'Feb 2026',
    kind: 'COURSE',
    note: 'Indexing, grouping, joins and reshaping.',
    image: 'Sineth Wickramaratna - Pandas.png',
  },
  {
    title: 'Data Cleaning',
    issuer: 'Kaggle',
    date: 'Feb 2026',
    kind: 'COURSE',
    note: 'Missing values, scaling, parsing dates, character encodings.',
    image: 'Sineth Wickramaratna - Data Cleaning.png',
  },
  {
    title: 'Feature Engineering',
    issuer: 'Kaggle',
    date: 'Feb 2026',
    kind: 'COURSE',
    note: 'Mutual information, target encoding, clustering as a feature.',
    image: 'Sineth Wickramaratna - Feature Engineering.png',
  },
];
