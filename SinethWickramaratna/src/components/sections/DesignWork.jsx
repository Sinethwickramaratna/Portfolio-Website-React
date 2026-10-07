import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal.jsx'
import Lightbox from '../Lightbox.jsx'
import Icon from '../Icons.jsx'
import { WALL } from '../../data/site.js'

const COLS = 5
const RATIOS = ['4 / 5', '1 / 1', '3 / 4', '4 / 5', '5 / 6']
const DURATIONS = [78, 94, 70, 88, 100]

const columns = Array.from({ length: COLS }, (_, c) =>
  WALL.map((w, i) => ({ ...w, i })).filter((w) => w.i % COLS === c),
)

function Item({ w, c, k, hidden, onOpen }) {
  return (
    <button
      type="button"
      className="wall-item"
      style={{ aspectRatio: RATIOS[(c + k) % RATIOS.length] }}
      onClick={() => onOpen(w.i)}
      aria-label={`Open ${w.title}`}
      aria-hidden={hidden ? 'true' : undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <img src={w.src} alt={hidden ? '' : w.title} loading="lazy" decoding="async" />
      <span className="cap">
        <b>{w.title}</b>
        <span>{w.subtitle}</span>
      </span>
    </button>
  )
}

export default function DesignWork() {
  const [open, setOpen] = useState(null)
  return (
    <section className="section wall-section" id="design">
      <div className="container">
        <Reveal className="wall-head">
          <span className="eyebrow">Creative work</span>
          <h2>
            Design with <span className="mark">purpose</span>
          </h2>
          <p>Posters, event identities and campaigns for IEEE RAS, Rotaract, Hand in Hand and more.</p>
        </Reveal>
      </div>
      <div className="wall" role="group" aria-label="Poster and campaign designs, select one to enlarge">
        {columns.map((col, c) => (
          <div className="wall-col" key={c} style={{ '--dur': `${DURATIONS[c]}s` }}>
            <div className="wall-track">
              {[0, 1].map((copy) => (
                <div className="wall-set" key={copy}>
                  {col.map((w, k) => (
                    <Item key={w.src} w={w} c={c} k={k} hidden={copy === 1} onOpen={setOpen} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="container wall-foot">
        <Link to="/gallery" className="btn btn--primary">
          View the full gallery <Icon name="arrow" className="arrow" />
        </Link>
        <span className="chip">{WALL.length} works and counting</span>
      </div>
      <Lightbox items={WALL} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </section>
  )
}
