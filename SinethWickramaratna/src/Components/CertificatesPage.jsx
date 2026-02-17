import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CertificatesPage.css';
import Footer from './public/Footer';
import robofest2025 from '../assets/Certificates/RoboFest.jpg';
import kaggleML from '../assets/Certificates/Sineth Wickramaratna - Intro to Machine Learning.png';
import kagglePandas from '../assets/Certificates/Sineth Wickramaratna - Pandas.png';
import kaggleDataCleaning from '../assets/Certificates/Sineth Wickramaratna - Data Cleaning.png';
import kaggleFeatureEngineering from '../assets/Certificates/Sineth Wickramaratna - Feature Engineering.png';
import rotaractMembership from '../assets/Certificates/Rotaract Active Membership.jpg';
import rotaracrDirectorsAppreciation from '../assets/Certificates/Board of Directors.jpg';
import certificatesDataRaw from '../data/certificatesData.json';

function CertificatesPage() {
  const navigate = useNavigate();
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Map image filenames to imported images
  const imageMap = {
    'RoboFest.jpg': robofest2025,
    'Sineth Wickramaratna - Intro to Machine Learning.png': kaggleML,
    'Sineth Wickramaratna - Pandas.png': kagglePandas,
    'Sineth Wickramaratna - Data Cleaning.png': kaggleDataCleaning,
    'Sineth Wickramaratna - Feature Engineering.png': kaggleFeatureEngineering,
    'Rotaract Active Membership.jpg': rotaractMembership,
    'Board of Directors.jpg': rotaracrDirectorsAppreciation
  };

  // Map JSON data to include actual image imports
  const certificatesData = certificatesDataRaw.map(cert => ({
    ...cert,
    image: imageMap[cert.image] || null
  }));

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

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

  const sortedCertificates = useMemo(() => {
    return [...certificatesData].sort((a, b) => {
      const dateA = getDateValue(a.date);
      const dateB = getDateValue(b.date);
      return dateB - dateA;
    });
  }, []);

  const openLightbox = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const closeLightbox = () => {
    setSelectedCertificate(null);
  };

  const navigateCertificate = (direction) => {
    const currentIndex = sortedCertificates.findIndex(cert => cert.id === selectedCertificate.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % sortedCertificates.length;
    } else {
      newIndex = (currentIndex - 1 + sortedCertificates.length) % sortedCertificates.length;
    }
    
    setSelectedCertificate(sortedCertificates[newIndex]);
  };

  return (
    <>
      <div className="certificates-page">
        {/* Header */}
        <header className="certificates-page-header">
          <button className="back-button" onClick={handleBackClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Portfolio
          </button>
          <h1 className="certificates-page-title">
            <span className="gradient-text">Certificates & Achievements</span>
          </h1>
          <p className="certificates-page-subtitle">All my certifications and achievements</p>
        </header>

        {/* Certificates Grid */}
        <div className="certificates-page-grid">
          {sortedCertificates.map((cert, index) => (
            <div 
              key={cert.id} 
              className="certificate-page-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {cert.image && (
                <div 
                  className="certificate-page-image-container"
                  onClick={() => openLightbox(cert)}
                >
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="certificate-page-image"
                    loading="lazy"
                  />
                  <div className="certificate-page-overlay">
                    <span className="view-icon">🔍</span>
                  </div>
                </div>
              )}
              <div className="certificate-page-content">
                <div className="certificate-page-icon">{cert.icon}</div>
                <h3 className="certificate-page-title">{cert.title}</h3>
                <p className="certificate-page-issuer">{cert.issuer}</p>
                <p className="certificate-page-date">
                  {cert.date.month} {cert.date.year}
                </p>
                <p className="certificate-page-description">{cert.description}</p>
                {cert.link && (
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="certificate-page-link"
                  >
                    View Certificate →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox for certificate images */}
        {selectedCertificate && (
          <div className="certificate-lightbox" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <button className="lightbox-nav lightbox-prev" onClick={(e) => {
              e.stopPropagation();
              navigateCertificate('prev');
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedCertificate.image} alt={selectedCertificate.title} />
              <div className="lightbox-info">
                <h2>{selectedCertificate.title}</h2>
                <p className="lightbox-issuer">{selectedCertificate.issuer}</p>
                <p className="lightbox-date">
                  {selectedCertificate.date.month} {selectedCertificate.date.year}
                </p>
              </div>
            </div>
            
            <button className="lightbox-nav lightbox-next" onClick={(e) => {
              e.stopPropagation();
              navigateCertificate('next');
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CertificatesPage;
