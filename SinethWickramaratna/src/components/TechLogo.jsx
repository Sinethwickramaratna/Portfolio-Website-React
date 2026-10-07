import { iconFor, monogram } from '../data/techIcons.js'

const lum = (hex) => {
  const n = parseInt(hex, 16)
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255)
}

/** A technology name with its brand glyph. Brand colour is used only where it stays legible on the active theme. */
export default function TechLogo({ name, className = '' }) {
  const icon = iconFor(name)
  let style
  if (icon) {
    const l = lum(icon.hex)
    style = {
      '--b-light': l > 0.55 ? 'var(--text-2)' : `#${icon.hex}`,
      '--b-dark': l < 0.12 ? 'var(--text-2)' : `#${icon.hex}`,
    }
  }
  return (
    <span className={`tech ${className}`} style={style}>
      {icon ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="tech-logo" data-logo="svg">
          <path d={icon.path} fill="currentColor" />
        </svg>
      ) : (
        <span className="tech-mono" aria-hidden="true">{monogram(name)}</span>
      )}
      <span>{name}</span>
    </span>
  )
}
