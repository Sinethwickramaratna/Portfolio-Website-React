import { PROJECTS, DESIGN_WORKS } from './content.js'
import GALLERY from './galleryImages.json'

export const NAME = 'Sineth Wickramaratna'
export const EMAIL = 'sinethwickramaratna@gmail.com'

export const NAV = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['journey', 'Journey'],
  ['research', 'Research'],
  ['design', 'Design'],
]

/** Skills grouped for the page. `tools` render with brand logos where one exists. */
export const SKILL_GROUPS = [
  {
    title: 'AI and Machine Learning',
    icon: 'brain',
    blurb: 'Models that classify, retrieve and explain, evaluated honestly and served as products.',
    tags: ['Machine Learning', 'NLP', 'Computer Vision', 'Agentic AI'],
    tools: ['PyTorch', 'scikit-learn', 'LangChain', 'LangGraph', 'Hugging Face', 'Google GenAI', 'XGBoost', 'ChromaDB'],
  },
  {
    title: 'Data',
    icon: 'chart',
    blurb: 'From raw signal to clean features and clear statistical read outs.',
    tags: ['Feature Engineering', 'Data Cleaning', 'Statistics', 'Visualisation'],
    tools: ['Python', 'pandas', 'NumPy', 'Plotly', 'InfluxDB', 'MongoDB'],
  },
  {
    title: 'Web and Apps',
    icon: 'code',
    blurb: 'Interfaces and services that put a model in front of the person who needs it.',
    tags: ['Full Stack', 'REST APIs', 'Mobile'],
    tools: ['React', 'Next.js', 'TypeScript', 'Node.js', 'FastAPI', 'Flutter', 'Firebase', 'Docker'],
  },
  {
    title: 'Design',
    icon: 'palette',
    blurb: 'Structure, hierarchy and motion before any pixel is chosen.',
    tags: ['UI and UX', 'Posters', 'Branding', 'Event Design', 'Visual Identity'],
    tools: [],
  },
]

export const STATS = {
  projects: PROJECTS.length,
  live: PROJECTS.filter((p) => p.live).length,
  designs: DESIGN_WORKS.length,
}

/** Unique tools across every project, for the marquee. */
export const STACK = [...new Set(PROJECTS.flatMap((p) => p.stack))]

/** Wall of posters: curated featured works first, then the rest of the gallery. */
export const WALL = [...DESIGN_WORKS.map((d) => ({ src: d.src, title: d.title, subtitle: `${d.kind.charAt(0)}${d.kind.slice(1).toLowerCase()}` })),
  ...GALLERY.map((g) => ({ src: g.image, title: g.title, subtitle: g.subtitle }))].filter((x, i, a) => a.findIndex((y) => y.src === x.src) === i)

const ACRONYMS = ['NLP', 'AI', 'ML', 'IoT', 'UI', 'UX', 'RAG', 'API', 'PDF', 'LLM', 'SVM', 'IMU', 'CV']

export const titleCase = (s) =>
  s
    .toLowerCase()
    .replace(/(^|[\s·/(-])([a-z])/g, (_, a, b) => a + b.toUpperCase())
    .replace(/[A-Za-z]+/g, (w) => ACRONYMS.find((a) => a.toLowerCase() === w.toLowerCase()) || w)
