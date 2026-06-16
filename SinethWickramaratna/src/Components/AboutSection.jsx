import './AboutSection.css';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import profileImage from '../assets/Images/profile.png';
import projectsDataRaw from '../data/projectsData.json';
import AtmosphericBackground from './AtmosphericBackground';

function getProjectsCount() {
  if (projectsDataRaw.projects) return projectsDataRaw.projects.length;
  if (projectsDataRaw.default && projectsDataRaw.default.projects) return projectsDataRaw.default.projects.length;
  return 0;
}

function AboutSection() {
  const [aboutRef, isAboutInView] = useInView();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="about-section" id="about" ref={aboutRef}>
      {/* Background Neural Data Streams */}
      <AtmosphericBackground type="profile" />
      
      <div className="spatial-container">
        
        {/* Section Header HUD */}
        <div className="section-header-hud">
          <span className="section-number-bg">002</span>
          <h2 className="section-title-hud font-display" data-kanji="魂">
            [002] <span className="text-gradient">IDENTITY PROFILE</span>
          </h2>
          <span className="section-telemetry-hud monospace-val">PROFILE_VERIFICATION_PASS</span>
        </div>

        {/* HUD dashboard layout */}
        <div className="profile-dashboard-layout">
          
          {/* Left Side: Armored portrait card */}
          <div className={`profile-portrait-column shoji-reveal ${isAboutInView ? 'fade-in-up' : ''}`}>
            <div className="portrait-armor-frame shogun-card">
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>
              
              <div className="portrait-image-wrapper">
                <img 
                  src={profileImage} 
                  alt="Sineth Wickramaratna" 
                  className="profile-portrait-img" 
                  width="400" 
                  height="550"
                  loading="lazy"
                />
              </div>

              <div className="profile-tag-overlay monospace-val">
                <span className="tag-indicator"></span>
                RANK: INTERMEDIATE_DEVELOPER
              </div>
            </div>

            {/* Quick Profile readout panel */}
            <div className="profile-quick-readout shogun-card">
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>
              <h3 className="readout-role font-display">DATA SCIENCE ENGINEER</h3>
              <p className="monospace-val readout-sub">CS Student • ML Enthusiast • Graphic Designer</p>
            </div>
          </div>

          {/* Right Side: Detailed telemetry bio logs */}
          <div 
            className={`profile-details-column shoji-reveal ${isAboutInView ? 'fade-in-up' : ''}`}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="bio-dossier-panel shogun-card">
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>

              <div className="dossier-line-header">
                <span className="monospace-val">// PROFILE DOSSIER SUMMARY //</span>
                <span className="monospace-val text-gold">[READ_ONLY]</span>
              </div>

              <div className="dossier-text-body">
                <p>
                  I am currently pursuing a degree in Computer Science & Engineering at the University of Moratuwa, specializing in Data Science Engineering. My academic interests center around data analytics, machine learning, statistical modeling, and building data-driven systems that solve real-world problems. I am passionate about transforming complex datasets into meaningful insights and developing intelligent solutions that create measurable impact.
                </p>
                
                {isExpanded && (
                  <div className="dossier-expanded-content">
                    <p>
                      Beyond academics, I actively contribute to leadership and community initiatives as the Public Relations Director of the Rotaract Club of University of Moratuwa. In this role, I oversee strategic communications, branding, and outreach activities, ensuring consistent and professional engagement with stakeholders. This experience has strengthened my leadership, teamwork, and organizational skills.
                    </p>
                    <p>
                      In addition to my technical and leadership experience, I work as a graphic designer, combining creativity with structured thinking to deliver visually compelling designs. I am committed to continuous learning and professional growth, with the goal of contributing to innovative, ethical, and impactful solutions in the field of Data Science.
                    </p>
                  </div>
                )}

                <div className="action-button-row">
                  <button 
                    className="btn-premium btn-outline profile-expand-btn" 
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? '[ DEACTIVATE DETAILED BIO ]' : '[ ACTIVATE DETAILED BIO ]'}
                  </button>
                </div>
              </div>
            </div>

            {/* Tactical stats layout */}
            <div className="tactical-stats-row">
              <div className="tactical-stat-box shogun-card">
                <div className="hud-corner top-left"></div>
                <div className="hud-corner top-right"></div>
                <div className="hud-corner bottom-left"></div>
                <div className="hud-corner bottom-right"></div>
                <span className="tactical-stat-val monospace-val">{getProjectsCount()}</span>
                <span className="tactical-stat-label font-display">ACTIVE_MISSIONS</span>
              </div>

              <div className="tactical-stat-box shogun-card">
                <div className="hud-corner top-left"></div>
                <div className="hud-corner top-right"></div>
                <div className="hud-corner bottom-left"></div>
                <div className="hud-corner bottom-right"></div>
                <span className="tactical-stat-val monospace-val">20+</span>
                <span className="tactical-stat-label font-display">TECHNOLOGIES</span>
              </div>

              <div className="tactical-stat-box shogun-card">
                <div className="hud-corner top-left"></div>
                <div className="hud-corner top-right"></div>
                <div className="hud-corner bottom-left"></div>
                <div className="hud-corner bottom-right"></div>
                <span className="tactical-stat-val monospace-val text-gold">100%</span>
                <span className="tactical-stat-label font-display">FOCUS_RATING</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;
