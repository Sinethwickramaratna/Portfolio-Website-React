import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal.jsx'
import Lightbox from '../Lightbox.jsx'
import Icon from '../Icons.jsx'
import { CERT_ITEMS } from '../../data/certs.js'

export default function Certificates() {
  const [open, setOpen] = useState(null)
  const preview = CERT_ITEMS.slice(0, 3)
  return (
    <section className="section" id="certificates" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal className="section-head section-head--row">
          <div style={{ display: 'grid', gap: 14 }}>
            <span className="eyebrow">Credentials</span>
            <h2>
              Proof, <span className="mark">not promises</span>
            </h2>
            <p>Competition results, leadership recognition and certified coursework.</p>
          </div>
          <Link to="/certificates" className="btn btn--ghost">
            All {CERT_ITEMS.length} <Icon name="arrow" className="arrow" />
          </Link>
        </Reveal>
        <div className="cert-grid">
          {preview.map((c, i) => (
            <Reveal as="button" type="button" key={c.title} className="card cert" delay={i * 80} onClick={() => setOpen(i)}>
              <span className="cert-img">
                <img src={c.src} alt={`${c.title} certificate`} loading="lazy" />
              </span>
              <span className="cert-body">
                <span className="cert-meta">
                  <span>{c.kind}</span>
                  <span>{c.date}</span>
                </span>
                <h3>{c.title}</h3>
                <p>{c.issuer}</p>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox items={CERT_ITEMS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </section>
  )
}
