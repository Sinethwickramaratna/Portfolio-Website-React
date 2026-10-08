import Reveal from '../Reveal.jsx'
import { DOCTRINE } from '../../data/content.js'
import { STATS, STACK, titleCase } from '../../data/site.js'

export default function About() {
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
              <strong>University of Moratuwa</strong>, Sri Lanka. I am a <strong>software engineer</strong> who loves
              developing software, and a data science engineer who enjoys making it intelligent. I like
              turning technical ideas into experiences that mean something to the person on the other
              side of the screen.
            </p>
            <p>
              I like the whole loop, from framing the problem and designing the system to writing the backend, building the interface and shipping it for people to use. Sometimes that includes a machine learning model, like a fine tuned Gemma-3 triage pipeline or the on device AI that checks a ride's number plate in a women's safety app.
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
                <b>{STATS.repos}</b>
                <span>projects with public code on GitHub</span>
              </div>
              <div className="card fact">
                <b>{STATS.designs}</b>
                <span>design works featured, from posters to identities and campaigns</span>
              </div>
              <div className="card fact">
                <b>{STACK.length}</b>
                <span>technologies used across web, mobile, data and AI</span>
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
