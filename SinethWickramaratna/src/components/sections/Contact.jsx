import { useState } from 'react'
import Reveal from '../Reveal.jsx'
import Icon from '../Icons.jsx'
import { AVAILABLE_FOR, LINKS, CV_URL } from '../../data/content.js'
import { EMAIL, titleCase } from '../../data/site.js'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section className="section" id="contact" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal className="contact-card">
          <span className="eyebrow">Contact</span>
          <h2>
            Let&rsquo;s build something <span className="mark">great</span>
          </h2>
          <p>
            Hiring for an internship, starting a research project or need a designer who can also train the
            model? My inbox is open.
          </p>
          <div className="avail">
            {AVAILABLE_FOR.map((a) => (
              <span className="chip" key={a}>
                {titleCase(a)}
              </span>
            ))}
          </div>
          <div className="contact-actions">
            <a className="btn btn--primary" href={`mailto:${EMAIL}`}>
              <Icon name="mail" /> Say hello
            </a>
            <button type="button" className="btn btn--ghost" onClick={copy} aria-live="polite">
              <Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Email copied' : 'Copy email'}
            </button>
            {CV_URL && (
              <a className="btn btn--ghost" href={CV_URL} target="_blank" rel="noreferrer">
                <Icon name="download" /> Download CV
              </a>
            )}
          </div>
          <div className="contact-links">
            {LINKS.map((l) => (
              <a key={l.key} href={l.href} target={l.key === 'EMAIL' ? undefined : '_blank'} rel="noreferrer">
                <small>{l.key}</small>
                <span>{l.value}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
