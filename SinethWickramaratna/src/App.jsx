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
import GalleryPage from './Components/GalleryPage.jsx';
import CertificatesPage from './Components/CertificatesPage.jsx';
import Footer from './Components/public/Footer.jsx';
import GoToTopButton from './Components/GoToTopButton.jsx';

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
      <GoToTopButton />
    </>
  );
}

function App() {
  const [count, setCount] = useState(0)

  // Binary rain effect
  useEffect(() => {
    const createBinaryRain = () => {
      if (document.querySelectorAll('.binary-rain').length >= 6) return;

      const binary = document.createElement('div');
      binary.className = 'binary-rain';
      binary.textContent = Math.random() > 0.5 ? '1' : '0';
      binary.style.left = Math.random() * 50 + '%';
      binary.style.animationDuration = (Math.random() * 1.2 + 1) + 's';
      binary.style.fontSize = (Math.random() * 8 + 8) + 'px';
      document.body.appendChild(binary);

      setTimeout(() => binary.remove(), 5000);
    };

    const startDelay = setTimeout(() => {
      const interval = setInterval(createBinaryRain, 600); // was 400
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(startDelay);
  }, []);

  // Data stream effect
  useEffect(() => {
    const createDataStream = () => {
      if (document.querySelectorAll('.data-stream').length >= 2) return;

      const stream = document.createElement('div');
      stream.className = 'data-stream';
      stream.style.top = Math.random() * 50 + '%';
      stream.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
      document.body.appendChild(stream);

      setTimeout(() => stream.remove(), 5000);
    };

    const startDelay = setTimeout(() => {
      createDataStream(); // single initial stream instead of a loop

      const interval = setInterval(createDataStream, 8000); // was 5000
      return () => clearInterval(interval);
    }, 1500);

    return () => clearTimeout(startDelay);
  }, []);

  // Data packets
  useEffect(() => {
    const dataLabels = ['ML', 'AI', 'DATA', '01', '10', 'SQL', 'API', 'CSV', 'JSON'];

    const createDataPacket = () => {
      if (document.querySelectorAll('.data-packet').length >= 4) return;

      const packet = document.createElement('div');
      packet.className = 'data-packet';
      packet.textContent = dataLabels[Math.floor(Math.random() * dataLabels.length)];
      packet.style.left = Math.random() * 100 + '%';
      packet.style.top = Math.random() * 100 + '%';
      packet.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(packet);

      setTimeout(() => packet.remove(), 4000);
    };

    const startDelay = setTimeout(() => {
      for (let i = 0; i < 3; i++) { // was 6
        setTimeout(() => createDataPacket(), i * 600); // was i * 400
      }

      const interval = setInterval(createDataPacket, 5000); // was 2500
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(startDelay);
  }, []);

  // Floating data particles
  useEffect(() => {
    const createParticle = () => {
      if (document.querySelectorAll('.data-particle').length >= 5) return;

      const particle = document.createElement('div');
      particle.className = 'data-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 5) + 's';
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 9000);
    };

    const startDelay = setTimeout(() => {
      for (let i = 0; i < 3; i++) { // was 6
        setTimeout(() => createParticle(), i * 500); // was i * 300
      }

      const interval = setInterval(createParticle, 1600); // was 800
      return () => clearInterval(interval);
    }, 2500);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/certificates" element={<CertificatesPage />} />
    </Routes>
  )
}

export default App