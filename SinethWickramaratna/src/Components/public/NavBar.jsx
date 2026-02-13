import logo from '../../assets/Logos/light-logo.png';
import './NavBar.css';
import { useState } from 'react';

function NavBar(){
  const [menuOpen, setMenuOpen] = useState(false);

  return(
    <>
      <nav className="glass-navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" width="120px"/>
        </div>
        <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item" onClick={() => setMenuOpen(false)}>Home</li>
            <li className="nav-item" onClick={() => setMenuOpen(false)}>About</li>
            <li className="nav-item" onClick={() => setMenuOpen(false)}>Skills</li>
            <li className="nav-item" onClick={() => setMenuOpen(false)}>Projects</li>
            <li className="nav-item" onClick={() => setMenuOpen(false)}>Volunteering</li>
            <li className="nav-item" onClick={() => setMenuOpen(false)}>Design Gallery</li>
            <li className="nav-item" onClick={() => setMenuOpen(false)}>Contact</li>
          </ul>
        </div>
      </nav>
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
}

export default NavBar;