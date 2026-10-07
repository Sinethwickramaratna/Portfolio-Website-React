import Reveal from '../Reveal.jsx'
import { JOURNEY } from '../../data/content.js'

export default function Experience() {
  return (
    <section className="section" id="journey" style={{ paddingTop: 0 }}>
      <div className="container journey-grid">
        <Reveal className="section-head journey-head">
          <span className="eyebrow">Journey</span>
          <h2>
            Study, lead, <span className="mark">build</span>
          </h2>
          <p>Academics, leadership and design roles that shaped how I work with teams.</p>
        </Reveal>
        <div className="timeline">
          {JOURNEY.map((j, i) => (
            <Reveal key={j.title} className="card t-item" delay={i * 60}>
              <span className="yr">{j.year}</span>
              <h3>{j.title}</h3>
              <p>{j.detail}</p>
              {j.roles && (
                <ul className="t-roles">
                  {j.roles.map(([role, years], k) => (
                    <li key={role}>
                      <span>
                        {role}
                        {k === 0 && <em className="now">Current</em>}
                      </span>
                      <span className="chip">{years}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
