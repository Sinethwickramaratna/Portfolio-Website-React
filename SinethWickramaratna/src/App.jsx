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
import CattleBehaviorBlog from './Components/BlogPages/CattleBehaviorBlog.jsx';
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

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/certificates" element={<CertificatesPage />} />
      <Route path="/blog/cattle-behavior-iot-ml" element={<CattleBehaviorBlog />} />
    </Routes>
  )
}

export default App