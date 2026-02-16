import './Footer.css';
import { useState } from 'react';

function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      icon: '💼',
      url: 'https://linkedin.com/in/sineth-wickramaratna',
      color: '#0077B5'
    },
    { 
      name: 'GitHub', 
      icon: '💻',
      url: 'https://github.com',
      color: '#333333'
    },
    { 
      name: 'Facebook', 
      icon: '👤',
      url: 'https://facebook.com',
      color: '#1877F2'
    },
    { 
      name: 'Instagram', 
      icon: '📷',
      url: 'https://instagram.com',
      color: '#E4405F'
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3>Sineth Wickramaratna</h3>
            <p>Data Science | Machine Learning | Web Development</p>
            <div className="footer-divider"></div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <div className="links-grid">
              {quickLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="footer-link"
                  title={link.name}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-icons">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  title={social.name}
                  style={{
                    '--social-color': social.color
                  }}
                  onMouseEnter={() => setHoveredLink(social.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span className="social-icon-content">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-middle-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Sineth Wickramaratna. All rights reserved.</p>
          </div>
          <div className="footer-credits">
            <p>Crafted with <span className="heart">❤️</span> using React & Modern Web Technologies</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="footer-decoration"></div>
      </div>
    </footer>
  );
}

export default Footer;
