import './AboutSection.css';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import StatItem from './AboutComponents/StatItem';
import profileImage from '../assets/Images/profile.png';

function AboutSection() {
  const [aboutRef, isAboutInView] = useInView();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="about-section" id="about" ref={aboutRef}>
      <div className="about-container">
        <div className={`about-header ${isAboutInView ? 'loaded' : ''}`}>
          <h2 className="about-title">About Me</h2>
          <div className="about-accent"></div>
        </div>

        <div className={`about-content ${isAboutInView ? 'loaded' : ''}`}>
          <div className="about-text">
            <p>
              I am currently pursuing a degree in Computer Science & Engineering at the University of Moratuwa, specializing in Data Science Engineering. My academic interests center around data analytics, machine learning, statistical modeling, and building data-driven systems that solve real-world problems. I am passionate about transforming complex datasets into meaningful insights and developing intelligent solutions that create measurable impact. Through my studies, I have built a strong foundation in programming, analytical thinking, and computational problem-solving.
            </p>
            
            {isExpanded && (
              <>
                <p>
                  Beyond academics, I actively contribute to leadership and community initiatives as the Public Relations Director of the Rotaract Club of University of Moratuwa. In this role, I oversee strategic communications, branding, and outreach activities, ensuring consistent and professional engagement with stakeholders. This experience has strengthened my leadership, teamwork, and organizational skills while enhancing my ability to communicate ideas effectively and manage responsibilities in dynamic environments.
                </p>
                <p>
                  In addition to my technical and leadership experience, I work as a graphic designer, combining creativity with structured thinking to deliver visually compelling and purposeful designs. My interest in design complements my work in data science, particularly in areas such as data visualization and digital communication. I am committed to continuous learning and professional growth, with the goal of contributing to innovative, ethical, and impactful solutions in the field of Data Science.
                </p>
              </>
            )}

            <button 
              className="read-more-btn" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          </div>

          <div className="about-image">
            <div className="image-frame">
              <img src={profileImage} alt="Sineth Wickramaratna" className="profile-image" />
            </div>
          </div>
        </div>

        <div className="about-stats">
          <StatItem number="0+" label="Projects" delay={0.3} />
          <StatItem number="20+" label="Technologies" delay={0.4} />
          <StatItem number="100%" label="Dedication" delay={0.5} />
        </div>

      </div>
    </section>
  );
}

export default AboutSection;
