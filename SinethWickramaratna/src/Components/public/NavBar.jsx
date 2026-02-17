import logo from '../../assets/Logos/light-logo.png';
import './NavBar.css';
import { useState, useEffect } from 'react';

function NavBar(){
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  // Section IDs and their corresponding nav items
  const sections = ['hero', 'about', 'skills', 'projects', 'volunteering','blog', 'design-gallery', 'contact'];

  // Track which section is in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
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

    // Observe all sections
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when at the top
      if (currentScrollY < 50) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return(
    <>
      <nav className={`glass-navbar ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="navbar-logo" onClick={() => scrollToSection('hero')}>
          <img src={logo} alt="Logo" width="120px"/>
        </div>
        <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className={`nav-item ${activeSection === 'hero' ? 'active' : ''}`} onClick={() => scrollToSection('hero')}>Home</li>
            <li className={`nav-item ${activeSection === 'about' ? 'active' : ''}`} onClick={() => scrollToSection('about')}>About</li>
            <li className={`nav-item ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => scrollToSection('skills')}>Skills</li>
            <li className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} onClick={() => scrollToSection('projects')}>Projects</li>
            <li className={`nav-item ${activeSection === 'volunteering' ? 'active' : ''}`} onClick={() => scrollToSection('volunteering')}>Volunteering</li>
            <li className={`nav-item ${activeSection === 'blog' ? 'active' : ''}`} onClick={() => scrollToSection('blog')}>Blog</li>
            <li className={`nav-item ${activeSection === 'design-gallery' ? 'active' : ''}`} onClick={() => scrollToSection('design-gallery')}>Design Gallery</li>
            <li className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => scrollToSection('contact')}>Contact</li>
          </ul>
        </div>
      </nav>
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
}

export default NavBar;