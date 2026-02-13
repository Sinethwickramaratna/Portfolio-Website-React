import './ImageCarousel3D.css';
import { useState, useEffect } from 'react';

function ImageCarousel3D() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Sample images - replace with your actual design images
  const carouselImages = [
    {
      id: 1,
      title: 'Modern Brand Identity',
      subtitle: 'Logo & Visual System',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Digital UI Design',
      subtitle: 'User Interface Concept',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Marketing Campaign',
      subtitle: 'Social Media Graphics',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Data Visualization',
      subtitle: 'Infographic Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Print Collateral',
      subtitle: 'Business Card Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Web Design Mockup',
      subtitle: 'Responsive Layout',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
    }
  ];

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const getImagePosition = (index) => {
    let position = index - currentIndex;
    if (position < -3) position += carouselImages.length;
    if (position > 3) position -= carouselImages.length;
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
          <div className="carousel-3d-scene">
            <div className={`carousel-3d-viewer ${isTransitioning ? 'transitioning' : ''}`}>
              {carouselImages.map((image, index) => {
                const position = getImagePosition(index);
                return (
                  <div
                    key={image.id}
                    className={`carousel-3d-item carousel-position-${position}`}
                    style={{
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
                      <img src={image.image} alt={image.title} />
                      {position === 0 && (
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
              {carouselImages.map((_, index) => (
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
            <span className="total">{String(carouselImages.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* View More Button */}
        <div className="carousel-view-more">
          <button className="view-more-btn">
            <span>View All Designs</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ImageCarousel3D;
