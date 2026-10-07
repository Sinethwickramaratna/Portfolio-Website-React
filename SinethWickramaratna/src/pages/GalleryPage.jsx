import { useState } from 'react'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import Lightbox from '../components/Lightbox.jsx'
import images from '../data/galleryImages.json'

const ITEMS = images.map((g) => ({ src: g.image, title: g.title, subtitle: g.subtitle }))

export default function GalleryPage() {
  const [open, setOpen] = useState(null)
  return (
    <>
      <Nav simple />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">Creative work</span>
            <h1>
              Design <span className="mark">gallery</span>
            </h1>
            <p>
              {ITEMS.length} posters, flyers and campaign pieces designed for university societies, clubs and
              events.
            </p>
          </div>
          <div className="poster-grid">
            {ITEMS.map((d, i) => (
              <button type="button" key={`${d.src}-${i}`} className="poster" onClick={() => setOpen(i)} aria-label={`Open ${d.title}`}>
                <img src={d.src} alt={d.title} loading="lazy" decoding="async" />
                <span className="cap">
                  <b>{d.title}</b>
                  <span>{d.subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <Lightbox items={ITEMS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      </main>
      <Footer />
    </>
  )
}
