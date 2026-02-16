import './ImageCarousel3D.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import galleryImages from '../data/galleryImages.json';

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
      
      const maxWidth = isSmallMobile ? 300 : isMobile ? 400 : 700;
      const maxHeight = isSmallMobile ? 250 : isMobile ? 350 : 500;
      
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
    console.log(`Image ${imageId} loaded successfully`);
    
    // Get natural image dimensions
    const img = e.target;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    // Calculate scaled dimensions based on screen size
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    const maxWidth = isSmallMobile ? 300 : isMobile ? 400 : 700;
    const maxHeight = isSmallMobile ? 250 : isMobile ? 350 : 500;
    
    let width = naturalWidth;
    let height = naturalHeight;
    
    // Scale down if too large
    if (width > maxWidth || height > maxHeight) {
      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio);
      
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    
    // Update dimensions for the current image
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
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const handleViewGallery = () => {
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Navigate after a brief delay to allow scroll animation
    setTimeout(() => {
      navigate('/gallery');
    }, 300);
  };

  const getImagePosition = (index) => {
    let position = index - currentIndex;
    if (position < -3) position += displayImages.length;
    if (position > 3) position -= displayImages.length;
    return position;
  };

  return (
    <section className="carousel-3d-section" id="design-gallery">
      <div className="carousel-3d-container">
        <div className={`carousel-3d-header ${isLoaded ? 'loaded' : ''}`}>
          <h2 className="carousel-3d-title">Design Gallery</h2>
          <p className="carousel-3d-subtitle">Explore my creative design work</p>
          <div className="carousel-accent"></div>
        </div>

        <div className={`carousel-3d-wrapper ${isLoaded ? 'loaded' : ''}`}>
          <div 
            className="carousel-3d-scene"
            style={{
              height: `${carouselDimensions.height + 100}px`
            }}
          >
            <div className={`carousel-3d-viewer ${isTransitioning ? 'transitioning' : ''}`}>
              {displayImages.map((image, index) => {
                const position = getImagePosition(index);
                return (
                  <div
                    key={image.id}
                    className={`carousel-3d-item carousel-position-${position}`}
                    style={{
                      width: `${carouselDimensions.width}px`,
                      height: `${carouselDimensions.height}px`,
                      marginLeft: `-${carouselDimensions.width / 2}px`,
                      marginTop: `-${carouselDimensions.height / 2}px`,
                      transform: `
                        rotateY(${position * 35}deg) 
                        translateZ(${position === 0 ? '0px' : -Math.abs(position) * 200 + 'px'})
                        scale(${position === 0 ? 1 : 0.6 - Math.abs(position) * 0.08})
                      `,
                      opacity: Math.abs(position) > 2 ? 0 : 1 - Math.abs(position) * 0.15,
                      filter: position === 0 ? 'blur(0px)' : `blur(${Math.abs(position) * 8}px)`,
                      zIndex: 100 - Math.abs(position) * 10
                    }}
                  >
                    <div className="carousel-item-inner">
                      <img 
                        ref={el => imageRefs.current[image.id] = el}
                        src={image.image} 
                        alt={image.title}
                        onError={() => handleImageError(image.id, image.image)}
                        onLoad={(e) => handleImageLoad(e, image.id)}
                        style={{ display: imageErrors[image.id] ? 'none' : 'block' }}
                      />
                      {imageErrors[image.id] && (
                        <div className="image-error-placeholder">
                          <span>🖼️</span>
                          <p>Image not available</p>
                          <small>{image.title}</small>
                        </div>
                      )}
                      {position === 0 && !imageErrors[image.id] && (
                        <div className="carousel-item-overlay">
                          <div className="overlay-text">
                            <h3>{image.title}</h3>
                            <p>{image.subtitle}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Light effect */}
            <div className="carousel-light-effect"></div>
          </div>

          {/* Navigation Controls */}
          <div className="carousel-controls">
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={handlePrev}
              disabled={isTransitioning}
              title="Previous"
            >
              <span className="arrow-icon">←</span>
            </button>

            <div className="carousel-indicators">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => {
                    if (!isTransitioning && index !== currentIndex) {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsTransitioning(false), 600);
                    }
                  }}
                />
              ))}
            </div>

            <button
              className="carousel-btn carousel-btn-next"
              onClick={handleNext}
              disabled={isTransitioning}
              title="Next"
            >
              <span className="arrow-icon">→</span>
            </button>
          </div>

          {/* Image Counter */}
          <div className="carousel-counter">
            <span className="current">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="separator">/</span>
            <span className="total">{String(displayImages.length).padStart(2, '0')}</span>
          </div>
          
          {/* Load More Button */}
          <div className="load-more-container">
            <button className="load-more-btn" onClick={handleViewGallery}>
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
