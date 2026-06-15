import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AudioProvider } from './hooks/useAmbientSynth'
import GlobalAudioControl from './Components/public/GlobalAudioControl'

import NavBar from './Components/public/NavBar'
import HeroSection from './Components/HeroSection.jsx';
import CoreTelemetry from './Components/CoreTelemetry.jsx';
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
import KatanaScrollProgress from './Components/KatanaScrollProgress.jsx';
import CustomCursor from './Components/CustomCursor.jsx';

// HomePage Component
function HomePage() {
  return (
    <>
      <CustomCursor />
      <NavBar />
      <HeroSection />
      <CoreTelemetry />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <VolunteeringSection />
      <CertificatesSection />
      <BlogSection />
      <ImageCarousel3D />
      <ContactSection />
      <Footer />
      <GoToTopButton />
      <KatanaScrollProgress />
    </>
  );
}

function App() {
  return (
    <AudioProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/blog/cattle-behavior-iot-ml" element={<CattleBehaviorBlog />} />
      </Routes>
      <GlobalAudioControl />
    </AudioProvider>
  )
}

export default App