import logo from '../../assets/Logos/light-logo.png';
import './NavBar.css';
import { useState, useEffect } from 'react';
import { useAmbientSynth } from '../../hooks/useAmbientSynth';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [easterEggActive, setEasterEggActive] = useState(false);
  
  // Ambient Sound hook
  const { isPlaying, toggleSound } = useAmbientSynth();

  // Section IDs mapping
  const sections = [
    'hero',
    'core-telemetry',
    'about',
    'skills',
    'projects',
    'volunteering',
    'certificates',
    'blog',
    'design-gallery',
    'contact'
  ];

  // Map IDs to OS menu readouts
  const labelMap = {
    'hero': 'HOME',
    'core-telemetry': 'STATUS',
    'about': 'IDENTITY',
    'skills': 'SKILLS',
    'projects': 'MISSIONS',
    'volunteering': 'DOSSIER',
    'certificates': 'HONORS',
    'blog': 'SCROLLS',
    'design-gallery': 'CREATIVE',
    'contact': 'TERMINAL'
  };

  // Keyboard Easter Egg Key Listener
  useEffect(() => {
    let keys = [];
    const handleKeyDown = (e) => {
      keys.push(e.key.toLowerCase());
      if (keys.length > 15) keys.shift();
      
      const typed = keys.join('');
      if (typed.includes('bushido') || typed.includes('samurai')) {
        // Trigger Easter Egg
        setEasterEggActive(true);
        window.dispatchEvent(new CustomEvent('BUSHIDO_ACTIVATED'));
        keys = []; // reset buffer
        
        // Disable after 3 seconds
        setTimeout(() => {
          setEasterEggActive(false);
        }, 3500);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tracking section in viewport
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  // Show/Hide Navbar on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`glass-navbar ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="navbar-logo" onClick={() => scrollToSection('hero')}>
          <img src={logo} alt="Shogun Logo" width="105px" />
        </div>

        <button 
          className={`hamburger ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle command menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {sections.map((sec) => (
              <li 
                key={sec}
                className={`nav-item monospace-val ${activeSection === sec ? 'active' : ''}`} 
                onClick={() => scrollToSection(sec)}
              >
                {labelMap[sec]}
              </li>
            ))}
            
            {/* Audio Toggle control inside Shogun bar */}
            <li 
              className={`nav-item sound-toggle-btn monospace-val ${isPlaying ? 'sound-active' : ''}`}
              onClick={toggleSound}
            >
              SOUND: {isPlaying ? 'ON' : 'OFF'}
            </li>
          </ul>
        </div>
      </nav>

      {/* Keyboard Easter Egg Alert Overlay */}
      {easterEggActive && (
        <div className="shogun-easter-egg-banner font-display">
          <span className="banner-glow-text">BUSHIDO PROTOCOL ACTIVATED</span>
          <span className="banner-sub monospace-val">// OVERLOAD_DETECTOR // CORES_BURST</span>
        </div>
      )}

      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
}

export default NavBar;