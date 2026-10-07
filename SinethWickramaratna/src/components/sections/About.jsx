import Reveal from '../Reveal.jsx'
import { DOCTRINE, PROJECTS } from '../../data/content.js'
import { STATS, titleCase } from '../../data/site.js'

const val = (p, re) => p.facts.find(([k]) => re.test(k))[1]

export default function About() {
  const clario = val(PROJECTS[0], /CATEGORY/)
  const rf = PROJECTS.find((p) => /Malnutrition/.test(p.name))
  const rfAcc = rf.facts.find(([k]) => /SCORES/.test(k))[1].split(' ')[0]

  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">About me</span>
          <h2>
            Know who&rsquo;s <span className="mark">behind</span> the models
          </h2>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-copy">
            <p>
              I&rsquo;m a <strong>Computer Science &amp; Engineering undergraduate</strong> at the{' '}
              <strong>University of Moratuwa</strong>, Sri Lanka, on the Data Science Engineering track,
              interested in building intelligent systems and turning technical ideas into
              experiences that mean something to the person on the other side of the screen.
            </p>
            <p>
              I like the whole loop, from framing the problem to training and evaluating the model to shipping it behind an API and an interface people can use. Think a fine tuned Gemma-3 triage pipeline or a Dockerised AI text detector published on Hugging Face.
            </p>
            <p>
              Away from notebooks I design and lead, with posters and identities for IEEE RAS and the
              Mathematics Society, co-chair of Hand in Hand &middot; Binara Padhura, and Public
              Relations Senior Director at Rotaract.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="facts">
              <div className="card fact">
                <b>{STATS.projects}</b>
                <span>projects built, from research to deployment</span>
              </div>
              <div className="card fact">
                <b>{clario}</b>
                <span>category accuracy, Clario triage (2,000 ticket held out set)</span>
              </div>
              <div className="card fact">
                <b>{rfAcc}</b>
                <span>Random Forest accuracy across 136 countries</span>
              </div>
              <div className="card fact">
                <b>{STATS.designs}</b>
                <span>design works featured, from posters to identities and campaigns</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="how">
          {DOCTRINE.map((d, i) => (
            <Reveal key={d.word} className="card how-item" delay={i * 70}>
              <i>0{i + 1}</i>
              <h3>{titleCase(d.word.replace('.', ''))}</h3>
              <p>{d.note.charAt(0).toUpperCase() + d.note.slice(1)}.</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
