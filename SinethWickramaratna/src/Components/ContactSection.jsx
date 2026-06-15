import './ContactSection.css';
import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import ContactInfoItem from './ContactComponents/ContactInfoItem';
import SocialLink from './ContactComponents/SocialLink';
import emailjs from '@emailjs/browser';
import contactData from '../data/contactData.json';
import addressIcon from '../assets/Images/Icons/address-location.svg';
import emailIcon from '../assets/Images/Icons/email.svg';
import phoneIcon from '../assets/Images/Icons/phone-office.svg';
import linkedinIcon from '../assets/Images/Social Media/linkedin.svg';
import githubIcon from '../assets/Images/Social Media/github.svg';
import facebookIcon from '../assets/Images/Social Media/facebook.svg';
import instagramIcon from '../assets/Images/Social Media/instagram.svg';
import AtmosphericBackground from './AtmosphericBackground';

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

  const contactIconMap = {
    'address-location.svg': addressIcon,
    'email.svg': emailIcon,
    'phone-office.svg': phoneIcon
  };

  const contactInfo = contactData.contactInfo.map((info) => {
    const iconSrc = contactIconMap[info.icon];
    return {
      ...info,
      icon: iconSrc ? (
        <img src={iconSrc} alt={`${info.label} icon`} className="info-icon-img" />
      ) : info.icon
    };
  });
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
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus('invalid-email');
      setTimeout(() => setFormStatus(''), 3000);
      return;
    }

    setIsSubmitting(true);

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
      {/* Background Energy Reactor & Scanlines */}
      <AtmosphericBackground type="terminal" />

      <div className="spatial-container">
        
        {/* Section Header HUD */}
        <div className="section-header-hud">
          <span className="section-number-bg">009</span>
          <h2 className="section-title-hud font-display" data-kanji="信">
            [009] <span className="text-gradient">COMMUNICATION TERMINAL</span>
          </h2>
          <span className="section-telemetry-hud monospace-val">TERMINAL_LINK_ONLINE</span>
        </div>

        <div className={`contact-content shoji-reveal ${isContactInView ? 'loaded' : ''}`}>
          
          {/* Left Panel: Contact Information Card Hulls */}
          <div className="contact-info-section shogun-card">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>

            <h3 className="section-subtitle font-display">// TELEMETRY NODES //</h3>
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <ContactInfoItem key={index} info={info} index={index} />
              ))}
            </div>

            {/* Social Links Case */}
            <div className="social-links-container">
              <h3 className="section-subtitle font-display text-gold">// SECURE LINKAGE //</h3>
              <div className="social-links-grid">
                {socialLinks.map((social, index) => (
                  <SocialLink key={index} social={social} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: High-Tech Input Terminal Form */}
          <div className="contact-form-section shogun-card">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>

            <h3 className="section-subtitle font-display">// INITIATE COMM_LINK //</h3>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="font-display text-gold">&gt; FIRST_NAME</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="font-display text-gold">&gt; LAST_NAME</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="font-display text-gold">&gt; SENDER_EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="message" className="font-display text-gold">&gt; SECURE_TRANSMISSION</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Buffer transmission payload here..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-submit-row">
                <button type="submit" className="btn-premium btn-primary-glow submit-btn font-display" disabled={isSubmitting}>
                  {isSubmitting ? '[ TRANSMITTING... ]' : '[ EXECUTE TRANSMIT ]'}
                </button>
              </div>

              {/* Status alerts */}
              {formStatus === 'success' && (
                <div className="form-message success monospace-val">
                  ✔ SUCCESS: TRANSMISSION DELIVERED SUCCESSFULLY.
                </div>
              )}
              {formStatus === 'error' && (
                <div className="form-message error monospace-val">
                  ✘ FAILED: CORRUPT INPUT DATA. FILL ALL FIELDS.
                </div>
              )}
              {formStatus === 'invalid-email' && (
                <div className="form-message error monospace-val">
                  ✘ FAILED: INVALID EMAIL ROUTE.
                </div>
              )}
              {formStatus === 'sending-error' && (
                <div className="form-message error monospace-val">
                  ✘ FAILED: GATEWAY CONNECTION TIME_OUT.
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactSection;
