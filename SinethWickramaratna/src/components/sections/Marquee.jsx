import TechLogo from '../TechLogo.jsx'
import { STACK } from '../../data/site.js'

const half = Math.ceil(STACK.length / 2)
const ROWS = [STACK.slice(0, half), STACK.slice(half)]

export default function Marquee() {
  return (
    <section className="tech-strip" aria-label="Technologies I work with">
      <p className="tech-strip-label">Tools I build with</p>
      {ROWS.map((row, r) => (
        <div className={`marquee-row${r ? ' marquee-row--rev' : ''}`} key={r}>
          <div className="marquee-track">
            {[0, 1].map((copy) =>
              row.map((name) => (
                <TechLogo key={`${copy}-${name}`} name={name} />
              )),
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
