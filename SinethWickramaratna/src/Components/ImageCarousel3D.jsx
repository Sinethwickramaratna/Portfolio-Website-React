import './ImageCarousel3D.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import galleryImages from '../data/galleryImages.json';
import AtmosphericBackground from './AtmosphericBackground';

const carouselImages = galleryImages;

function ImageCarousel3D() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [carouselDimensions, setCarouselDimensions] = useState({
    width: 600,
    height: 400
  });

  const imageRefs = useRef({});
  const dragStartRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  // Only show first 10 images in carousel
  const displayImages = carouselImages.slice(0, 10);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Handle window resize to adjust dimensions
  useEffect(() => {
    const handleResize = () => {
      const currentImage = imageRefs.current[displayImages[currentIndex]?.id];
      if (currentImage && currentImage.complete && currentImage.naturalWidth) {
        const e = { target: currentImage };
        handleImageLoad(e, currentImage.id || displayImages[currentIndex].id);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  // Update dimensions when current image changes
  useEffect(() => {
    const currentImage = imageRefs.current[displayImages[currentIndex]?.id];
    if (currentImage && currentImage.complete && currentImage.naturalWidth) {
      const naturalWidth = currentImage.naturalWidth;
      const naturalHeight = currentImage.naturalHeight;
      
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      
      const maxWidth = isSmallMobile ? Math.min(window.innerWidth - 32, 360) : isMobile ? Math.min(window.innerWidth - 64, 520) : 640;
      const maxHeight = isSmallMobile ? 260 : isMobile ? 360 : 420;
      
      let width = naturalWidth;
      let height = naturalHeight;
      
      if (width > maxWidth || height > maxHeight) {
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);
        
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      
      setCarouselDimensions({ width, height });
    }
  }, [currentIndex]);

  const handleImageLoad = (e, imageId) => {
    const img = e.target;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    const maxWidth = isSmallMobile ? Math.min(window.innerWidth - 32, 360) : isMobile ? Math.min(window.innerWidth - 64, 520) : 640;
    const maxHeight = isSmallMobile ? 260 : isMobile ? 360 : 420;
    
    let width = naturalWidth;
    let height = naturalHeight;
    
    if (width > maxWidth || height > maxHeight) {
      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio);
      
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    
    setCarouselDimensions({ width, height });
  };

  const handleImageError = (imageId, url) => {
    console.error(`Failed to load image ${imageId}:`, url);
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const handleViewGallery = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      navigate('/gallery');
    }, 300);
  };

  const getImagePosition = (index) => {
    let position = index - currentIndex;
    if (position < -5) position += displayImages.length;
    if (position > 5) position -= displayImages.length;
    return position;
  };

  // Drag and Swipe Handlers
  const handleDragStart = (clientX) => {
    dragStartRef.current = clientX;
    isDraggingRef.current = true;
  };

  const handleDragMove = (clientX) => {
    if (!isDraggingRef.current || dragStartRef.current === null) return;
    
    const diff = clientX - dragStartRef.current;
    
    if (diff > 80) {
      handlePrev();
      handleDragEnd();
    } else if (diff < -80) {
      handleNext();
      handleDragEnd();
    }
  };

  const handleDragEnd = () => {
    dragStartRef.current = null;
    isDraggingRef.current = false;
  };

  const activeImage = displayImages[currentIndex];

  return (
    <section className="carousel-3d-section" id="design-gallery">
      <AtmosphericBackground type="honor" />
      <div className="carousel-3d-container spatial-container">
        <div className={`carousel-3d-header section-header-hud ${isLoaded ? 'loaded' : ''}`}>
          <span className="section-number-bg">008</span>
          <h2 className="section-title-hud font-display" data-kanji="創">
            [008] <span className="text-gradient">CREATIVE OUTPOST</span>
          </h2>
          <span className="section-telemetry-hud monospace-val">GALLERY_CORE_STREAMING</span>
        </div>

        <div className={`carousel-3d-wrapper shoji-reveal ${isLoaded ? 'loaded' : ''}`}>
          
          {/* Holographic 3D Curved Stage */}
          <div 
            className="carousel-3d-scene"
            style={{
              height: `${carouselDimensions.height + 60}px`
            }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            <div className={`carousel-3d-viewer ${isTransitioning ? 'transitioning' : ''}`}>
              {displayImages.map((image, index) => {
                const position = getImagePosition(index);
                const isVisible = Math.abs(position) <= 1; // Only render active, left, and right cards
                
                return (
                  <div
                    key={image.id}
                    className={`carousel-3d-item carousel-position-${position} ${isVisible ? 'visible' : 'hidden'}`}
                    style={{
                      width: `${carouselDimensions.width}px`,
                      height: `${carouselDimensions.height}px`,
                      marginLeft: `-${carouselDimensions.width / 2}px`,
                      marginTop: `-${carouselDimensions.height / 2}px`,
                      transform: isVisible
                        ? `rotateY(${position * -35}deg) translateX(${position * (window.innerWidth <= 480 ? (window.innerWidth * 0.44) : (window.innerWidth <= 768 ? 200 : 340))}px) translateZ(${-Math.abs(position) * 150}px) scale(${position === 0 ? 1 : 0.78})`
                        : `rotateY(0deg) translateX(0px) translateZ(-400px) scale(0)`,
                      opacity: position === 0 ? 1 : isVisible ? 0.45 : 0,
                      filter: position === 0 ? 'blur(0px)' : `blur(3px)`,
                      zIndex: 100 - Math.abs(position) * 10
                    }}
                  >
                    <div className="carousel-item-inner">
                      <div className="hud-corner top-left"></div>
                      <div className="hud-corner top-right"></div>
                      <div className="hud-corner bottom-left"></div>
                      <div className="hud-corner bottom-right"></div>
                      
                      <div className="active-scanline"></div>
                      
                      <img 
                        ref={el => imageRefs.current[image.id] = el}
                        src={image.image} 
                        alt={image.title}
                        onError={() => handleImageError(image.id, image.image)}
                        onLoad={(e) => handleImageLoad(e, image.id)}
                        style={{ display: imageErrors[image.id] ? 'none' : 'block' }}
                        draggable="false"
                      />
                      {imageErrors[image.id] && (
                        <div className="image-error-placeholder">
                          <span>🖼️</span>
                          <p>Image not available</p>
                          <small>{image.title}</small>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glowing active core behind the active image */}
            <div className="carousel-light-effect"></div>
          </div>

          {/* Dedicated Dynamic HUD Metadata Dashboard */}
          {activeImage && (
            <div className="carousel-metadata-panel shogun-card">
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>
              
              <div className="metadata-header">
                <span className="monospace-val">// ARCHIVE_METADATA_DEC //</span>
                <span className="status-badge monospace-val">RECORD_00{currentIndex + 1}_ACTIVE</span>
              </div>
              
              <div className="metadata-content">
                <div className="meta-row">
                  <span className="meta-label">DESIGN_TITLE:</span>
                  <span className="meta-val font-display text-gradient">{activeImage.title}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">CREATIVE_SCOPE:</span>
                  <span className="meta-val">{activeImage.subtitle}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">STREAM_STATUS:</span>
                  <span className="meta-val monospace-val text-gold">STABLE // SYSTEM_RESOLVED</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls & Gauge */}
          <div className="carousel-controls-wrapper">
            <button
              className="btn-premium btn-outline carousel-control-btn"
              onClick={handlePrev}
              disabled={isTransitioning}
            >
              [ PREV_SLIDE ]
            </button>

            {/* Numeric Gauge Segments */}
            <div className="carousel-gauge monospace-val">
              {displayImages.map((_, index) => (
                <span 
                  key={index}
                  className={`gauge-segment ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => {
                    if (!isTransitioning && index !== currentIndex) {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsTransitioning(false), 500);
                    }
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              ))}
            </div>

            <button
              className="btn-premium btn-outline carousel-control-btn"
              onClick={handleNext}
              disabled={isTransitioning}
            >
              [ NEXT_SLIDE ]
            </button>
          </div>
          
          {/* View Full Gallery Link */}
          <div className="load-more-container">
            <button className="load-more-btn btn-premium btn-primary-glow" onClick={handleViewGallery}>
              <span className="btn-text">View Full Gallery</span>
              <span className="btn-icon">→</span>
              <span className="btn-count">{carouselImages.length} Designs</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ImageCarousel3D;
