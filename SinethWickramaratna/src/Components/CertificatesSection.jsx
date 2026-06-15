import './CertificatesSection.css';
import { useInView } from '../hooks/useInView';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import robofest2025 from '../assets/Certificates/RoboFest.jpg';
import kaggleML from '../assets/Certificates/Sineth Wickramaratna - Intro to Machine Learning.png';
import kagglePandas from '../assets/Certificates/Sineth Wickramaratna - Pandas.png';
import kaggleDataCleaning from '../assets/Certificates/Sineth Wickramaratna - Data Cleaning.png';
import kaggleFeatureEngineering from '../assets/Certificates/Sineth Wickramaratna - Feature Engineering.png';
import rotaractMembership from '../assets/Certificates/Rotaract Active Membership.jpg';
import rotaracrDirectorsAppreciation from '../assets/Certificates/Board of Directors.jpg';
import certificatesDataRaw from '../data/certificatesData.json';
import AtmosphericBackground from './AtmosphericBackground';

function CertificatesSection() {
  const [certificatesRef, isCertificatesInView] = useInView();
  const navigate = useNavigate();
  const INITIAL_DISPLAY_COUNT = 3;

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

  return (
    <section className="certificates-section" id="certificates" ref={certificatesRef}>
      {/* Background Slow Drifting Gold Dust */}
      <AtmosphericBackground type="honor" />
      
      <div className="spatial-container">
        
        {/* Section Header HUD */}
        <div className="section-header-hud">
          <span className="section-number-bg">006</span>
          <h2 className="section-title-hud font-display" data-kanji="誉">
            [006] <span className="text-gradient">HONOR ARCHIVE</span>
          </h2>
          <span className="section-telemetry-hud monospace-val">HONORS_INDEXED</span>
        </div>

        <div className={`certificates-content shoji-reveal ${isCertificatesInView ? 'loaded' : ''}`}>
          <div className="certificates-grid">
            {displayedData.map((cert, index) => (
              <div 
                key={cert.id} 
                className="certificate-card shogun-card honor-casing"
                style={{ animationDelay: `${index * 0.15}s` }}
                data-cursor="open"
              >
                <div className="hud-corner top-left"></div>
                <div className="hud-corner top-right"></div>
                <div className="hud-corner bottom-left"></div>
                <div className="hud-corner bottom-right"></div>

                {cert.image && (
                  <div className="certificate-image-container">
                    <img src={cert.image} alt={cert.title} className="certificate-image" loading="lazy" />
                  </div>
                )}
                <div className="certificate-body-content">
                  <div className="certificate-issuer-row">
                    <span className="cert-badge monospace-val">HONOR_{cert.id}</span>
                    <span className="cert-date monospace-val">{cert.date.month.toUpperCase()} {cert.date.year}</span>
                  </div>
                  
                  <h3 className="certificate-title font-display">{cert.title}</h3>
                  <p className="certificate-issuer monospace-val">ISSUER: {cert.issuer.toUpperCase()}</p>
                  <p className="certificate-description">{cert.description}</p>
                  
                  {cert.link && (
                    <div className="cert-action-row">
                      <a 
                        href={cert.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-premium btn-primary-glow cert-view-btn"
                      >
                        [ SECURE LINK ]
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="load-more-container">
            <button 
              className="btn-premium btn-outline load-more-btn font-display" 
              onClick={() => navigate('/certificates')}
            >
              [ VIEW ALL ARCHIVED HONORS ]
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CertificatesSection;
