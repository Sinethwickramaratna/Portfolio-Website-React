import { useState, useEffect } from 'react'
import './App.css'

import NavBar from './Components/public/NavBar'
import HeroSection from './Components/HeroSection.jsx';
import AboutSection from './Components/AboutSection.jsx';
import CertificatesSection from './Components/CertificatesSection.jsx';
import SkillsSection from './Components/SkillsSection.jsx';
import ProjectsSection from './Components/ProjectsSection.jsx';
import VolunteeringSection from './Components/VolunteeringSection.jsx';
import ImageCarousel3D from './Components/ImageCarousel3D.jsx';
import ContactSection from './Components/ContactSection.jsx';
import LoadingPage from './Components/LoadingPage.jsx';


function App() {
  const [count, setCount] = useState(0)

  // Create binary code rain effect
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

    const interval = setInterval(createBinaryRain, 150);
    return () => clearInterval(interval);
  }, []);

  // Create data stream effect
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

    for (let i = 0; i < 5; i++) {
      setTimeout(() => createDataStream(), i * 1000);
    }

    const interval = setInterval(createDataStream, 3000);
    return () => clearInterval(interval);
  }, []);

  // Create data packets
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

    for (let i = 0; i < 6; i++) {
      setTimeout(() => createDataPacket(), i * 600);
    }

    const interval = setInterval(createDataPacket, 2500);
    return () => clearInterval(interval);
  }, []);

  // Create floating data particles
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

    for (let i = 0; i < 15; i++) {
      setTimeout(() => createParticle(), i * 200);
    }

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LoadingPage />
      <NavBar />
      <HeroSection />
      <AboutSection />
      <CertificatesSection />
      <SkillsSection />
      <ProjectsSection />
      <VolunteeringSection />
      <ImageCarousel3D />
      <ContactSection />
    </>
  )
}

export default App
