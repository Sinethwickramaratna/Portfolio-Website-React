import './ProjectsSection.css';
import { useInView } from '../hooks/useInView';

function ProjectsSection() {
  const [projectsRef, isProjectsInView] = useInView();

  return (
    <section className="projects-section" id="projects" ref={projectsRef}>
      <div className="projects-container">
        <div className={`projects-header ${isProjectsInView ? 'loaded' : ''}`}>
          <h2 className="projects-title">Projects</h2>
          <div className="projects-accent"></div>
        </div>

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
      </div>
    </section>
  );
}

export default ProjectsSection;
