import './CertificatesSection.css';
import { useInView } from '../hooks/useInView';
import { useState, useMemo, useEffect } from 'react';

function CertificatesSection() {
  const [certificatesRef, isCertificatesInView] = useInView();
  const [showModal, setShowModal] = useState(false);
  const INITIAL_DISPLAY_COUNT = 3;

  // Prevent page scroll and hide navbar when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [showModal]);

  const certificatesData = [
    {
      id: 1,
      title: 'Certificate Name',
      issuer: 'Issuing Organization',
      date: { year: 2024, month: 'Dec' },
      description: 'Brief description of what this certificate represents',
      link: 'https://example.com/certificate',
      icon: '📜',
      image: 'https://via.placeholder.com/400x250/1a4d6d/00ccff?text=Certificate+1'
    },
    {
      id: 2,
      title: 'Another Certificate',
      issuer: 'Another Organization',
      date: { year: 2024, month: 'Nov' },
      description: 'Description of the certificate achievement',
      link: 'https://example.com/certificate',
      icon: '🏆',
      image: 'https://via.placeholder.com/400x250/1a4d6d/00ccff?text=Certificate+2'
    },
    {
      id: 3,
      title: 'Professional Certification',
      issuer: 'Professional Body',
      date: { year: 2024, month: 'Oct' },
      description: 'Professional development certification',
      link: 'https://example.com/certificate',
      icon: '🎓',
      image: 'https://via.placeholder.com/400x250/1a4d6d/00ccff?text=Certificate+3'
    },
    {
      id: 4,
      title: 'Advanced Skills Certificate',
      issuer: 'Tech Institute',
      date: { year: 2024, month: 'Sep' },
      description: 'Certificate for completing advanced technical training',
      link: 'https://example.com/certificate',
      icon: '⭐',
      image: 'https://via.placeholder.com/400x250/1a4d6d/00ccff?text=Certificate+4'
    },
    {
      id: 5,
      title: 'Leadership Excellence Award',
      issuer: 'Business School',
      date: { year: 2024, month: 'Aug' },
      description: 'Recognition for leadership and organizational skills',
      link: 'https://example.com/certificate',
      icon: '👑',
      image: 'https://via.placeholder.com/400x250/1a4d6d/00ccff?text=Certificate+5'
    }
  ];

  const getMonthNumber = (month) => {
    const months = {
      'JAN': 1, 'Jan': 1,
      'FEB': 2, 'Feb': 2,
      'MAR': 3, 'Mar': 3,
      'APR': 4, 'Apr': 4,
      'MAY': 5, 'May': 5,
      'JUN': 6, 'Jun': 6,
      'JUL': 7, 'Jul': 7,
      'AUG': 8, 'Aug': 8,
      'SEP': 9, 'Sep': 9,
      'OCT': 10, 'Oct': 10,
      'NOV': 11, 'Nov': 11,
      'DEC': 12, 'Dec': 12
    };
    return months[month] || 0;
  };

  const getDateValue = (dateObj) => {
    const year = typeof dateObj.year === 'number' ? dateObj.year : parseInt(dateObj.year) || 0;
    const month = dateObj.month ? getMonthNumber(dateObj.month) : 0;
    return year * 100 + month;
  };

  const sortedCertificatesData = useMemo(() => {
    return [...certificatesData].sort((a, b) => {
      const dateA = getDateValue(a.date);
      const dateB = getDateValue(b.date);
      return dateB - dateA;
    });
  }, []);

  const displayedData = sortedCertificatesData.slice(0, INITIAL_DISPLAY_COUNT);
  const allCertificatesForModal = sortedCertificatesData;

  return (
    <section className="certificates-section" id="certificates" ref={certificatesRef}>
      <div className="certificates-container">
        <div className={`certificates-header ${isCertificatesInView ? 'loaded' : ''}`}>
          <h2 className="certificates-title">Certificates & Achievements</h2>
          <div className="certificates-accent"></div>
        </div>

        <div className={`certificates-content ${isCertificatesInView ? 'loaded' : ''}`}>
          <div className="certificates-grid">
            {displayedData.map((cert, index) => (
              <div 
                key={cert.id} 
                className="certificate-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {cert.image && (
                  <div className="certificate-image-container">
                    <img src={cert.image} alt={cert.title} className="certificate-image" />
                  </div>
                )}
                <div className="certificate-content">
                  <h3 className="certificate-title">{cert.title}</h3>
                  <p className="certificate-issuer">{cert.issuer}</p>
                  <p className="certificate-date">
                    {cert.date.month} {cert.date.year}
                  </p>
                  <p className="certificate-description">{cert.description}</p>
                  {cert.link && (
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="certificate-link"
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="load-more-container">
            <button 
              className="load-more-btn" 
              onClick={() => setShowModal(true)}
            >
              <span className="btn-text">Load More Certificates</span>
              <span className="btn-icon">▼</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="certificates-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="certificates-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">More Certificates</h2>
              <div className="modal-accent"></div>
            </div>

            <div className="modal-body">
              <div className="certificates-grid modal-grid">
                {allCertificatesForModal.length > 0 ? (
                  allCertificatesForModal.map((cert, index) => (
                    <div 
                      key={cert.id} 
                      className="certificate-card modal-certificate-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {cert.image && (
                        <div className="certificate-image-container">
                          <img src={cert.image} alt={cert.title} className="certificate-image" />
                        </div>
                      )}
                      <div className="certificate-content">
                        <h3 className="certificate-title">{cert.title}</h3>
                        <p className="certificate-issuer">{cert.issuer}</p>
                        <p className="certificate-date">
                          {cert.date.month} {cert.date.year}
                        </p>
                        <p className="certificate-description">{cert.description}</p>
                        {cert.link && (
                          <a 
                            href={cert.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="certificate-link"
                          >
                            View Certificate →
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#88ccff' }}>No certificates</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CertificatesSection;
