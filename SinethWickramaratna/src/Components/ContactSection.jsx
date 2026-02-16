import './ContactSection.css';
import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import ContactInfoItem from './ContactComponents/ContactInfoItem';
import SocialLink from './ContactComponents/SocialLink';
import emailjs from '@emailjs/browser';
import contactData from '../data/contactData.json';
import linkedinIcon from '../assets/Images/Social Media/linkedin.svg';
import githubIcon from '../assets/Images/Social Media/github.svg';
import facebookIcon from '../assets/Images/Social Media/facebook.svg';
import instagramIcon from '../assets/Images/Social Media/instagram.svg';


function ContactSection() {
  const [contactRef, isContactInView] = useInView();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    emailjs.init("lHmVqdyVUxvrXg2sT"); 
  }, []);

  const socialIconMap = {
    'linkedin.svg': linkedinIcon,
    'github.svg': githubIcon,
    'facebook.svg': facebookIcon,
    'instagram.svg': instagramIcon
  };

  const contactInfo = contactData.contactInfo;
  const socialLinks = contactData.socialLinks.map((social) => {
    const iconSrc = socialIconMap[social.image];
    return {
      ...social,
      icon: iconSrc ? (
        <img src={iconSrc} alt={`${social.name} icon`} className="social-icon-img" />
      ) : social.icon
    };
  });

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

    setIsSubmitting(true);

    // Send email using EmailJS
    emailjs.send(
      "service_d3uezga",  
      "template_3skdkol",  
      {
        to_email: "sinethwickramaratna@gmail.com",
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message: formData.message,
        reply_to: formData.email
      }
    )
    .then(() => {
      setFormStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      setIsSubmitting(false);
      setTimeout(() => setFormStatus(''), 3000);
    })
    .catch((error) => {
      console.log('Email error:', error);
      setFormStatus('sending-error');
      setIsSubmitting(false);
      setTimeout(() => setFormStatus(''), 3000);
    });
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
                <ContactInfoItem key={index} info={info} index={index} />
              ))}
            </div>

            {/* Social Links */}
            <div className="social-links-container">
              <h3 className="section-subtitle">Follow Me</h3>
              <div className="social-links-grid">
                {socialLinks.map((social, index) => (
                  <SocialLink key={index} social={social} index={index} />
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

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                <span className="btn-text">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
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
              {formStatus === 'sending-error' && (
                <div className="form-message error">
                  ✗ Failed to send message. Please try again.
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
