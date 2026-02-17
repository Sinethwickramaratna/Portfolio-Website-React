import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import NavBar from './Components/public/NavBar'
import HeroSection from './Components/HeroSection.jsx';
import AboutSection from './Components/AboutSection.jsx';
import CertificatesSection from './Components/CertificatesSection.jsx';
import SkillsSection from './Components/SkillsSection.jsx';
import ProjectsSection from './Components/ProjectsSection.jsx';
import BlogSection from './Components/BlogSection.jsx';
import VolunteeringSection from './Components/VolunteeringSection.jsx';
import ImageCarousel3D from './Components/ImageCarousel3D.jsx';
import ContactSection from './Components/ContactSection.jsx';
import LoadingPage from './Components/LoadingPage.jsx';
import GalleryPage from './Components/GalleryPage.jsx';
import CertificatesPage from './Components/CertificatesPage.jsx';
import Footer from './Components/public/Footer.jsx';

// HomePage Component
function HomePage() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <CertificatesSection />
      <SkillsSection />
      <ProjectsSection />
      <VolunteeringSection />
      <BlogSection />
      <ImageCarousel3D />
      <ContactSection />
      <Footer />
    </>
  );
}

function App() {
  const [count, setCount] = useState(0)
  const [showLoading, setShowLoading] = useState(true);

  // Create binary code rain effect - delayed to not affect LCP/CLS
  useEffect(() => {
    const createBinaryRain = () => {
      const binary = document.createElement('div');
      binary.className = 'binary-rain';
      binary.textContent = Math.random() > 0.5 ? '1' : '0';
      binary.style.left = Math.random() * 100 + '%';
      binary.style.animationDuration = (Math.random() * 3 + 2) + 's';
      binary.style.fontSize = (Math.random() * 10 + 10) + 'px';
      document.body.appendChild(binary);
      
      setTimeout(() => {
        binary.remove();
      }, 5000);
    };

    // Delay start to not affect initial page load
    const startDelay = setTimeout(() => {
      const interval = setInterval(createBinaryRain, 2000); // Reduced from 400ms
      return () => clearInterval(interval);
    }, 3000); // Increased delay

    return () => clearTimeout(startDelay);
  }, []);

  // Create data stream effect - delayed
  useEffect(() => {
    const createDataStream = () => {
      const stream = document.createElement('div');
      stream.className = 'data-stream';
      stream.style.top = Math.random() * 100 + '%';
      stream.style.animationDuration = (Math.random() * 2 + 3) + 's';
      document.body.appendChild(stream);
      
      setTimeout(() => {
        stream.remove();
      }, 5000);
    };

    // Delay start to not affect initial page load
    const startDelay = setTimeout(() => {
      const interval = setInterval(createDataStream, 8000); // Reduced frequency
      return () => clearInterval(interval);
    }, 4000); // Increased delay

    return () => clearTimeout(startDelay);
  }, []);

  // Create data packets - delayed
  useEffect(() => {
    const dataLabels = ['ML', 'AI', 'DATA', '01', '10', 'SQL', 'API', 'CSV', 'JSON'];
    
    const createDataPacket = () => {
      const packet = document.createElement('div');
      packet.className = 'data-packet';
      packet.textContent = dataLabels[Math.floor(Math.random() * dataLabels.length)];
      packet.style.left = Math.random() * 100 + '%';
      packet.style.top = Math.random() * 100 + '%';
      packet.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(packet);
      
      setTimeout(() => {
        packet.remove();
      }, 4000);
    };

    // Delay start to not affect initial page load
    const startDelay = setTimeout(() => {
      const interval = setInterval(createDataPacket, 5000); // Reduced frequency
      return () => clearInterval(interval);
    }, 5000); // Increased delay

    return () => clearTimeout(startDelay);
  }, []);

  // Create floating data particles - delayed
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'data-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 5) + 's';
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 9000);
    };

    // Delay start to not affect initial page load
    const startDelay = setTimeout(() => {
      const interval = setInterval(createParticle, 3000); // Reduced frequency
      return () => clearInterval(interval);
    }, 6000); // Increased delay

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <>
      {showLoading && <LoadingPage />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
      </Routes>
    </>
  )
}

export default App
