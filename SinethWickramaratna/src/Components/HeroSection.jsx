import { useState, useEffect, useRef } from 'react';
import './HeroSection.css';
import { useScrollProgress } from '../hooks/useScrollProgress';
import profileImage from '../assets/Images/profile.png';
import projectsDataRaw from '../data/projectsData.json';
import certificatesDataRaw from '../data/certificatesData.json';

const ROLES = ['AI ENGINEER', 'DATA SCIENTIST', 'PROBLEM SOLVER'];

function HeroSection() {
  // Scroll progress drives the hero's exit: as you scroll away the whole
  // composition flies toward the viewer and dissolves.
  const heroRef = useScrollProgress({ damping: 0.18 });
  const pointerRef = useRef(null);

  const [colomboTime, setColomboTime] = useState('');
  const [themeLabel, setThemeLabel] = useState('DEEP FIELD');
  const [scanState, setScanState] = useState('idle'); // idle | scanning | verified

  /* Live clock, Sri Lanka time */
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setColomboTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* Mirror the active theme into the telemetry readout */
  useEffect(() => {
    const read = () => {
      const t = document.documentElement.getAttribute('data-theme') || 'dark';
      setThemeLabel(t === 'light' ? 'WHITE LAB' : 'DEEP FIELD');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  /* Pointer parallax — published as CSS vars, no re-render per move */
  useEffect(() => {
    const el = pointerRef.current;
    if (!el) return undefined;
    if (window.matchMedia?.('(pointer: coarse)').matches) return undefined;

    let raf = null;
    let x = 0;
    let y = 0;

    const onMove = (e) => {
      x = (e.clientX / window.innerWidth - 0.5) * 2;
      y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (raf === null) {
        raf = requestAnimationFrame(() => {
          raf = null;
          el.style.setProperty('--mx', x.toFixed(3));
          el.style.setProperty('--my', y.toFixed(3));
        });
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  /* Identity scan sequence */
  useEffect(() => {
    if (scanState !== 'scanning') return undefined;
    const id = setTimeout(() => setScanState('verified'), 2200);
    return () => clearTimeout(id);
  }, [scanState]);

  const projectCount = projectsDataRaw.projects?.length ?? 0;
  const certCount = Array.isArray(certificatesDataRaw) ? certificatesDataRaw.length : 0;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__pointer-root" ref={pointerRef}>
        {/* ---------- Depth plate: distant HUD frame ---------- */}
        <div className="hero__frame" aria-hidden="true">
          <span className="hero__frame-corner tl" />
          <span className="hero__frame-corner tr" />
          <span className="hero__frame-corner bl" />
          <span className="hero__frame-corner br" />
        </div>

        {/* ---------- Central identity core ---------- */}
        <div className={`hero__core hero__core--${scanState}`} aria-hidden="true">
          <div className="hero__core-ring hero__core-ring--outer" />
          <div className="hero__core-ring hero__core-ring--mid" />
          <div className="hero__core-ring hero__core-ring--inner" />
          <div className="hero__core-disc">
            <img
              src={profileImage}
              alt=""
              className="hero__core-portrait"
              width="360"
              height="360"
              fetchPriority="high"
              decoding="async"
            />
            <span className="hero__core-scanline" />
          </div>
        </div>

        {/* ---------- Foreground content ---------- */}
        <div className="hero__content">
          <span className="hero__eyebrow monospace-val">
            <span className="hero__pulse" />
            SYSTEM ONLINE · COLOMBO {colomboTime || '--:--:--'}
          </span>

          <h1 className="hero__title">
            <span className="hero__title-line">SINETH</span>
            <span className="hero__title-line hero__title-line--accent">
              WICKRAMARATNA
            </span>
          </h1>

          <ul className="hero__roles">
            {ROLES.map((role) => (
              <li key={role} className="hero__role monospace-val">
                {role}
              </li>
            ))}
          </ul>

          <p className="hero__lede">
            Computer Science &amp; Engineering at the University of Moratuwa,
            specialising in Data Science. I turn raw data into systems that
            decide, predict, and explain themselves.
          </p>

          <div className="hero__actions">
            <button
              type="button"
              className="btn-premium btn-primary-glow"
              onClick={() => scrollTo('contact')}
            >
              Get in touch
            </button>
            <a
              href="/CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium btn-outline"
            >
              Download CV
            </a>
          </div>
        </div>

        {/* ---------- Telemetry panel ---------- */}
        <aside className="hero__telemetry holo-panel">
          <span className="hud-corner top-left" />
          <span className="hud-corner top-right" />
          <span className="hud-corner bottom-left" />
          <span className="hud-corner bottom-right" />

          <header className="hero__telemetry-head">
            <span className="field-label">Telemetry</span>
            <span className="hero__telemetry-state monospace-val">
              {scanState === 'verified' ? 'VERIFIED' : 'NOMINAL'}
            </span>
          </header>

          <dl className="hero__telemetry-grid">
            <div className="hero__stat">
              <dt className="field-label">Mode</dt>
              <dd className="monospace-val">{themeLabel}</dd>
            </div>
            <div className="hero__stat">
              <dt className="field-label">Projects</dt>
              <dd className="monospace-val">{String(projectCount).padStart(2, '0')}</dd>
            </div>
            <div className="hero__stat">
              <dt className="field-label">Certifications</dt>
              <dd className="monospace-val">{String(certCount).padStart(2, '0')}</dd>
            </div>
            <div className="hero__stat">
              <dt className="field-label">Experience</dt>
              <dd className="monospace-val">2+ YRS</dd>
            </div>
          </dl>

          <button
            type="button"
            className={`btn-premium hero__scan-btn ${
              scanState === 'idle' ? 'btn-outline' : 'btn-outline is-active'
            }`}
            onClick={() =>
              setScanState((s) => (s === 'scanning' ? s : s === 'verified' ? 'idle' : 'scanning'))
            }
            disabled={scanState === 'scanning'}
          >
            {scanState === 'idle' && 'Run identity scan'}
            {scanState === 'scanning' && 'Scanning…'}
            {scanState === 'verified' && 'Reset'}
          </button>
        </aside>

        {/* ---------- Scroll cue ---------- */}
        <button
          type="button"
          className="hero__scroll-cue"
          onClick={() => scrollTo('about')}
          aria-label="Scroll to next section"
        >
          <span className="monospace-val">SCROLL</span>
          <span className="hero__scroll-track" aria-hidden="true">
            <span className="hero__scroll-dot" />
          </span>
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
