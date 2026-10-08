import {
  siReact, siDocker, siPytorch, siFastapi, siNextdotjs, siScikitlearn, siMongodb, siInfluxdb,
  siFlutter, siNodedotjs, siExpress, siFirebase, siPandas, siPlotly, siLatex, siMqtt,
  siLangchain, siLanggraph, siGooglegemini, siThemoviedatabase, siPython, siNumpy, siHuggingface,
  siTypescript, siSupabase, siGithub, siFigma,
} from 'simple-icons'

/** name as used in content.js -> simple-icons entry. Anything missing gets a monogram tile. */
const ICONS = {
  React: siReact, 'React 19': siReact, Docker: siDocker, PyTorch: siPytorch, FastAPI: siFastapi,
  'Next.js': siNextdotjs, 'scikit-learn': siScikitlearn, MongoDB: siMongodb, InfluxDB: siInfluxdb,
  Flutter: siFlutter, 'Node.js': siNodedotjs, Express: siExpress, Firebase: siFirebase, pandas: siPandas,
  Plotly: siPlotly, LaTeX: siLatex, MQTT: siMqtt, LangChain: siLangchain, LangGraph: siLanggraph,
  'Google GenAI': siGooglegemini, TMDB: siThemoviedatabase, Python: siPython, NumPy: siNumpy,
  'Hugging Face': siHuggingface, TypeScript: siTypescript, Supabase: siSupabase, GitHub: siGithub, Figma: siFigma,
}

export const iconFor = (name) => ICONS[name] || null
export const monogram = (name) =>
  name.replace(/[^A-Za-z0-9]/g, ' ').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

/** Brands whose official glyph is not in simple-icons get a branded tile. */
export const TILES = {
  Photoshop: { label: 'Ps', bg: '#001e36', fg: '#31a8ff' },
  Illustrator: { label: 'Ai', bg: '#330000', fg: '#ff9a00' },
  Canva: { label: 'C', bg: '#00c4cc', fg: '#ffffff' },
}
