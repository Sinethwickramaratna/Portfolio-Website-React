import { useState } from 'react';
import './ProjectsSection.css';
import { useInView } from '../hooks/useInView';
import projectsData from '../data/projectsData.json';

function ProjectsSection() {
  const [projectsRef, isProjectsInView] = useInView();

  // Sort projects by year (latest first)
  const sortedProjects = [...projectsData.projects].sort((a, b) => {
    return parseInt(b.year) - parseInt(a.year);
  });

  return (
    <section className="projects-section" id="projects" ref={projectsRef}>
      <div className="projects-container">
        <div className={`projects-header ${isProjectsInView ? 'loaded' : ''}`}>
          <h2 className="projects-title">Projects</h2>
          <div className="projects-accent"></div>
        </div>

        {projectsData.projects.length > 0 ? (
          <div className={`projects-grid ${isProjectsInView ? 'loaded' : ''}`}>
            {sortedProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="project-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-header">
                  <div className="project-header-top">
                    <h3 className="project-title">{project.title}</h3>
                    <span className="project-category">{project.category}</span>
                  </div>
                  <p className="project-short-desc">{project.shortDescription}</p>
                </div>

                <div className="project-body">
                  <div className="project-technologies">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  {project.features && project.features.length > 0 && (
                    <div className="project-highlights">
                      <ul className="highlights-list">
                        {project.features.slice(0, 2).map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="project-footer">
                  <div className="project-meta">
                    <span className="project-year">{project.year}</span>
                    <span className="project-status">{project.status}</span>
                  </div>
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="github-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`coming-soon-container ${isProjectsInView ? 'loaded' : ''}`}>
            <div className="coming-soon-content">
              <div className="coming-soon-icon">🚀</div>
              <h3 className="coming-soon-text">
                <span className="text-letter">C</span>
                <span className="text-letter">o</span>
                <span className="text-letter">m</span>
                <span className="text-letter">i</span>
                <span className="text-letter">n</span>
                <span className="text-letter">g</span>
                <span className="text-letter space"> </span>
                <span className="text-letter">S</span>
                <span className="text-letter">o</span>
                <span className="text-letter">o</span>
                <span className="text-letter">n</span>
              </h3>
              <p className="coming-soon-subtitle">Amazing projects are being crafted...</p>
              
              <div className="animated-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>

              <div className="tech-preview">
                <p className="preview-label">Coming soon with:</p>
                <div className="tech-badges">
                  <span className="tech-badge">Machine Learning</span>
                  <span className="tech-badge">Data Analysis</span>
                  <span className="tech-badge">Web Apps</span>
                  <span className="tech-badge">Visualizations</span>
                </div>
              </div>
            </div>

            <div className="floating-elements">
              <div className="float-item">📊</div>
              <div className="float-item">💻</div>
              <div className="float-item">🎯</div>
              <div className="float-item">⚡</div>
              <div className="float-item">🔬</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectsSection;
