import './BlogSection.css';
import { useInView } from '../hooks/useInView';
import { Link } from 'react-router-dom';

function BlogSection() {
  const [blogRef, isBlogInView] = useInView();

  return (
    <section className="blog-section" id="blog" ref={blogRef}>
      <div className="blog-container">
        <div className={`blog-header ${isBlogInView ? 'loaded' : ''}`}>
          <h2 className="blog-title">Blog</h2>
          <div className="blog-accent"></div>
        </div>

        <div className={`blog-cards-container ${isBlogInView ? 'loaded' : ''}`}>
          <div className="blog-card">
            <p className="blog-card-category">IoT + Machine Learning</p>
            <h3 className="blog-card-title">
              From Sensors to Insights: Detecting Cattle Behavior Using IoT, Feature Engineering, and Machine Learning
            </h3>
            <p className="blog-card-excerpt">
              A complete pipeline from MPU9250 IMU sensor data to sliding-window feature engineering, SVM behavior classification, and FastAPI deployment for smart livestock monitoring.
            </p>

            <div className="blog-card-tags">
              <span>IoT</span>
              <span>Feature Engineering</span>
              <span>SVM</span>
              <span>FastAPI</span>
            </div>

            <Link to="/blog/cattle-behavior-iot-ml" className="blog-read-link" aria-label="Read full cattle behavior blog">
              Read full blog
              <span className="arrow" aria-hidden="true">-></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
