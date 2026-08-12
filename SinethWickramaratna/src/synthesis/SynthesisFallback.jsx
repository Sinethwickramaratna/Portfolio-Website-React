import { SECTIONS } from './worldConfig';
import skillsData from '../data/skillsData.json';
import projectsData from '../data/projectsData.json';
import galleryImages from '../data/galleryImages.json';
import contactData from '../data/contactData.json';

const [VOID, DNA, CITY, ORBIT, MUSEUM, LAB, FLOW, PORTAL] = SECTIONS;

/**
 * The world, as a document.
 *
 * Shown when WebGL is unavailable or the visitor prefers reduced motion.
 * This is not a stub — it carries the same content in the same order, so
 * the site remains fully usable (and fully indexable) without a single
 * frame of animation. A 3D portfolio that is blank without WebGL is a
 * portfolio that is blank for a meaningful slice of its audience.
 */
export default function SynthesisFallback({ reason }) {
  return (
    <div className="synthesis-flat">
      <header className="flat-hero">
        <h1 className="flat-hero__name">{VOID.title}</h1>
        <ul className="flat-hero__lines">
          {VOID.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="flat-note">
          {reason === 'motion'
            ? 'Reduced-motion mode: the 3D flight is disabled.'
            : 'Your browser does not support WebGL, so the 3D world is disabled.'}
        </p>
      </header>

      <section className="flat-section" id="dna">
        <span className="flat-kicker">{DNA.kicker}</span>
        <h2>{DNA.title}</h2>
        <dl className="flat-dl">
          {DNA.segments.map((s) => (
            <div key={s.key}>
              <dt>{s.name}</dt>
              <dd>{s.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flat-section" id="skills">
        <span className="flat-kicker">{CITY.kicker}</span>
        <h2>{CITY.title}</h2>
        {skillsData.skillCategories.map((cat) => (
          <div key={cat.category} className="flat-group">
            <h3>{cat.category}</h3>
            <ul className="flat-tags">
              {cat.skills.map((s) => (
                <li key={s.name}>{s.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="flat-section" id="projects">
        <span className="flat-kicker">{ORBIT.kicker}</span>
        <h2>{ORBIT.title}</h2>
        {projectsData.projects.map((p) => (
          <article key={p.id} className="flat-project">
            <h3>{p.title}</h3>
            <p className="flat-meta">
              {p.category} · {p.year} · {p.status}
            </p>
            <p>{p.description}</p>
            <ul className="flat-tags">
              {p.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="flat-links">
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                  Source
                </a>
              )}
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live
                </a>
              )}
            </p>
          </article>
        ))}
      </section>

      <section className="flat-section" id="museum">
        <span className="flat-kicker">{MUSEUM.kicker}</span>
        <h2>{MUSEUM.title}</h2>
        <ul className="flat-gallery">
          {galleryImages.map((g) => (
            <li key={g.id}>
              <img src={g.image} alt={g.title} loading="lazy" />
              <span>{g.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flat-section" id="lab">
        <span className="flat-kicker">{LAB.kicker}</span>
        <h2>{LAB.title}</h2>
        {LAB.experiments.map((exp) => (
          <article key={exp.code} className="flat-group">
            <h3>{exp.name.replace('\n', ' ')}</h3>
            <dl className="flat-rows">
              {exp.rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>

      <section className="flat-section" id="flow">
        <span className="flat-kicker">{FLOW.kicker}</span>
        <h2>{FLOW.title}</h2>
        <ol className="flat-timeline">
          {FLOW.milestones.map((m, i) => (
            <li key={`${m.year}-${i}`}>
              <strong>{m.year}</strong> {m.name}
              <span>{m.note}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flat-section" id="contact">
        <span className="flat-kicker">{PORTAL.kicker}</span>
        <h2>{PORTAL.title.replace(/\n/g, ' ')}</h2>
        <dl className="flat-rows">
          {contactData.contactInfo.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>{c.link ? <a href={c.link}>{c.value}</a> : c.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="flat-tags">
          {contactData.socialLinks.map((l) => (
            <li key={l.name}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
