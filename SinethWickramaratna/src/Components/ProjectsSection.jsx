import { useState } from 'react';
import './ProjectsSection.css';
import { useInView } from '../hooks/useInView';
import projectsData from '../data/projectsData.json';
import AtmosphericBackground from './AtmosphericBackground';

function ProjectsSection() {
  const [projectsRef, isProjectsInView] = useInView();

  // Sort projects by year (latest first)
  const sortedProjects = [...projectsData.projects].sort((a, b) => {
    return parseInt(b.year) - parseInt(a.year);
  });

  // Helper to resolve status colors matching requirements
  const getStatusStyle = (status) => {
    const s = (status || '').toUpperCase();
    if (s.includes('ACTIVE')) {
      return { color: '#b91717', border: '1px solid #b91717', background: 'rgba(185, 23, 23, 0.05)' };
    }
    if (s.includes('COMPLETED') || s.includes('COMPLETE')) {
      return { color: '#dbc40e', border: '1px solid #dbc40e', background: 'rgba(219, 196, 14, 0.05)' };
    }
    if (s.includes('DEPLOYED')) {
      return { color: '#9d9d9d', border: '1px solid #9d9d9d', background: 'rgba(157, 157, 157, 0.05)' };
    }
    if (s.includes('EXPERIMENTAL')) {
      return { 
        color: '#ff3b3b', 
        border: '1px solid #dbc40e', 
        background: 'linear-gradient(90deg, rgba(185,23,23,0.1), rgba(219,196,14,0.1))'
      };
    }
    // Fallback/RESEARCH
    return { color: '#9d9d9d', border: '1px solid rgba(157, 157, 157, 0.3)', background: 'rgba(157, 157, 157, 0.05)' };
  };

  return (
    <section className="projects-section" id="projects" ref={projectsRef}>
      {/* Background Holographic Tactical Grid */}
      <AtmosphericBackground type="archive" />

      <div className="spatial-container">
        
        {/* Section Header HUD */}
        <div className="section-header-hud">
          <span className="section-number-bg">004</span>
          <h2 className="section-title-hud font-display" data-kanji="戦">
            [004] <span className="text-gradient">MISSION ARCHIVE</span>
          </h2>
          <span className="section-telemetry-hud monospace-val">MISSION_DATABASE_LOADED</span>
        </div>

        {projectsData.projects.length > 0 ? (
          <div className={`projects-grid shoji-reveal ${isProjectsInView ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            {sortedProjects.map((project, index) => {
              const missionNumber = String(index + 1).padStart(2, '0');
              const statusStyle = getStatusStyle(project.status || 'Active');
              
              return (
                <div 
                  key={project.id} 
                  className="mission-dossier-card shogun-card"
                  style={{ animationDelay: `${(index * 0.1) + 0.2}s` }}
                  data-cursor="explore"
                >
                  <div className="hud-corner top-left"></div>
                  <div className="hud-corner top-right"></div>
                  <div className="hud-corner bottom-left"></div>
                  <div className="hud-corner bottom-right"></div>

                  {/* Header: MISSION CODE & STATUS */}
                  <div className="mission-card-header">
                    <span className="mission-code monospace-val">MISSION_{missionNumber}</span>
                    <span className="mission-status monospace-val" style={statusStyle}>
                      STATUS: {project.status ? project.status.toUpperCase() : 'ACTIVE'}
                    </span>
                  </div>

                  {/* Title & Objective Details */}
                  <div className="mission-card-body">
                    <h3 className="mission-title font-display">{project.title}</h3>
                    <div className="mission-objective-box">
                      <span className="objective-label monospace-val">// MISSION OBJECTIVE //</span>
                      <p className="mission-desc">{project.shortDescription || project.description}</p>
                    </div>
                  </div>

                  {/* Tech stack badge row */}
                  <div className="mission-tech-row">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span key={i} className="mission-tech-badge monospace-val">{tech}</span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="mission-tech-badge monospace-val">+{project.technologies.length - 4}</span>
                    )}
                  </div>

                  {/* Execution footer actions */}
                  <div className="mission-card-footer">
                    <span className="mission-year monospace-val">YEAR_{project.year}</span>
                    <div className="mission-actions-row">
                      {project.repoUrl && (
                        <a 
                          href={project.repoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-premium btn-outline mission-action-btn"
                        >
                          [ SOURCE ]
                        </a>
                      )}
                      <a 
                        href={project.repoUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-premium btn-primary-glow mission-action-btn"
                        onClick={(e) => {
                          if (!project.repoUrl) {
                            e.preventDefault();
                            alert('[ LOG: SYSTEM OFFLINE - STAGING DEPLOYMENT TERMINATED ]');
                          }
                        }}
                      >
                        [ DEPLOY ]
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
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
