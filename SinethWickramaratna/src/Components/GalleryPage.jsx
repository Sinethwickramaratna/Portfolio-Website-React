import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GalleryPage.css';
import galleryImages from '../data/galleryImages.json';

function GalleryPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});

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
    <div className="gallery-page">
      {/* Header */}
      <header className="gallery-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Portfolio
        </button>
        <h1 className="gallery-title">
          <span className="gradient-text">Design Gallery</span>
        </h1>
        <p className="gallery-subtitle">Explore all my graphic design works</p>
      </header>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {galleryImages.map((item) => (
          <div 
            key={item.id} 
            className={`gallery-item ${imageLoaded[item.id] ? 'loaded' : ''}`}
            onClick={() => openLightbox(item)}
          >
            <div className="gallery-item-inner">
              <img 
                src={item.image} 
                alt={item.title}
                onLoad={() => handleImageLoad(item.id)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
              <div className="gallery-item-overlay">
                <h3>{item.title}</h3>
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
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.image} alt={selectedImage.title} />
            <div className="lightbox-info">
              <h2>{selectedImage.title}</h2>
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
  );
}

export default GalleryPage;
