import Reveal from '../Reveal.jsx'
import Icon from '../Icons.jsx'
import TechLogo from '../TechLogo.jsx'
import { SKILL_GROUPS } from '../../data/site.js'

const PALETTE = ['#ff6d00', '#ff7900', '#ff8500', '#ff9100', '#ff9e00', '#240046', '#3c096c', '#5a189a', '#7b2cbf', '#9d4edd']
const SPAN = ['ml', 'data', 'web', 'design']

export default function Skills() {
  return (
    <section className="section" id="skills" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Skills</span>
          <h2>
            What I <span className="mark">build</span> with
          </h2>
          <p>A working toolkit across models, data, product engineering and design.</p>
        </Reveal>
        <div className="skills-bento">
          {SKILL_GROUPS.map((g, i) => (
            <Reveal key={g.title} className={`card skill-card skill-card--${SPAN[i]}`} delay={i * 80}>
              <div className="skill-top">
                <span className="ico">
                  <Icon name={g.icon} />
                </span>
                <span className="skill-index">0{i + 1}</span>
              </div>
              <h3>{g.title}</h3>
              <p className="skill-blurb">{g.blurb}</p>
              <div className="chip-row">
                {g.tags.map((t) => (
                  <span className="chip chip--accent" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              {g.tools.length > 0 && (
                <div className="tool-grid">
                  {g.tools.map((t) => (
                    <TechLogo key={t} name={t} />
                  ))}
                </div>
              )}
              {SPAN[i] === 'design' && (
                <div className="swatches" role="img" aria-label="The ten colour palette used across this site">
                  {PALETTE.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
