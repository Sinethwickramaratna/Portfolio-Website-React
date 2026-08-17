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
  { id: 'work-1', vh: 150, group: 'work', mark: '02', label: 'SELECTED WORK' },
  { id: 'work-2', vh: 150, group: 'work' },
  { id: 'work-3', vh: 150, group: 'work' },
  { id: 'work-4', vh: 150, group: 'work' },
  { id: 'journey', vh: 170, group: 'journey', mark: '03', label: 'JOURNEY' },
  { id: 'research', vh: 155, group: 'research', mark: '04', label: 'RESEARCH LAB' },
  { id: 'creative', vh: 165, group: 'creative', mark: '05', label: 'CREATIVE ENGINE' },
  { id: 'philosophy', vh: 135, group: 'philosophy', mark: '—', label: 'DOCTRINE' },
  { id: 'contact', vh: 150, group: 'contact', mark: '06', label: 'CONNECTION' },
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
    lines: ['AI TEXT', 'INTELLIGENCE'],
    name: 'VeriText AI',
    year: '2026',
    category: 'NLP / DETECTION',
    stack: ['PyTorch', 'BERT', 'FastAPI', 'React', 'Docker'],
    visual: 'filaments',
    blurb:
      'A containerised detector that separates human writing from machine generation by reading perplexity, burstiness and the flatness of synthetic prose.',
    body: [
      'A custom classifier head trained on a bidirectional sentence encoder reads a passage the way a linguist would — looking for the absence of variance rather than the presence of a watermark.',
      'The service accepts pasted text or an uploaded PDF, runs a CPU-optimised inference path, and returns a calibrated judgement with the signals behind it. The whole stack ships as one Docker Compose ecosystem with a cached model volume and Nginx in front.',
    ],
    facts: [
      ['MODEL', 'MiniLM-L6-v2 + custom head'],
      ['INPUT', 'Raw text / PDF'],
      ['FOOTPRINT', '~2 GB reduced image'],
      ['STATUS', 'Live'],
    ],
    repo: 'https://github.com/Sinethwickramaratna/AI-Text-Checker.git',
    live: 'https://veritextai.sinethwickramaratna.dev/',
  },
  {
    n: '02',
    station: 'work-2',
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
    repo: 'https://github.com/Sinethwickramaratna/Movie-Recommendation-Website.git',
    live: 'https://cinematchai.sinethwickramaratna.dev/',
  },
  {
    n: '03',
    station: 'work-3',
    lines: ['COMPUTER', 'VISION'],
    name: 'Perception Track',
    year: '2026',
    category: 'VISION / SPATIAL ML',
    stack: ['Python', 'OpenCV', 'PyTorch', 'NumPy'],
    visual: 'eye',
    blurb:
      'An ongoing study of machine perception — turning pixels into geometry, and geometry into something a system can act on.',
    body: [
      'The work sits between classical image processing and learned representation: calibration and feature extraction on one side, convolutional and transformer backbones on the other.',
      'The current track focuses on spatial understanding — depth, structure and the point clouds that fall out of a scene once you stop treating an image as a flat grid.',
    ],
    facts: [
      ['DOMAIN', 'Spatial understanding'],
      ['METHODS', 'Classical + learned'],
      ['OUTPUT', 'Point cloud / features'],
      ['STATUS', 'In development'],
    ],
    repo: null,
    live: null,
  },
  {
    n: '04',
    station: 'work-4',
    lines: ['ACADEMENT'],
    name: 'Academent',
    year: '2026',
    category: 'APPLIED AI / EDUCATION',
    stack: ['Python', 'LLM', 'React', 'PostgreSQL'],
    visual: 'archive',
    blurb:
      'A study platform that treats a syllabus as a structure to be navigated rather than a document to be read.',
    body: [
      'Course material is decomposed into a connected knowledge structure, so a student can move between concepts by relationship instead of by page number.',
      'On top of that structure sit the things a learner actually asks for: explanation at the right altitude, retrieval practice, and a view of what has and has not been understood yet.',
    ],
    facts: [
      ['SHAPE', 'Knowledge graph'],
      ['SURFACE', 'Web application'],
      ['FOR', 'Undergraduate study'],
      ['STATUS', 'In development'],
    ],
    repo: null,
    live: null,
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
export const EXHIBITION = [
  {
    title: 'BOT TALK 3.0',
    kind: 'EVENT IDENTITY',
    src: 'https://i.imgur.com/7Azjxca.jpg',
    p: [-4.9, -1.9, 1.6],
    scale: 2.9,
    tilt: 0.16,
  },
  {
    title: 'DATA STORM 3.0',
    kind: 'CAMPAIGN',
    src: 'https://i.imgur.com/RfVjQAS.jpg',
    p: [0.6, 1.9, -2.6],
    scale: 3.6,
    tilt: -0.08,
  },
  {
    title: 'MORAFORESIGHT 3.0',
    kind: 'POSTER SERIES',
    src: 'https://i.imgur.com/LwMOUVa.jpg',
    p: [5.2, 0.9, 0.2],
    scale: 3.2,
    tilt: -0.18,
  },
  {
    title: 'HAND IN HAND',
    kind: 'MERCHANDISE',
    src: 'https://i.imgur.com/zKcLx5S.jpg',
    p: [-1.4, -3.1, -1.4],
    scale: 2.6,
    tilt: 0.2,
  },
  {
    title: 'ARE YOU READY 2026',
    kind: 'RECRUITMENT',
    src: 'https://i.imgur.com/otnGW84.jpg',
    p: [3.6, -3.0, 2.2],
    scale: 2.5,
    tilt: 0.1,
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
