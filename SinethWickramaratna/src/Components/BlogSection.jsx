import './BlogSection.css';
import { useInView } from '../hooks/useInView';
import { Link } from 'react-router-dom';
import AtmosphericBackground from './AtmosphericBackground';

function BlogSection() {
  const [blogRef, isBlogInView] = useInView();

  return (
    <section className="blog-section" id="blog" ref={blogRef}>
      {/* Background Animated Japanese Ink Spreads */}
      <AtmosphericBackground type="scrolls" />
      
      <div className="spatial-container">
        
        {/* Section Header HUD */}
        <div className="section-header-hud">
          <span className="section-number-bg">007</span>
          <h2 className="section-title-hud font-display" data-kanji="巻">
            [007] <span className="text-gradient">KNOWLEDGE SCROLLS</span>
          </h2>
          <span className="section-telemetry-hud monospace-val">ARCHIVES_COMMITTED</span>
        </div>

        <div className={`blog-cards-container shoji-reveal ${isBlogInView ? 'loaded' : ''}`}>
          
          {/* Scroll Dossier 1 */}
          <div className="knowledge-scroll-card shogun-card" data-cursor="open">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
            
            {/* Scroll Spine/Indicator */}
            <div className="scroll-spine"></div>

            <div className="scroll-content">
              <div className="scroll-category-row">
                <span className="scroll-cat monospace-val">IoT + MACHINE LEARNING</span>
                <span className="scroll-meta monospace-val">[LOG_001]</span>
              </div>
              
              <h3 className="scroll-title font-display">
                From Sensors to Insights: Detecting Cattle Behavior Using IoT, Feature Engineering, and Machine Learning
              </h3>
              
              <p className="scroll-excerpt">
                A complete pipeline from MPU9250 IMU sensor data to sliding-window feature engineering, SVM behavior classification, and FastAPI deployment for smart livestock monitoring.
              </p>

              <div className="scroll-tags">
                <span className="scroll-tag monospace-val">#IoT</span>
                <span className="scroll-tag monospace-val">#SVM</span>
                <span className="scroll-tag monospace-val">#FastAPI</span>
                <span className="scroll-tag monospace-val">#ML</span>
              </div>

              <div className="scroll-action-row">
                <Link to="/blog/cattle-behavior-iot-ml" className="btn-premium btn-primary-glow scroll-read-btn" aria-label="Read full cattle behavior blog">
                  [ UNROLL SCROLL ]
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default BlogSection;
