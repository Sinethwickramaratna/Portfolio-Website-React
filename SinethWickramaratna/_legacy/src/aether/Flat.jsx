import './aether.css';
import {
  PROFILE_META,
  SKILL_NODES,
  PROJECTS,
  JOURNEY,
  RESEARCH_PILLARS,
  RESEARCH_FIELDS,
  EXHIBITION,
  DOCTRINE,
  AVAILABLE_FOR,
  LINKS,
  CV_URL,
  CERTIFICATES,
} from './config';
import portrait from '../assets/Images/profile.webp';

/**
 * The flat document.
 *
 * Served to anyone without WebGL, and to anyone who has asked their
 * system for reduced motion. It is not a stripped apology — it keeps
 * the same typographic voice, the same asymmetry and the same content,
 * and simply stops moving. Someone who prefers a still page should get
 * a good still page, not a warning that they are missing something.
 */
export default function Flat({ reason }) {
  return (
    <div className="ae ae-flat">
      <header className="af-hero">
        <span className="ae-mono ae-dim">SYSTEM / 01 · DIGITAL PORTFOLIO · 2026</span>
        <h1 className="af-name">
          SINETH<em>WICKRAMARATNA</em>
        </h1>
        <p className="af-statement">
          BUILDING INTELLIGENCE.
          <br />
          DESIGNING POSSIBILITY.
        </p>
        <p className="ae-mono ae-dim af-roles">
          DATA SCIENCE ENGINEER · AI / MACHINE LEARNING · CREATIVE TECHNOLOGY
        </p>
        <p className="ae-mono ae-dim af-note">
          {reason === 'motion'
            ? 'REDUCED MOTION — STILL EDITION'
            : 'NO WEBGL — STILL EDITION'}
        </p>
      </header>

      <section className="af-sec">
        <h2 className="af-h2">I turn data into intelligence.</h2>
        <p className="af-body">
          A model is only the middle of the work. The beginning is a question
          worth asking, and the end is something a person can actually use.
        </p>
      </section>

      <section className="af-sec">
        <span className="ae-mono ae-accent">01 / PROFILE</span>
        <img className="af-portrait" src={portrait} alt="Sineth Wickramaratna" />
        <p className="af-body">
          I am a Computer Science &amp; Engineering undergraduate specialising in
          Data Science Engineering — interested in building intelligent systems,
          exploring machine learning, and turning technical ideas into
          experiences that mean something to the person on the other side of the
          screen.
        </p>
        <dl className="af-meta">
          {PROFILE_META.map(([k, v]) => (
            <div key={k}>
              <dt className="ae-mono ae-dim">{k}</dt>
              <dd className="ae-mono">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="af-sec">
        <span className="ae-mono ae-accent">— / NEURAL MAP</span>
        <ul className="af-list">
          {SKILL_NODES.map((s) => (
            <li key={s.name}>
              <b className="ae-mono">{s.name}</b>
              <span>{s.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="af-sec">
        <span className="ae-mono ae-accent">02 / SELECTED WORK</span>
        {PROJECTS.map((p) => (
          <article className="af-project" key={p.n}>
            <h3 className="af-h3">
              <span className="ae-mono ae-dim">PROJECT {p.n}</span>
              {p.lines.join(' ')}
            </h3>
            <p className="af-body">{p.blurb}</p>
            <p className="ae-mono ae-dim">
              {p.year} · {p.category} · {p.stack.join(' · ')}
            </p>
            {(p.live || p.repo) && (
              <p className="af-links">
                {p.live && (
                  <a className="ae-mono" href={p.live} target="_blank" rel="noreferrer">
                    LIVE
                  </a>
                )}
                {p.repo && (
                  <a className="ae-mono" href={p.repo} target="_blank" rel="noreferrer">
                    SOURCE
                  </a>
                )}
              </p>
            )}
          </article>
        ))}
      </section>

      <section className="af-sec">
        <span className="ae-mono ae-accent">03 / JOURNEY</span>
        <ul className="af-list">
          {JOURNEY.map((j) => (
            <li key={j.key}>
              <b className="ae-mono">
                {j.year} — {j.title}
              </b>
              <span>{j.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="af-sec">
        <span className="ae-mono ae-accent">04 / RESEARCH LAB</span>
        <ul className="af-list">
          {RESEARCH_PILLARS.map((p) => (
            <li key={p.key}>
              <b className="ae-mono">
                {p.head} — {p.stat} <em className="ae-dim">{p.statNote}</em>
              </b>
              <span>{p.body}</span>
            </li>
          ))}
        </ul>
        <p className="ae-mono ae-dim">{RESEARCH_FIELDS.join(' · ')}</p>
      </section>

      <section className="af-sec">
        <span className="ae-mono ae-accent">05 / CREDENTIALS</span>
        <ul className="af-list">
          {CERTIFICATES.map((c) => (
            <li key={c.title}>
              <b className="ae-mono">
                {c.date} — {c.title}
              </b>
              <span>
                {c.issuer} · {c.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="af-sec">
        <span className="ae-mono ae-accent">06 / CREATIVE ENGINE</span>
        <ul className="af-gallery">
          {EXHIBITION.map((e) => (
            <li key={e.title}>
              <img src={e.src} alt={e.title} loading="lazy" />
              <b className="ae-mono">{e.title}</b>
              <span className="ae-mono ae-dim">{e.kind}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="af-sec">
        <ul className="af-doctrine">
          {DOCTRINE.map((d) => (
            <li key={d.word}>
              <b>{d.word}</b>
              <span className="ae-mono ae-dim">{d.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="af-sec">
        <span className="ae-mono ae-accent">07 / CONNECTION</span>
        <h2 className="af-h2">Let&rsquo;s build what&rsquo;s next.</h2>
        <p className="ae-mono ae-dim">AVAILABLE FOR · {AVAILABLE_FOR.join(' · ')}</p>
        <ul className="af-list">
          {LINKS.map((l) => (
            <li key={l.key}>
              <a className="ae-mono" href={l.href} target="_blank" rel="noreferrer">
                {l.key} — {l.value}
              </a>
            </li>
          ))}
          {CV_URL && (
            <li>
              <a className="ae-mono" href={CV_URL} target="_blank" rel="noreferrer">
                CV — Download résumé
              </a>
            </li>
          )}
        </ul>
      </section>

      <footer className="af-foot">
        <span className="ae-mono">SINETH WICKRAMARATNA</span>
        <span className="ae-mono ae-dim">DATA SCIENCE ENGINEER · 2026</span>
      </footer>
    </div>
  );
}
