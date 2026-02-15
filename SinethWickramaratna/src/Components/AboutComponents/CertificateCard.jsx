import { useState } from 'react';
import { useInView } from '../../hooks/useInView';

function CertificateCard({ cert, delay = 0 }) {
  const [cardRef, isCardInView] = useInView();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        ref={cardRef}
        className={`certificate-card ${isCardInView ? 'visible' : ''}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {cert.image && (
          <div className="cert-image-container">
            <img src={cert.image} alt={cert.title} className="cert-image" />
          </div>
        )}
        <div className="cert-content">
          <div className="cert-icon">{cert.icon}</div>
          <h4 className="cert-title">{cert.title}</h4>
          <p className="cert-issuer">{cert.issuer}</p>
          <p className="cert-date">{cert.date.month} {cert.date.year}</p>
          <div className="cert-actions">
            {cert.link && (
              <a 
                href={cert.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cert-link"
              >
                View →
              </a>
            )}
            <button 
              className="cert-more-btn"
              onClick={() => setIsExpanded(true)}
            >
              More
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="cert-modal-overlay" onClick={() => setIsExpanded(false)}>
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="cert-modal-close" 
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
            {cert.image && (
              <img src={cert.image} alt={cert.title} className="cert-modal-image" />
            )}
            <div className="cert-modal-content">
              <div className="cert-modal-icon">{cert.icon}</div>
              <h3 className="cert-modal-title">{cert.title}</h3>
              <p className="cert-modal-issuer">{cert.issuer}</p>
              <p className="cert-modal-date">{cert.date.month} {cert.date.year}</p>
              {cert.description && (
                <p className="cert-modal-description">{cert.description}</p>
              )}
              {cert.link && (
                <a 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cert-modal-link"
                >
                  View Full Certificate →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CertificateCard;
