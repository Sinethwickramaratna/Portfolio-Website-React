import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GalleryPage.css';
import galleryImages from '../data/galleryImages.json';
import Footer from './public/Footer';
import AtmosphericBackground from './AtmosphericBackground';

function GalleryPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleImageLoad = (id) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % galleryImages.length;
    } else {
      newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <>
      <div className="gallery-page">
        {/* Background Atmosphere */}
        <AtmosphericBackground type="hero" />
        
        {/* Header */}
        <header className="gallery-header section-header-hud">
          <button className="back-button btn-premium btn-outline" onClick={handleBackClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            [ BACK_TO_OS ]
          </button>
          <h1 className="gallery-title section-title-hud font-display">
            [008] <span className="text-gradient">DESIGN ARCHIVE</span>
          </h1>
          <span className="section-telemetry-hud monospace-val">GALLERY_ARCHIVE_LOADED</span>
        </header>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {galleryImages.map((item) => (
            <div 
              key={item.id} 
              className={`gallery-item ${imageLoaded[item.id] ? 'loaded' : ''}`}
              onClick={() => openLightbox(item)}
              data-cursor="open"
            >
              <div className="gallery-item-inner shogun-card">
                <div className="hud-corner top-left"></div>
                <div className="hud-corner top-right"></div>
                <div className="hud-corner bottom-left"></div>
                <div className="hud-corner bottom-right"></div>
                <img 
                  src={item.image} 
                  alt={item.title}
                  onLoad={() => handleImageLoad(item.id)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
                <div className="gallery-item-overlay">
                  <h3 className="font-display">{item.title}</h3>
                  <p>{item.subtitle}</p>
                  <span className="view-icon">🔍</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="lightbox" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <button className="lightbox-nav lightbox-prev" onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            <div className="lightbox-content shogun-card" onClick={(e) => e.stopPropagation()}>
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>
              <img src={selectedImage.image} alt={selectedImage.title} />
              <div className="lightbox-info">
                <h2 className="font-display">{selectedImage.title}</h2>
                <p>{selectedImage.subtitle}</p>
              </div>
            </div>
            
            <button className="lightbox-nav lightbox-next" onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
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

export default GalleryPage;
