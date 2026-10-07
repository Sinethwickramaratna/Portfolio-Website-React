import { LINKS } from '../data/content.js'
import { NAME } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <p>
          © {new Date().getFullYear()} {NAME}. Designed &amp; built by me.
        </p>
        <div className="footer-links">
          {LINKS.map((l) => (
            <a key={l.key} href={l.href} target={l.key === 'EMAIL' ? undefined : '_blank'} rel="noreferrer">
              {l.key === 'EMAIL' ? 'Email' : l.key === 'GITHUB' ? 'GitHub' : 'LinkedIn'}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
