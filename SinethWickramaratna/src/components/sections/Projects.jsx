import { useState } from 'react'
import Reveal from '../Reveal.jsx'
import Dialog from '../Dialog.jsx'
import Icon from '../Icons.jsx'
import { PROJECTS } from '../../data/content.js'
import { titleCase } from '../../data/site.js'

/* Flat covers: a dark violet base with one warm (or lavender) glow. */
const GLOWS = [
  ['#ff6d00', '82% 18%'],
  ['var(--cool-glow)', '15% 85%'],
  ['#ff9e00', '85% 80%'],
  ['#ff7900', '20% 15%'],
  ['var(--cool-glow)', '80% 20%'],
  ['#ff8500', '15% 80%'],
  ['#ff9100', '85% 25%'],
]
const cover = (i) => {
  const [c, at] = GLOWS[i % GLOWS.length]
  return `radial-gradient(circle at ${at}, ${c} 0%, transparent 58%), var(--cover-base)`
}

function Links({ p }) {
  return (
    <>
      {p.live && (
        <a className="ext-link" href={p.live} target="_blank" rel="noreferrer">
          Live <Icon name="out" />
        </a>
      )}
      {p.repo && (
        <a className="ext-link" href={p.repo} target="_blank" rel="noreferrer">
          <Icon name="github" /> Code
        </a>
      )}
      {p.extra && (
        <a className="ext-link" href={p.extra.href} target="_blank" rel="noreferrer">
          {titleCase(p.extra.label)} <Icon name="out" />
        </a>
      )}
    </>
  )
}

function Card({ p, i, onOpen }) {
  const feature = i === 0
  return (
    <Reveal
      as="article"
      className={`card project${feature ? ' project--feature' : ''}`}
      delay={(i % 3) * 80}
    >
      <div className="project-cover" data-n={p.n} style={{ '--cover': cover(i) }}>
        {feature ? <span className="project-feature-badge">Featured</span> : <span className="cat">{p.category}</span>}
        <span className="yr">{p.year}</span>
      </div>
      <div className="project-body">
        {feature && <span className="chip chip--accent" style={{ alignSelf: 'flex-start' }}>{p.category}</span>}
        <h3>{p.name}</h3>
        <p>{p.blurb}</p>
        <div className="project-metrics">
          {p.facts.slice(0, feature ? 3 : 2).map(([k, v]) => (
            <span className="chip chip--accent" key={k}>
              <b>{v.split('  ')[0]}</b>&nbsp;{titleCase(k)}
            </span>
          ))}
        </div>
        <div className="chip-row">
          {p.stack.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
        <div className="project-actions">
          <button type="button" className="link-btn" onClick={() => onOpen(i)} aria-label={`Read the ${p.name} case study`}>
            Case study <Icon name="arrow" />
          </button>
          <span className="spacer" />
          <Links p={p} />
        </div>
      </div>
    </Reveal>
  )
}

export default function Projects() {
  const [active, setActive] = useState(null)
  const p = active === null ? null : PROJECTS[active]

  return (
    <section className="section" id="projects">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Selected work</span>
          <h2>
            Projects that <span className="mark">ship</span>
          </h2>
          <p>
            Agentic AI, NLP, computer vision, IoT and recommender systems, each one trained,
            evaluated and put behind an interface.
          </p>
        </Reveal>
        <div className="projects-grid">
          {PROJECTS.map((proj, i) => (
            <Card key={proj.n} p={proj} i={i} onOpen={setActive} />
          ))}
        </div>
      </div>

      <Dialog open={p !== null} onClose={() => setActive(null)} className="modal" label={p ? `${p.name} case study` : 'Case study'}>
        {p && (
          <>
            <div className="modal-head" style={{ '--cover': cover(active) }}>
              <span className="cat">
                {p.category} &middot; {p.year}
              </span>
              <h3>{p.name}</h3>
              <button type="button" className="icon-btn modal-close" onClick={() => setActive(null)} aria-label="Close case study">
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-body">
              {p.body.map((para, k) => (
                <p key={k}>{para}</p>
              ))}
              <dl className="modal-facts">
                {p.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              {p.contribution && (
                <div className="modal-note">
                  <b>My contribution</b>
                  <p>{p.contribution}</p>
                </div>
              )}
              <p className="chip-row">
                {p.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </p>
              <div className="project-actions">
                <span className="chip">{p.note}</span>
                <span className="spacer" />
                <Links p={p} />
              </div>
            </div>
          </>
        )}
      </Dialog>
    </section>
  )
}
