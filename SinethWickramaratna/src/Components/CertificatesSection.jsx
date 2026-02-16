import './CertificatesSection.css';
import { useInView } from '../hooks/useInView';
import { useState, useMemo, useEffect } from 'react';
import robofest2025 from '../assets/Certificates/RoboFest.jpg';
import kaggleML from '../assets/Certificates/Sineth Wickramaratna - Intro to Machine Learning.png';
import kagglePandas from '../assets/Certificates/Sineth Wickramaratna - Pandas.png';
import kaggleDataCleaning from '../assets/Certificates/Sineth Wickramaratna - Data Cleaning.png';
import kaggleFeatureEngineering from '../assets/Certificates/Sineth Wickramaratna - Feature Engineering.png';
import rotaractMembership from '../assets/Certificates/Rotaract Active Membership.jpg';
import rotaracrDirectorsAppreciation from '../assets/Certificates/Board of Directors.jpg';

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
      title: 'SLIIT Robofest 2025 - Certificate of Achievements (Finalists)',
      issuer: 'SLIIT',
      date: { year: 2025, month: 'Oct' },
      description: 'Certificate awarded for outstanding performance in the SLIIT Robofest 2025, recognizing the achievement of reaching the finals in a competitive robotics event.',
      link: 'https://media.licdn.com/dms/image/v2/D562DAQEkokX_i0Yfgg/profile-treasury-image-shrink_800_800/B56ZnemSlQI8AY-/0/1760376209360?e=1771833600&v=beta&t=ml2kHJibTH1pyOGyszvId1q0Kg-oZIFp5g293DjAM5A',
      icon: '🤖',
      image: robofest2025
    },
    {
      id: 2,
      title: 'Kaggle - Intro to Machine Learning',
      issuer: 'Kaggle',
      date: { year: 2026, month: 'Feb' },
      description: 'Certificate awarded for completing the Intro to Machine Learning course on Kaggle.',
      link: 'https://media.licdn.com/dms/image/v2/D4D2DAQH-ExEVsFamNw/profile-treasury-image-shrink_800_800/B4DZwhCfbeHMAY-/0/1770080830814?e=1771851600&v=beta&t=b_3j853g8MTX7eMNOsHJCqB0XoalVKO7OVdR0t7XmoI',
      icon: '📊',
      image: kaggleML
    },
    {
      id: 3,
      title: 'Kaggle - Intro to Pandas',
      issuer: 'Kaggle',
      date: { year: 2026, month: 'Feb' },
      description: 'Certificate awarded for completing the Intro to Pandas course on Kaggle.',
      link: 'https://media.licdn.com/dms/image/v2/D4D2DAQGt1kLywqzwlg/profile-treasury-image-shrink_800_800/B4DZwhDeuTHYAY-/0/1770081089876?e=1771851600&v=beta&t=S_e38_MfEpJxwcZ5rVY5B_Etuvjoivtl5Ca0onzAWt4',
      icon: '📊',
      image: kagglePandas
    },
    {
      id: 4,
      title: 'Kaggle - Data Cleaning',
      issuer: 'Kaggle',
      date: { year: 2026, month: 'Feb' },
      description: 'Certificate awarded for completing the Data Cleaning course on Kaggle.',
      link: 'https://media.licdn.com/dms/image/v2/D562DAQEBwCYFjwTAlw/profile-treasury-image-shrink_800_800/B56Zwsciz2HQAc-/0/1770272213490?e=1771851600&v=beta&t=jxtoJwdOsiF--GaBTom3jHpJa-qmVzimUKbfhcPm0YE',
      icon: '📊',
      image: kaggleDataCleaning
    },
    {
      id: 5,
      title: 'Kaggle - Feature Engineering',
      issuer: 'Kaggle',
      date: { year: 2026, month: 'Feb' },
      description: 'Certificate awarded for completing the Feature Engineering course on Kaggle.',
      link: 'https://media.licdn.com/dms/image/v2/D562DAQFE18XHlsNCxw/profile-treasury-image-shrink_800_800/B56ZxdRwwrG4Ag-/0/1771091471487?e=1771851600&v=beta&t=K5XDCy48FyI-fHBsBj45DpFozn10_lzmBUnZOLrA6uc',
      icon: '📊',
      image: kaggleFeatureEngineering
    },
    {
      id: 6,
      title: 'Certificate of Active Membership - Rotaract Club of University of Moratuwa',
      issuer: 'Rotaract Club of University of Moratuwa',
      date: { year: 2025, month: 'Jun' },
      description: 'Certificate awarded for active membership and contributions to the Rotaract Club of University of Moratuwa.',
      link: 'https://media.licdn.com/dms/image/v2/D5622AQFdJBw2kjLonA/feedshare-shrink_480/B56ZhuO41THQAY-/0/1754196100878?e=1772668800&v=beta&t=sZ52549ZJiFFgIgoTb58_B-ruMJufcylWmD1DcrMFHM',
      icon: '🎗️',
      image: rotaractMembership
    },
    {
      id: 7,
      title: 'Board of Directors Certificate of Appreciation - Rotaract Club of University of Moratuwa',
      issuer: 'Rotaract Club of University of Moratuwa',
      date: { year: 2025, month: 'Jun' },
      description: 'Certificate of Appreciation awarded by the Board of Directors of the Rotaract Club of University of Moratuwa for outstanding contributions and dedication.',
      link: 'https://media.licdn.com/dms/image/v2/D5622AQG-c0T_6QsaVA/feedshare-shrink_480/B56ZhuO400H0AY-/0/1754196097861?e=1772668800&v=beta&t=09A_RFZSevBpHxnI63gwB76E0kl29QI2lx-RdZ6nVEQ',
      icon: '🎗️',
      image: rotaracrDirectorsAppreciation
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
