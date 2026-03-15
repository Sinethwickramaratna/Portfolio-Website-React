import './AboutSection.css';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import StatItem from './AboutComponents/StatItem';
import profileImage from '../assets/Images/profile.png';
import projectsDataRaw from '../data/projectsData.json';

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
      <div className="about-container">
        <div className={`about-header ${isAboutInView ? 'fade-in-up' : ''}`}>
          <h2 className="section-title">
            About <span className="text-gradient">Me</span>
          </h2>
        </div>

        <div className={`about-content ${isAboutInView ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
          <div className="about-text">
            <p>
              I am currently pursuing a degree in Computer Science & Engineering at the University of Moratuwa, specializing in Data Science Engineering. My academic interests center around data analytics, machine learning, statistical modeling, and building data-driven systems that solve real-world problems. I am passionate about transforming complex datasets into meaningful insights and developing intelligent solutions that create measurable impact.
            </p>
            
            {isExpanded && (
              <>
                <p>
                  Beyond academics, I actively contribute to leadership and community initiatives as the Public Relations Director of the Rotaract Club of University of Moratuwa. In this role, I oversee strategic communications, branding, and outreach activities, ensuring consistent and professional engagement with stakeholders. This experience has strengthened my leadership, teamwork, and organizational skills.
                </p>
                <p>
                  In addition to my technical and leadership experience, I work as a graphic designer, combining creativity with structured thinking to deliver visually compelling designs. I am committed to continuous learning and professional growth, with the goal of contributing to innovative, ethical, and impactful solutions in the field of Data Science.
                </p>
              </>
            )}

            <button 
              className="btn-premium btn-outline about-read-more" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          </div>

          <div className="about-image-wrapper">
            <div className="image-frame glass-panel">
              <img 
                src={profileImage} 
                alt="Sineth Wickramaratna" 
                className="profile-image" 
                width="400" 
                height="550"
                loading="lazy"
              />
            </div>
            <div className="profile-description glass-panel">
              <h3>Data Science Engineer</h3>
              <p>CS Student • ML Enthusiast • Graphic Designer</p>
            </div>
          </div>
        </div>

        <div className={`about-stats ${isAboutInView ? 'fade-in-up' : ''}`} style={{ animationDelay: '0.4s' }}>
          <StatItem icon="🎯" number={getProjectsCount()} label="Projects" delay={0} />
          <StatItem icon="💻" number="20+" label="Technologies" delay={0.1} />
          <StatItem icon="⚡" number="100%" label="Dedication" delay={0.2} />
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
