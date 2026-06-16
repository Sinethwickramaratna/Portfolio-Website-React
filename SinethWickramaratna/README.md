# Sineth Wickramaratna — Portfolio

A compact, responsive portfolio built with React and Vite that showcases projects, certificates, skills, and contact options. The site includes interactive visuals (3D carousel, canvas scenes), audio controls, custom cursor, and performance telemetry.

**Live demo:** Add your deployed URL or GitHub Pages/Vercel link here.

## Key Features

- Hero section with animated visuals and `CyberSamurai` artwork
- Interactive 3D image carousel (`ImageCarousel3D`) and gallery pages
- Projects showcase populated from `src/data/projectsData.json`
- Skills and statistics (`SkillsSection`, `StatCard`, `StatItem`)
- Certificates gallery and certificate detail cards
- Contact form powered by EmailJS (`@emailjs/browser`) and social links
- Global audio control and custom cursor for immersive UX
- Scroll progress/katana-style indicator and smooth scroll animations
- Lightweight telemetry for Core Web Vitals (`CoreTelemetry` components)

## Tech Stack

- React (v19) + JSX
- Vite (dev server and build)
- CSS modules / component-level CSS (project uses plain CSS files)
- Optional: Tailwind and Three.js are included in dependencies for advanced visuals
- EmailJS for client-side contact form integration

## Project layout (high level)

- `src/` — application source
  - `components/` — UI components (Hero, About, Projects, Skills, Contact, Gallery, etc.)
  - `components/public/` — `NavBar`, `Footer`, global UI
  - `data/` — JSON content: `projectsData.json`, `skillsData.json`, `certificatesData.json`, `contactData.json`
  - `assets/` — images, logos, certificates
  - `hooks/` — custom hooks (e.g., `useInView`, `useAmbientSynth`)

## Getting started

### Prerequisites

- Node.js (v16+)
- npm (or yarn)

### Install and run (development)

```bash
npm install
npm run dev
```

Open the app at `http://localhost:5173` (Vite default).

### Build & preview

```bash
npm run build
npm run preview
```

Available npm scripts (from `package.json`):

- `dev` — start Vite dev server
- `build` — create production build
- `preview` — preview production build locally
- `lint` — run ESLint

## Customize content

Edit the JSON files in [src/data](src/data):

- [src/data/projectsData.json](src/data/projectsData.json)
- [src/data/skillsData.json](src/data/skillsData.json)
- [src/data/certificatesData.json](src/data/certificatesData.json)
- [src/data/contactData.json](src/data/contactData.json)

Update component styles in `src/Components/` if you need to change layout or visuals.

## Notes & tips

- Email sending is handled client-side using EmailJS — configure your EmailJS service ID and template keys in the contact form component or environment variables.
- Tailwind and Three.js are present for optional use in experimental visuals.
- If you add images, place them under `src/assets/Images` and reference them from the data JSON files.

## Contributing & License

This is a personal portfolio project. Contributions are welcome as suggestions — open an issue or reach out if you'd like to propose changes.

**Last updated:** 2026-06-16

Made with ❤️ by Sineth Wickramaratna
