import Overlay from './Overlay';
import { SECTIONS } from '../worldConfig';
import { travelTo } from '../state/worldState';
import skillsData from '../../data/skillsData.json';
import projectsData from '../../data/projectsData.json';
import galleryImages from '../../data/galleryImages.json';
import contactData from '../../data/contactData.json';

const [VOID, DNA, CITY, ORBIT, MUSEUM, LAB, FLOW, PORTAL] = SECTIONS;

/* ---------------------------------------------------------------- 01 */

export function VoidOverlay({ active }) {
  return (
    <Overlay index={VOID.index} active={active} className="overlay--void">
      <ul className="void-lines">
        {VOID.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <button
        type="button"
        className="void-cue"
        onClick={() => travelTo(DNA.index)}
      >
        {VOID.cue}
        <span aria-hidden="true" className="void-cue__arrow">↓</span>
      </button>
    </Overlay>
  );
}

/* ---------------------------------------------------------------- 02 */

export function DnaOverlay({ active, selected, onSelect }) {
  const segment = DNA.segments.find((s) => s.key === selected);

  return (
    <Overlay index={DNA.index} active={active} align="left">
      <header className="env-head">
        <span className="env-kicker">{DNA.kicker}</span>
        <h2 className="env-title">{DNA.title}</h2>
      </header>

      {segment ? (
        <article className="detail-card">
          <div className="detail-card__head">
            <h3>{segment.name}</h3>
            <button
              type="button"
              className="detail-card__close"
              onClick={() => onSelect(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p>{segment.body}</p>
        </article>
      ) : (
        <p className="env-hint">Select a node on the helix.</p>
      )}
    </Overlay>
  );
}

/* ---------------------------------------------------------------- 03 */

export function CityOverlay({ active, selected, onSelect }) {
  const category = skillsData.skillCategories.find(
    (c) => c.category === selected
  );

  return (
    <Overlay index={CITY.index} active={active} align="left">
      <header className="env-head">
        <span className="env-kicker">{CITY.kicker}</span>
        <h2 className="env-title">{CITY.title}</h2>
      </header>

      {category ? (
        <article className="detail-card">
          <div className="detail-card__head">
            <h3>{category.category}</h3>
            <button
              type="button"
              className="detail-card__close"
              onClick={() => onSelect(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="skill-meter" aria-hidden="true">
            <span style={{ '--fill': Math.min(1, category.skills.length / 8) }} />
          </div>
          <ul className="skill-list">
            {category.skills.map((skill) => (
              <li key={skill.name}>{skill.name}</li>
            ))}
          </ul>
        </article>
      ) : (
        <p className="env-hint">
          Each tower is a discipline. Height is the number of tools in it.
          Select one.
        </p>
      )}
    </Overlay>
  );
}

/* ---------------------------------------------------------------- 04 */

export function OrbitOverlay({ active }) {
  return (
    <Overlay index={ORBIT.index} active={active} align="left">
      <header className="env-head">
        <span className="env-kicker">{ORBIT.kicker}</span>
        <h2 className="env-title">{ORBIT.title}</h2>
      </header>
      <p className="env-hint">
        {projectsData.projects.length} objects in orbit. Select one to travel
        to it.
      </p>
    </Overlay>
  );
}

/* ---------------------------------------------------------------- 05 */

export function MuseumOverlay({ active, selected }) {
  const piece = galleryImages.find((g) => g.id === selected);

  return (
    <Overlay index={MUSEUM.index} active={active} align="left">
      <header className="env-head">
        <span className="env-kicker">{MUSEUM.kicker}</span>
        <h2 className="env-title">{MUSEUM.title}</h2>
      </header>
      {piece ? (
        <article className="detail-card detail-card--slim">
          <h3>{piece.title}</h3>
          <p>{piece.subtitle}</p>
        </article>
      ) : (
        <p className="env-hint">Graphic design, branding and event work.</p>
      )}
    </Overlay>
  );
}

/* ---------------------------------------------------------------- 06 */

export function LabOverlay({ active }) {
  return (
    <Overlay index={LAB.index} active={active} align="left">
      <header className="env-head">
        <span className="env-kicker">{LAB.kicker}</span>
        <h2 className="env-title">{LAB.title}</h2>
      </header>

      <div className="experiment-grid">
        {LAB.experiments.map((exp) => (
          <article key={exp.code} className="experiment">
            <span className="experiment__code">{exp.code}</span>
            <h3 className="experiment__name">
              {exp.name.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>
            <dl className="experiment__rows">
              {exp.rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </Overlay>
  );
}

/* ---------------------------------------------------------------- 07 */

export function FlowOverlay({ active }) {
  return (
    <Overlay index={FLOW.index} active={active} align="left">
      <header className="env-head">
        <span className="env-kicker">{FLOW.kicker}</span>
        <h2 className="env-title">{FLOW.title}</h2>
      </header>
      <p className="env-hint">
        The river runs from 2023 to now, and brightens as it goes.
      </p>
    </Overlay>
  );
}

/* ---------------------------------------------------------------- 08 */

export function PortalOverlay({ active, open, onOpen }) {
  const email = contactData.contactInfo.find((c) => c.label === 'Email');
  const links = contactData.socialLinks.filter((s) =>
    ['LinkedIn', 'GitHub'].includes(s.name)
  );

  return (
    <Overlay index={PORTAL.index} active={active} className="overlay--portal">
      {!open ? (
        <>
          <h2 className="portal-title">
            {PORTAL.title.split('\n').map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <button type="button" className="portal-cta" onClick={onOpen}>
            {PORTAL.kicker}
          </button>
          <ul className="portal-links">
            {email && (
              <li>
                <a href={email.link}>EMAIL</a>
              </li>
            )}
            {links.map((l) => (
              <li key={l.name}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.name.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="portal-open">
          <button
            type="button"
            className="detail-card__close portal-open__close"
            onClick={() => onOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <h2 className="portal-open__title">CONNECT</h2>
          <dl className="portal-open__list">
            {contactData.contactInfo.map((c) => (
              <div key={c.label}>
                <dt>{c.label.toUpperCase()}</dt>
                <dd>
                  {c.link ? <a href={c.link}>{c.value}</a> : c.value}
                </dd>
              </div>
            ))}
          </dl>
          <ul className="portal-links">
            {contactData.socialLinks.map((l) => (
              <li key={l.name}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.name.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Overlay>
  );
}
