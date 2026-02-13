import './ContactSection.css';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';

function ContactSection() {
  const [contactRef, isContactInView] = useInView({ once: true });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  const contactInfo = [
    {
      icon: '📍',
      label: 'Address',
      value: 'Colombo, Sri Lanka',
      color: '#00ff88'
    },
    {
      icon: '✉️',
      label: 'Email',
      value: 'sineth@example.com',
      link: 'mailto:sineth@example.com',
      color: '#00ccff'
    },
    {
      icon: '📱',
      label: 'Phone',
      value: '+94 123 456 7890',
      link: 'tel:+94123456789',
      color: '#ff00ff'
    }
  ];

  const socialLinks = [
    {
      icon: '💼',
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yourprofile',
      color: '#0077B5'
    },
    {
      icon: '👨‍💻',
      name: 'GitHub',
      url: 'https://github.com/yourprofile',
      color: '#333333'
    },
    {
      icon: '📘',
      name: 'Facebook',
      url: 'https://facebook.com/yourprofile',
      color: '#1877F2'
    },
    {
      icon: '📷',
      name: 'Instagram',
      url: 'https://instagram.com/yourprofile',
      color: '#E4405F'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus('invalid-email');
      setTimeout(() => setFormStatus(''), 3000);
      return;
    }

    // Here you would typically send the form data to a backend
    console.log('Form submitted:', formData);
    
    setFormStatus('success');
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    setTimeout(() => setFormStatus(''), 3000);
  };

  return (
    <section className="contact-section" id="contact" ref={contactRef}>
      <div className="contact-container">
        <div className={`contact-header ${isContactInView ? 'loaded' : ''}`}>
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">Let's connect and collaborate</p>
          <p className="contact-description">
            I'm always interested in hearing about new projects and opportunities. Whether you have questions, ideas, or just want to say hello, feel free to reach out! I'll get back to you as soon as possible.
          </p>
          <div className="contact-accent"></div>
        </div>

        <div className={`contact-content ${isContactInView ? 'loaded' : ''}`}>
          {/* Contact Information */}
          <div className="contact-info-section">
            <h3 className="section-subtitle">Contact Information</h3>
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="info-icon" style={{ '--icon-color': info.color }}>
                    {info.icon}
                  </div>
                  <div className="info-content">
                    <p className="info-label">{info.label}</p>
                    {info.link ? (
                      <a href={info.link} className="info-value">
                        {info.value}
                      </a>
                    ) : (
                      <p className="info-value">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="social-links-container">
              <h3 className="section-subtitle">Follow Me</h3>
              <div className="social-links-grid">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    title={social.name}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="social-icon" style={{ '--social-color': social.color }}>
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h3 className="section-subtitle">Send Me a Message</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message here..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <span className="btn-text">Send Message</span>
                <span className="btn-icon">→</span>
              </button>

              {formStatus === 'success' && (
                <div className="form-message success">
                  ✓ Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {formStatus === 'error' && (
                <div className="form-message error">
                  ✗ Please fill in all fields correctly.
                </div>
              )}
              {formStatus === 'invalid-email' && (
                <div className="form-message error">
                  ✗ Please enter a valid email address.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="contact-decoration"></div>
    </section>
  );
}

export default ContactSection;
