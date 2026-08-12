import { useEffect, useRef } from 'react';

/**
 * The case study.
 *
 * Opening a project does not navigate away — the world stays running
 * underneath, dimmed, and the study slides over it as a sheet of text.
 * Same typographic register as the rest of the site: display heading,
 * mono metadata, hairline rules, no panels.
 */
export default function CaseStudy({ project, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="ae-case"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} case study`}
      ref={ref}
      tabIndex={-1}
    >
      <button type="button" className="ae-case-scrim" onClick={onClose} aria-label="Close" />

      {/* data-lenis-prevent: this sheet scrolls on its own, and Lenis
          would otherwise swallow the wheel and drive the page behind. */}
      <article className="ae-case-sheet" data-lenis-prevent>
        <header className="ae-case-head">
          <span className="ae-mono ae-accent">PROJECT {project.n}</span>
          <button type="button" className="ae-case-close ae-mono" onClick={onClose}>
            CLOSE
            <i />
          </button>
        </header>

        <h2 className="ae-display ae-case-title">
          {project.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </h2>

        <p className="ae-case-lede">{project.blurb}</p>

        <div className="ae-case-body">
          {project.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <dl className="ae-case-facts">
          {project.facts.map(([k, v]) => (
            <div key={k}>
              <dt className="ae-mono ae-dim">{k}</dt>
              <dd className="ae-mono">{v}</dd>
            </div>
          ))}
          <div>
            <dt className="ae-mono ae-dim">STACK</dt>
            <dd className="ae-mono">{project.stack.join(' · ')}</dd>
          </div>
        </dl>

        {(project.repo || project.live) && (
          <nav className="ae-case-links">
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="ae-mono">
                VISIT LIVE
                <svg viewBox="0 0 24 12" aria-hidden="true">
                  <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" />
                </svg>
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className="ae-mono">
                SOURCE
                <svg viewBox="0 0 24 12" aria-hidden="true">
                  <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" />
                </svg>
              </a>
            )}
          </nav>
        )}
      </article>
    </div>
  );
}
