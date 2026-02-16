import './BlogSection.css';
import { useInView } from '../hooks/useInView';

function BlogSection() {
  const [blogRef, isBlogInView] = useInView();

  return (
    <section className="blog-section" id="blog" ref={blogRef}>
      <div className="blog-container">
        <div className={`blog-header ${isBlogInView ? 'loaded' : ''}`}>
          <h2 className="blog-title">Blog</h2>
          <div className="blog-accent"></div>
        </div>

        <div className={`coming-soon-container ${isBlogInView ? 'loaded' : ''}`}>
          <div className="coming-soon-content">
            <div className="coming-soon-icon">✍️</div>
            <h3 className="coming-soon-text">
              <span className="text-letter">C</span>
              <span className="text-letter">o</span>
              <span className="text-letter">m</span>
              <span className="text-letter">i</span>
              <span className="text-letter">n</span>
              <span className="text-letter">g</span>
              <span className="text-letter space"> </span>
              <span className="text-letter">S</span>
              <span className="text-letter">o</span>
              <span className="text-letter">o</span>
              <span className="text-letter">n</span>
            </h3>
            <p className="coming-soon-subtitle">Exciting articles and insights are on the way...</p>
            
            <div className="animated-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>

            <div className="tech-preview">
              <p className="preview-label">Topics to explore:</p>
              <div className="tech-badges">
                <span className="tech-badge">Machine Learning</span>
                <span className="tech-badge">Web Development</span>
                <span className="tech-badge">Data Science</span>
                <span className="tech-badge">Best Practices</span>
              </div>
            </div>
          </div>

          <div className="floating-elements">
            <div className="float-item">📝</div>
            <div className="float-item">💡</div>
            <div className="float-item">📚</div>
            <div className="float-item">🎨</div>
            <div className="float-item">🚀</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
