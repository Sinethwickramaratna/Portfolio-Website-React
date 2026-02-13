import logo from '../../assets/Logos/light-logo.png';
import './NavBar.css';
import { useState } from 'react';

function NavBar(){
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return(
    <>
      <nav className="glass-navbar">
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
            <li className="nav-item" onClick={() => scrollToSection('hero')}>Home</li>
            <li className="nav-item" onClick={() => scrollToSection('about')}>About</li>
            <li className="nav-item" onClick={() => scrollToSection('skills')}>Skills</li>
            <li className="nav-item" onClick={() => scrollToSection('projects')}>Projects</li>
            <li className="nav-item" onClick={() => scrollToSection('volunteering')}>Volunteering</li>
            <li className="nav-item" onClick={() => scrollToSection('design-gallery')}>Design Gallery</li>
            <li className="nav-item" onClick={() => scrollToSection('contact')}>Contact</li>
          </ul>
        </div>
      </nav>
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
}

export default NavBar;