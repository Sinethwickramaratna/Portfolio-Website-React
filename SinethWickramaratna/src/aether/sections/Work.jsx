import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal, useMagnetic } from '../ui/reveal';
import { PROJECTS } from '../config';

/**
 * 02 / SELECTED WORK.
 *
 * Four stations, one project each, each taking the full viewport. There
 * is no grid and there are no cards — the title is set at display size
 * and the 3D metaphor is given the middle of the screen. Metadata is
 * kept to four short lines in the margin, because the object is meant
 * to be the argument and the text only the caption.
 *
 * Layout alternates side each station so the run of four never settles
 * into a rhythm.
 */
export default function Work({ onOpen }) {
  return (
    <>
      {PROJECTS.map((p, i) => (
        <ProjectStation key={p.n} project={p} flip={i % 2 === 1} onOpen={onOpen} />
      ))}
    </>
  );
}

function ProjectStation({ project, flip, onOpen }) {
  const ref = useRef();
  const cta = useRef();
  useReveal(ref);
  useMagnetic(cta, 0.28);

  return (
    <Frame
      id={project.station}
      className={`ae-work${flip ? ' is-flipped' : ''}`}
    >
      <div className="ae-work-grid" ref={ref}>
        {project.n === '01' && (
          <div className="ae-sec-mark ae-sec-mark--work" data-fade>
            <span className="ae-mono ae-accent">02</span>
            <span className="ae-rule" />
            <span className="ae-mono">SELECTED WORK</span>
          </div>
        )}

        <span className="ae-work-number" aria-hidden="true">
          {project.n}
        </span>

        <div className="ae-work-head">
          <span className="ae-mono ae-dim ae-work-eyebrow" data-fade>
            PROJECT {project.n}
          </span>
          <Lines
            tag="h3"
            className="ae-display ae-fit ae-work-title"
            text={project.lines}
          />
        </div>

        <div className="ae-work-side">
          <p className="ae-work-blurb" data-fade>
            {project.blurb}
          </p>

          <dl className="ae-meta ae-meta--tight" data-fade>
            <div className="ae-meta-row">
              <dt className="ae-mono ae-dim">YEAR</dt>
              <dd className="ae-mono">{project.year}</dd>
            </div>
            <div className="ae-meta-row">
              <dt className="ae-mono ae-dim">CATEGORY</dt>
              <dd className="ae-mono">{project.category}</dd>
            </div>
            <div className="ae-meta-row ae-meta-row--wrap">
              <dt className="ae-mono ae-dim">STACK</dt>
              <dd className="ae-mono">{project.stack.join(' · ')}</dd>
            </div>
          </dl>

          <button
            type="button"
            ref={cta}
            className="ae-cta ae-cta--ghost"
            data-fade
            onClick={() => onOpen(project)}
          >
            <span className="ae-mono">OPEN CASE STUDY</span>
            <svg viewBox="0 0 24 12" aria-hidden="true">
              <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" />
            </svg>
          </button>
        </div>

        <span className="ae-vert ae-vert--work ae-mono ae-dim" data-fade>
          {project.name.toUpperCase()}
        </span>
      </div>
    </Frame>
  );
}
