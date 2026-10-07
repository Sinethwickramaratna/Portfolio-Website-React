import { Link } from 'react-router-dom'
import Reveal from '../Reveal.jsx'
import Icon from '../Icons.jsx'
import { RESEARCH_PILLARS, RESEARCH_FIELDS } from '../../data/content.js'
import { titleCase } from '../../data/site.js'

export default function Research() {
  return (
    <section className="section research" id="research">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Research</span>
          <h2>
            Sensor driven <span className="mark">machine learning</span>
          </h2>
          <p>
            Classifying cattle behaviour from collar mounted IoT accelerometer streams, from sliding
            windows to feature engineering to a tuned SVM.
          </p>
        </Reveal>
        <div className="research-grid">
          {RESEARCH_PILLARS.map((r, i) => (
            <Reveal key={r.head} className="stat-card" delay={i * 80}>
              <span className="k">{r.head}</span>
              <b>{r.stat}</b>
              <span className="sub">{r.statNote}</span>
              <p>{r.body}</p>
            </Reveal>
          ))}
        </div>
        <div className="research-foot">
          <div className="chip-row">
            {RESEARCH_FIELDS.map((f) => (
              <span className="chip" key={f}>
                {titleCase(f)}
              </span>
            ))}
          </div>
          <Link to="/blog/cattle-behavior-iot-ml" className="btn btn--primary">
            Read the write up <Icon name="arrow" className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  )
}
