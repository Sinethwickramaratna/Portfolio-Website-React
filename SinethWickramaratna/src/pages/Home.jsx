import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/sections/Hero.jsx'
import Marquee from '../components/sections/Marquee.jsx'
import About from '../components/sections/About.jsx'
import Skills from '../components/sections/Skills.jsx'
import Projects from '../components/sections/Projects.jsx'
import Experience from '../components/sections/Experience.jsx'
import Research from '../components/sections/Research.jsx'
import DesignWork from '../components/sections/DesignWork.jsx'
import Certificates from '../components/sections/Certificates.jsx'
import Contact from '../components/sections/Contact.jsx'

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Research />
        <DesignWork />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
