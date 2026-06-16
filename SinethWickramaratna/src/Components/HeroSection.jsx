import './HeroSection.css';
import LoadingPage from './LoadingPage.jsx';
import CyberSamuraiImage from './CyberSamuraiImage.jsx';
import AtmosphericBackground from './AtmosphericBackground.jsx';
import { useState, useEffect } from 'react';
import projectsDataRaw from '../data/projectsData.json';
import certificatesDataRaw from '../data/certificatesData.json';

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [revealState, setRevealState] = useState('idle'); // idle, scanning, pulse, separating, glitching, revealed
  const [colomboTime, setColomboTime] = useState('');
  const [activeTheme, setActiveTheme] = useState('MODE: SHADOW SHOGUN');

  // Load boot sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2100);
    return () => clearTimeout(timer);
  }, []);

  // Live ticking clock in Sri Lanka time (GMT+5:30)
  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setColomboTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track active theme
  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setActiveTheme(currentTheme === 'light' ? 'MODE: IMPERIAL STUDIO' : 'MODE: SHADOW SHOGUN');
    };
    checkTheme();
    const observer = new MutationObserver(() => checkTheme());
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleContactClick = () => {
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerIdentify = () => {
    if (revealState === 'idle' || revealState === 'revealed') {
      setRevealState('scanning');
    }
  };

  const projectCount = projectsDataRaw.projects ? projectsDataRaw.projects.length : 0;
  const certsCount = certificatesDataRaw ? certificatesDataRaw.length : 0;

  return (
    <>
      {!isLoaded && <LoadingPage />}
      <section className="hero-section" id="hero">
        
        {/* Layer 1-4 Background Video Stack */}
        <AtmosphericBackground type="hero" />

        {/* Ambient Fog Overlay */}
        <div className="hero-fog-overlay"></div>
        {/* Cyber Grid Overlay */}
        <div className="hero-grid-overlay"></div>

        {/* Centerpiece Image background layer */}
        {isLoaded && (
          <CyberSamuraiImage 
            revealState={revealState} 
            setRevealState={setRevealState} 
          />
        )}

        <div className="hero-command-center">
          
          {/* COLUMN 1: Empty middle column for the background centerpiece */}
          <div className="hero-samurai-col empty-centerpiece">
            {/* Left empty so background image shows through */}
          </div>

          {/* COLUMN 2: Live System Metrics HUD */}
          <div className="hero-hud-col left-hud">
            <div className="hud-panel shogun-card">
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>

              <span className="hud-panel-title">// CORE TELEMETRY //</span>
              
              <div className="hud-stats-grid">
                <div className="hud-stat-item">
                  <span className="hud-label">TIME_COLOMBO</span>
                  <span className="hud-val monospace-val">{colomboTime || '02:30:00 AM'}</span>
                </div>
                
                <div className="hud-stat-item">
                  <span className="hud-label">SYSTEM_MODE</span>
                  <span className="hud-val text-gradient font-display">{activeTheme}</span>
                </div>

                <div className="hud-stat-item">
                  <span className="hud-label">MISSIONS_LOADED</span>
                  <span className="hud-val monospace-val">{projectCount}</span>
                </div>

                <div className="hud-stat-item">
                  <span className="hud-label">HONORS_RECORDED</span>
                  <span className="hud-val monospace-val">{certsCount}</span>
                </div>

                <div className="hud-stat-item">
                  <span className="hud-label">YEARS_LEARNING</span>
                  <span className="hud-val monospace-val">2+ YEARS</span>
                </div>

                <div className="hud-stat-item">
                  <span className="hud-label">OS_UPTIME</span>
                  <span className="hud-val monospace-val text-gold">99.9%</span>
                </div>
              </div>

              {/* IDENTIFY CLI Button Trigger */}
              <div className="hud-action-wrapper">
                <button 
                  className={`btn-premium ${revealState === 'idle' ? 'btn-primary-glow' : 'btn-outline'} hud-identify-btn`}
                  onClick={triggerIdentify}
                  disabled={revealState !== 'idle' && revealState !== 'revealed'}
                >
                  {revealState === 'idle' ? '[ IDENTIFY ]' : `[ STATUS: ${revealState.toUpperCase()} ]`}
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Hero Content & Identity Verification */}
          <div className="hero-hud-col right-hud">
            
            {revealState === 'revealed' ? (
              /* Verified Identity HUD Display Overlay */
              <div className="hud-panel shogun-card identity-verified-panel">
                <div className="hud-corner top-left"></div>
                <div className="hud-corner top-right"></div>
                <div className="hud-corner bottom-left"></div>
                <div className="hud-corner bottom-right"></div>
                
                <div className="verified-scanner-lines"></div>

                <div className="verified-box">
                  <span className="verified-badge">✔ SECURITY_PASSED</span>
                  <h1 className="verified-title font-display text-gradient">IDENTITY VERIFIED</h1>
                  
                  <div className="verified-user-details">
                    <h2 className="verified-name font-display">SINETH WICKRAMARATNA</h2>
                    <ul className="verified-roles monospace-val">
                      <li>&gt; AI ENGINEER</li>
                      <li>&gt; DATA SCIENTIST</li>
                      <li>&gt; PROBLEM SOLVER</li>
                    </ul>
                  </div>
                  
                  <button className="btn-premium btn-primary-glow reset-bio-btn" onClick={() => setRevealState('idle')}>
                    DISMISS PROFILE
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Hero Bio Details */
              <div className="hud-panel shogun-card bio-panel">
                <div className="hud-corner top-left"></div>
                <div className="hud-corner top-right"></div>
                <div className="hud-corner bottom-left"></div>
                <div className="hud-corner bottom-right"></div>

                <span className="hud-panel-title">// IDENTITY PROFILE //</span>

                <h1 className="hero-title font-display">
                  SINETH <br />
                  <span className="text-gradient">WICKRAMARATNA</span>
                </h1>

                <p className="hero-description">
                  Computer Science & Engineering Student at University of Moratuwa specializing in Data Science. Transforming data arrays into intelligence.
                </p>

                <div className="hero-actions">
                  <button className="btn-premium btn-primary-glow hero-cta" onClick={handleContactClick}>
                    GET IN TOUCH
                  </button>
                  <a href="/CV.pdf" target="_blank" rel="noopener noreferrer" className="btn-premium btn-outline hero-cv">
                    DOWNLOAD CV
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}

export default HeroSection;