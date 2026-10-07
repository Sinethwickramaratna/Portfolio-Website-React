import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { CERT_ITEMS } from '../data/certs.js'

export default function CertificatesPage() {
  const [open, setOpen] = useState(null)
  return (
    <>
      <Nav simple />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">Credentials</span>
            <h1>
              Certificates &amp; <span className="mark">achievements</span>
            </h1>
            <p>Competition results, leadership recognition and certified coursework. Select one to view it in full.</p>
          </div>
          <div className="cert-grid">
            {CERT_ITEMS.map((c, i) => (
              <button type="button" key={c.title} className="card cert" onClick={() => setOpen(i)}>
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
                  <p>{c.note}</p>
                </span>
              </button>
            ))}
          </div>
        </div>
        <Lightbox items={CERT_ITEMS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      </main>
      <Footer />
    </>
  )
}
