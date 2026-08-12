import { useEffect, useRef } from 'react';
import projectsData from '../../data/projectsData.json';

const CHAPTERS = [
  { key: 'problem', label: 'THE PROBLEM' },
  { key: 'approach', label: 'THE APPROACH' },
  { key: 'system', label: 'THE SYSTEM' },
  { key: 'result', label: 'THE RESULT' },
];

/**
 * Cinematic project view.
 *
 * Opens over the world when a project in the orbit is selected. The
 * four chapters are the same four questions every engineering write-up
 * has to answer, drawn from the project record rather than a separate
 * copy deck — so adding a project to projectsData.json is enough to give
 * it a full case study.
 */
export default function ProjectDetail({ projectId, onClose }) {
  const panelRef = useRef(null);
  const project = projectsData.projects.find((p) => p.id === projectId);

  /* Escape closes; focus moves into the panel when it opens. */
  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;

  const index = projectsData.projects.findIndex((p) => p.id === projectId);

  const chapterContent = {
    problem: project.shortDescription,
    approach: project.description,
    system: project.technologies,
    result: project.features,
  };

  return (
    <div className="project-detail" role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="project-detail__scrim" onClick={onClose} />

      <article
        className="project-detail__panel"
        ref={panelRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="project-detail__close"
          onClick={onClose}
          aria-label="Close project"
        >
          ✕
        </button>

        <header className="project-detail__head">
          <span className="project-detail__code">
            PROJECT {String(index + 1).padStart(3, '0')}
          </span>
          <h2 className="project-detail__title">{project.title}</h2>
          <ul className="project-detail__meta">
            <li>{project.category?.toUpperCase()}</li>
            <li>{project.year}</li>
            <li>{(project.status || 'ACTIVE').toUpperCase()}</li>
          </ul>
        </header>

        <div className="project-detail__body">
          {CHAPTERS.map((chapter) => {
            const content = chapterContent[chapter.key];
            if (!content || (Array.isArray(content) && content.length === 0)) {
              return null;
            }

            return (
              <section key={chapter.key} className="chapter">
                <h3 className="chapter__label">{chapter.label}</h3>
                {Array.isArray(content) ? (
                  <ul className="chapter__list">
                    {content.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="chapter__text">{content}</p>
                )}
              </section>
            );
          })}
        </div>

        <footer className="project-detail__actions">
          {project.repoUrl && (
            <a
              className="project-detail__link"
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              SOURCE
            </a>
          )}
          {project.liveUrl && (
            <a
              className="project-detail__link project-detail__link--primary"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              LIVE
            </a>
          )}
        </footer>
      </article>
    </div>
  );
}
