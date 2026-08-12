/**
 * SYNTHESIS — world configuration.
 *
 * The site is a single continuous space. Environments sit at fixed
 * points along the -Z axis and the camera flies through them; scrolling
 * moves the camera, not the page.
 *
 * Everything downstream (camera spline, side navigation, DOM overlays,
 * scroll length) derives from SECTIONS, so adding an environment is a
 * matter of adding one entry here.
 */

/** Distance between environment centres, in world units. */
export const SECTION_SPACING = 170;

/** How far in front of its environment the camera rests at a stop.
 *  Because each leg travels from `env.z + OFFSET` to the next stop, the
 *  camera necessarily passes *through* every environment on the way. */
export const CAMERA_STANDOFF = 60;

/** Lateral drift per stop. Gives the flight path banking curves rather
 *  than a dead-straight tunnel. */
const DRIFT = [
  [0, 0],
  [11, 5],
  [-7, 17],
  [9, -2],
  [-11, 3],
  [7, 7],
  [-9, -7],
  [0, 0],
];

export const SECTIONS = [
  {
    id: 'void',
    index: 0,
    number: '01',
    label: 'VOID',
    title: 'SINETH',
    lines: ['DATA SCIENCE', 'ENGINEERING', 'CREATIVE TECHNOLOGY'],
    cue: 'ENTER THE SYSTEM',
  },
  {
    id: 'dna',
    index: 1,
    number: '02',
    label: 'DNA',
    title: 'THE DNA',
    kicker: 'WHAT I AM MADE OF',
    segments: [
      {
        key: 'data',
        name: 'DATA',
        body: 'Turning raw information into meaningful insight — cleaning, shaping and interrogating datasets until they admit what they know.',
      },
      {
        key: 'intelligence',
        name: 'INTELLIGENCE',
        body: 'Models that learn structure rather than memorise noise. Statistical rigour before architectural fashion.',
      },
      {
        key: 'engineering',
        name: 'ENGINEERING',
        body: 'Building the systems that turn an idea into something that runs, scales and keeps running when nobody is watching.',
      },
      {
        key: 'creativity',
        name: 'CREATIVITY',
        body: 'Designing experiences that go beyond functioning correctly. Interfaces people remember, not merely tolerate.',
      },
      {
        key: 'leadership',
        name: 'LEADERSHIP',
        body: 'Directing communications and teams at Rotaract — turning a group of capable people into a single coherent effort.',
      },
    ],
  },
  {
    id: 'city',
    index: 2,
    number: '03',
    label: 'NEURAL CITY',
    title: 'NEURAL CITY',
    kicker: 'CAPABILITY, BUILT UP',
  },
  {
    id: 'orbit',
    index: 3,
    number: '04',
    label: 'ORBIT',
    title: 'THE ORBIT',
    kicker: 'SELECTED WORK',
  },
  {
    id: 'museum',
    index: 4,
    number: '05',
    label: 'MUSEUM',
    title: 'THE MUSEUM',
    kicker: 'DESIGN ARCHIVE',
  },
  {
    id: 'lab',
    index: 5,
    number: '06',
    label: 'LAB',
    title: 'THE LAB',
    kicker: 'RESEARCH IN PROGRESS',
    experiments: [
      {
        code: 'EXPERIMENT 001',
        name: 'TEXT EMOTION\nCLASSIFICATION',
        rows: [
          ['MODEL', 'Random Forest'],
          ['DATASET', 'GoEmotions'],
          ['CLASSES', 'Multi-class'],
          ['F1', '0.694'],
        ],
      },
      {
        code: 'EXPERIMENT 002',
        name: 'CATTLE BEHAVIOUR\nRECOGNITION',
        rows: [
          ['SENSING', 'IoT accelerometer'],
          ['METHOD', 'Sliding window'],
          ['PIPELINE', 'Edge → cloud'],
          ['STATUS', 'Active'],
        ],
      },
    ],
  },
  {
    id: 'river',
    index: 6,
    number: '07',
    label: 'FLOW',
    title: 'THE FLOW',
    kicker: 'TRAJECTORY',
    milestones: [
      { year: '2023', name: 'UNIVERSITY OF MORATUWA', note: 'Computer Science & Engineering' },
      { year: '2024', name: 'DATA SCIENCE SPECIALISATION', note: 'Statistics, ML, data systems' },
      { year: '2025', name: 'ROTARACT · PR DIRECTOR', note: 'Communications and brand' },
      { year: '2025', name: 'IEEE · PROJECTS', note: 'Applied engineering work' },
      { year: '2026', name: 'RESEARCH', note: 'IoT + ML behaviour modelling' },
    ],
  },
  {
    id: 'portal',
    index: 7,
    number: '08',
    label: 'PORTAL',
    title: 'READY\nTO BUILD\nSOMETHING\nNEW?',
    kicker: 'CONNECT',
  },
];

export const SECTION_COUNT = SECTIONS.length;

/** Normalised position of each stop along the flight, 0 → 1. */
export const sectionT = (index) =>
  SECTION_COUNT > 1 ? index / (SECTION_COUNT - 1) : 0;

/** Gap between two stops in normalised flight units. */
export const SECTION_STEP = SECTION_COUNT > 1 ? 1 / (SECTION_COUNT - 1) : 1;

/**
 * How far either side of its stop an overlay stays visible.
 *
 * This has to be a fraction of SECTION_STEP, not an absolute number: at
 * 0.6 of the gap a panel is fully faded well before its neighbour's
 * panel appears. Anything approaching a full step and every panel on the
 * site is legible at once.
 */
export const FADE_WINDOW = SECTION_STEP * 0.6;

/** World-space centre of an environment. */
export const envPosition = (index) => [0, 0, -SECTION_SPACING * index];

/** Camera resting pose for a stop. */
export const cameraAnchor = (index) => {
  const [dx, dy] = DRIFT[index] ?? [0, 0];
  return [dx, dy, -SECTION_SPACING * index + CAMERA_STANDOFF];
};

/** Scroll length of the document, in viewport heights. */
export const SCROLL_VH_PER_SECTION = 115;
export const TOTAL_SCROLL_VH = SCROLL_VH_PER_SECTION * SECTION_COUNT;

/** Palette, mirrored from theme.css so materials and CSS never drift. */
export const PALETTE = {
  void: '#030407',
  void2: '#080b12',
  light: '#f5f7fa',
  cyan: '#00e5ff',
  violet: '#7b61ff',
  magenta: '#ff4ecd',
  grey: '#6b7383',
};
