import './HeroSection.css';
import LoadingPage from './LoadingPage.jsx';
import { useState, useEffect } from 'react';

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Shortened loading time since we don't need to render massive desk animation
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleContactClick = () => {
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {!isLoaded && <LoadingPage />}
      <section className="hero-section" id="hero">
        {/* Animated Background Elements */}
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        
        <div className="hero-container">
          <div className={`hero-content ${isLoaded ? 'fade-in-up' : ''}`}>
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Available for new opportunities
            </div>
            
            <h1 className="hero-title">
              Hi, I'm Sineth <br />
              <span className="text-gradient">Wickramaratna</span>
            </h1>
            
            <p className="hero-description">
              Computer Science & Engineering Student at University of Moratuwa specializing in Data Science. I transform complex data into intelligent software solutions and stunning digital experiences.
            </p>
            
            <div className="hero-actions">
              <button className="btn-premium btn-primary-glow" onClick={handleContactClick}>
                Get In Touch
              </button>
              <a href="/CV.pdf" target="_blank" rel="noopener noreferrer" className="btn-premium btn-outline">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
                Download CV
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;