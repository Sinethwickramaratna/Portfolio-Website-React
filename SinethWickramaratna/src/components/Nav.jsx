import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icons.jsx'
import useTheme from '../hooks/useTheme.js'
import { NAV } from '../data/site.js'

function ThemeToggle() {
  const [theme, toggle] = useTheme()
  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={theme === 'dark'}
    >
      <Icon name="moon" className="moon" />
      <Icon name="sun" className="sun" />
    </button>
  )
}

/** Floating pill navigation. `simple` is the slim version for sub-pages. */
export default function Nav({ simple = false }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    if (simple) return undefined
    const sections = NAV.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [simple])

  if (simple) {
    return (
      <div className="nav-wrap simple-nav">
        <nav className="nav" aria-label="Primary">
          <Link to="/" className="brand">
            <span className="brand-mark">S</span>
            <span>Sineth</span>
          </Link>
          <div className="nav-actions">
            <Link to="/" className="btn btn--ghost btn--sm">
              <Icon name="back" /> Portfolio
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className="nav-wrap">
      <nav className="nav" aria-label="Primary">
        <a href="#top" className="brand" aria-label="Sineth Wickramaratna — top">
          <span className="brand-mark">S</span>
          <span>Sineth</span>
        </a>
        <div className={`nav-links${open ? ' open' : ''}`} id="nav-links">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <a href="#contact" className="btn btn--primary btn--sm">
            Let&rsquo;s talk
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>
    </div>
  )
}
