import Icon from '../Icons.jsx'
import portrait from '../../assets/Images/profile.webp'
import { LINKS, CV_URL, PROJECTS } from '../../data/content.js'
import { STATS } from '../../data/site.js'

const social = { GITHUB: 'github', LINKEDIN: 'linkedin', EMAIL: 'mail' }

export default function Hero() {
  const clario = PROJECTS[0]
  const headline = clario.facts.find(([k]) => /CATEGORY/.test(k))

  return (
    <header className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <p className="status">
            <i aria-hidden="true" /> Open to internships &amp; collaborations
          </p>
          <h1>
            Hi, I&rsquo;m Sineth. I turn data into <span className="mark">intelligent products</span>.
          </h1>
          <p className="hero-lead">
            Computer Science &amp; Engineering undergraduate at the University of Moratuwa, specialising in
            Data Science. I take machine learning from the notebook to a deployed, usable product and
            design the interface it ships in.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn--primary">
              View my work <Icon name="arrow" className="arrow" />
            </a>
            <a href="#contact" className="btn btn--ghost">
              Let&rsquo;s talk
            </a>
            {CV_URL && (
              <a href={CV_URL} className="btn btn--ghost" target="_blank" rel="noreferrer">
                <Icon name="download" /> Download CV
              </a>
            )}
          </div>
          <div className="hero-social">
            <span>Find me on</span>
            <span className="rule" aria-hidden="true" />
            {LINKS.map((l) => (
              <a
                key={l.key}
                className="icon-btn"
                href={l.href}
                target={l.key === 'EMAIL' ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={l.key === 'EMAIL' ? 'Email' : l.key === 'GITHUB' ? 'GitHub' : 'LinkedIn'}
              >
                <Icon name={social[l.key]} />
              </a>
            ))}
          </div>
        </div>

        <div className="portrait">
          <div className="portrait-frame">
            <img src={portrait} alt="Portrait of Sineth Wickramaratna" width="500" height="730" fetchPriority="high" />
          </div>
          <div className="float-chip float-chip--a">
            <strong>{headline[1]}</strong>
            <span>
              category accuracy
              <br />
              on Clario triage
            </span>
          </div>
          <div className="float-chip float-chip--b">
            <strong>{STATS.projects}</strong>
            <span>
              projects built
              <br />
              &amp; documented
            </span>
          </div>
          <div className="float-chip float-chip--c">
            <strong>{STATS.live}</strong>
            <span>apps live today</span>
          </div>
        </div>
      </div>
    </header>
  )
}
