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
        <div className={`projects-header ${isProjectsInView ? 'fade-in-up' : ''}`}>
          <h2 className="section-title">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </div>

        {projectsData.projects.length > 0 ? (
          <div className={`projects-grid ${isProjectsInView ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            {sortedProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="project-card glass-panel"
                style={{ animationDelay: `${(index * 0.1) + 0.2}s` }}
              >
                <div className="project-content">
                  <div className="project-header">
                    <span className="project-category">{project.category}</span>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-short-desc">{project.shortDescription}</p>
                  </div>

                  <div className="project-tech">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span key={i} className="tech-badge">{tech}</span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="tech-badge">+{project.technologies.length - 4}</span>
                    )}
                  </div>
                </div>

                <div className="project-footer">
                  <span className="project-year">{project.year}</span>
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`coming-soon-container ${isProjectsInView ? 'fade-in-up' : ''}`}>
             <h3 className="section-title">Coming Soon</h3>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectsSection;
