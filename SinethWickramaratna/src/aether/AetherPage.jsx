import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import './aether.css';

import { TOTAL_VH, STATION_INDEX } from './config';
import { useFlightDriver } from './state/flight';

import Hero from './sections/Hero';
import Thesis from './sections/Thesis';
import Profile from './sections/Profile';
import Skills from './sections/Skills';
import Work from './sections/Work';
import Journey from './sections/Journey';
import Research from './sections/Research';
import Creative from './sections/Creative';
import Credentials from './sections/Credentials';
import Philosophy from './sections/Philosophy';
import Contact from './sections/Contact';

import Rail from './ui/Rail';
import BackLayer from './ui/BackLayer';
import Cursor from './ui/Cursor';
import Curtain from './ui/Curtain';
import Footer from './ui/Footer';
import CaseStudy from './ui/CaseStudy';
import Flat from './Flat';

/* The 3D stack is the bulk of this site's JavaScript. Visitors who fall
   through to the flat document — no WebGL, or reduced motion — should
   never download a megabyte they cannot use. */
const Stage = lazy(() => import('./three/Stage'));

function detectWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * How hard to push the renderer.
 *
 * Deliberately crude. A precise capability probe would cost a frame to
 * run and would still be wrong on half the devices; the only decision
 * that matters is whether to run the post-processing chain at all, and
 * core count plus viewport size predicts that well enough.
 */
function detectQuality() {
  if (typeof navigator === 'undefined') return 'low';
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse || cores <= 4 || mem <= 4 || window.innerWidth < 760) return 'low';
  return 'high';
}

export default function AetherPage() {
  const supportsWebGL = useMemo(() => detectWebGL(), []);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  if (!supportsWebGL || reduced) {
    return <Flat reason={supportsWebGL ? 'motion' : 'webgl'} />;
  }

  return <Aether />;
}

function Aether() {
  const quality = useMemo(() => detectQuality(), []);
  const [entered, setEntered] = useState(false);
  const active = useFlightDriver(entered);

  /* Cross-layer state. All three are read by the 3D world and written
     by the document, which is the only coupling between the two layers
     — everything else the world needs it reads from `flight`. */
  const [skill, setSkill] = useState(null);
  const [milestone, setMilestone] = useState(0);
  const [credential, setCredential] = useState(-1);
  const [gallery, setGallery] = useState(-1);
  const [portalOpen, setPortalOpen] = useState(false);
  const [study, setStudy] = useState(null);
  const [worldReady, setWorldReady] = useState(false);
  const markReady = useCallback(() => setWorldReady(true), []);

  /* Suppress the previous identity's global chrome — ambient wash,
     gradient scrollbar, native smooth scroll — for as long as this
     route is mounted. The other routes still rely on it. */
  useEffect(() => {
    document.documentElement.classList.add('ae-active');
    return () => document.documentElement.classList.remove('ae-active');
  }, []);

  /* The document must not scroll behind the curtain, or behind an open
     case study. */
  useEffect(() => {
    const locked = !entered || Boolean(study);
    document.documentElement.classList.toggle('ae-locked', locked);
    return () => document.documentElement.classList.remove('ae-locked');
  }, [entered, study]);

  /* An open work belongs to its station. Rather than clearing the state
     in an effect when the flight leaves — which queues a render on every
     station change and can cascade — the *visible* selection is derived
     here. The stored value survives, so coming back to the gallery finds
     it where it was left. */
  const shownGallery = active === STATION_INDEX.creative ? gallery : -1;
  const shownCredential =
    active === STATION_INDEX.credentials ? credential : -1;

  const openStudy = useCallback((p) => setStudy(p), []);
  const closeStudy = useCallback(() => setStudy(null), []);

  return (
    <div className={`ae${entered ? ' is-entered' : ''}`} data-station={active}>
      <Cursor />

      {/* z-index 0 — the display type the 3D objects eclipse. */}
      <BackLayer active={active} />

      {/* z-index 1 — between the two type layers, so some words pass
          behind the world and others in front of it. */}
      <div className="ae-stage">
        <Suspense fallback={null}>
          <Stage
            quality={quality}
            portalOpen={portalOpen}
            onSkillHover={setSkill}
            onMilestone={setMilestone}
            credential={shownCredential}
            onCredential={setCredential}
            galleryFocus={shownGallery}
            onGalleryFocus={setGallery}
            onReady={markReady}
          />
        </Suspense>
      </div>

      {/* No stacking context on this element: its children take their
          own z-index against the root, which is what lets some of them
          sit under the canvas. */}
      <main className="ae-doc" style={{ '--total-vh': `${TOTAL_VH}vh` }}>
        <Hero />
        <Thesis />
        <Profile />
        <Skills hovered={skill} />
        <Work onOpen={openStudy} />
        <Journey active={milestone} />
        <Research />
        <Credentials active={shownCredential} onActive={setCredential} />
        <Creative focus={shownGallery} onFocus={setGallery} />
        <Philosophy />
        <Contact open={portalOpen} onOpen={setPortalOpen} />
        <Footer />
      </main>

      <Rail active={active} />

      {study && <CaseStudy project={study} onClose={closeStudy} />}

      <Curtain worldReady={worldReady} onEnter={() => setEntered(true)} />

      {/* Film grain. One fixed layer over everything, at very low
          opacity — it is what stops large flat fields of near-black
          from banding on cheap panels. */}
      <div className="ae-grain" aria-hidden="true" />
    </div>
  );
}
