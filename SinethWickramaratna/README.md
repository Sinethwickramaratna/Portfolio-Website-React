# Sineth Wickramaratna — Portfolio

A fast, flat, recruiter-friendly portfolio built with React + Vite. Light and dark themes, no 3D/WebGL.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## Edit your content

Everything on the home page comes from [`src/data/content.js`](src/data/content.js):
`PROJECTS`, `JOURNEY`, `RESEARCH_PILLARS`, `DESIGN_WORKS`, `CERTIFICATES`, `LINKS`, `AVAILABLE_FOR` and `CV_URL`.
Skill groups, the nav and the hero stats live in [`src/data/site.js`](src/data/site.js). Hero/About/Contact copy is in
`src/components/sections/`.

- **CV button** — set `CV_URL` in `content.js`; while it is empty the button is not rendered.
- **Gallery** — `src/data/galleryImages.json`.

## Design system

- Colour tokens and both themes: [`src/styles/tokens.css`](src/styles/tokens.css) (the 10 supplied palette colours are
  declared once and mapped to theme roles). The theme is chosen from the OS setting on first visit, then remembered.
- Layout and components: [`src/styles/site.css`](src/styles/site.css).

Previous 3D version is kept in `_legacy/` for reference; it is not part of the build.
