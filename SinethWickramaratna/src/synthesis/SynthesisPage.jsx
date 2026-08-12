import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import './synthesis.css';
import { SECTIONS, TOTAL_SCROLL_VH } from './worldConfig';
import {
  useWorldDriver,
  useActiveSection,
  travelTo,
  world,
} from './state/worldState';
import SideNav from './ui/SideNav';
import ProjectDetail from './ui/ProjectDetail';
import SynthesisFallback from './SynthesisFallback';
import {
  VoidOverlay,
  DnaOverlay,
  CityOverlay,
  OrbitOverlay,
  MuseumOverlay,
  LabOverlay,
  FlowOverlay,
  PortalOverlay,
} from './ui/Overlays';

/* three.js, R3F and drei are the bulk of this site's JavaScript. Loading
   them lazily means visitors who fall back to the flat document — no
   WebGL, or reduced-motion — never download a megabyte they cannot use. */
const SynthesisWorld = lazy(() => import('./SynthesisWorld'));

/** Feature-detect WebGL once, at module load. */
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

export default function SynthesisPage() {
  const supportsWebGL = useMemo(() => detectWebGL(), []);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  const immersive = supportsWebGL && !reducedMotion;

  if (!immersive) {
    return <SynthesisFallback reason={supportsWebGL ? 'motion' : 'webgl'} />;
  }

  return <SynthesisImmersive />;
}

function SynthesisImmersive() {
  useWorldDriver();
  const active = useActiveSection();

  const [selection, setSelection] = useState({
    dna: null,
    city: null,
    project: null,
    piece: null,
    portal: false,
  });

  const handleSelect = useCallback((kind, value) => {
    setSelection((prev) => ({ ...prev, [kind]: value }));
  }, []);

  const closeProject = useCallback(() => {
    setSelection((prev) => ({ ...prev, project: null }));
    world.focus = { x: 0, y: 0, z: 0 };
  }, []);

  /* A selection only applies while its own environment is the active
     one. Deriving that during render — rather than clearing state in an
     effect when the camera arrives somewhere new — keeps travel free of
     cascading re-renders, and means a selection is still there if the
     visitor comes back to it. */
  const visible = useMemo(
    () => ({
      dna: active === 1 ? selection.dna : null,
      city: active === 2 ? selection.city : null,
      project: active === 3 ? selection.project : null,
      piece: active === 4 ? selection.piece : null,
      portal: active === 7 ? selection.portal : false,
    }),
    [active, selection]
  );

  /* Release the camera's lean-in on leaving an environment. `world` is a
     plain singleton, not React state, so this cannot cascade. */
  useEffect(() => {
    world.focus = { x: 0, y: 0, z: 0 };
  }, [active]);

  /* Keyboard navigation between environments. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      }
      if (e.key === 'PageDown') {
        e.preventDefault();
        travelTo(active + 1);
      }
      if (e.key === 'PageUp') {
        e.preventDefault();
        travelTo(active - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <div className="synthesis">
      {/* Giant display type, behind the canvas so the 3D objects in
          front of it occlude the letterforms. */}
      <div className="void-title-layer" aria-hidden="true">
        <span className="void-title">{SECTIONS[0].title}</span>
      </div>

      <Suspense fallback={null}>
        <SynthesisWorld selection={visible} onSelect={handleSelect} active={active} />
      </Suspense>

      <div className="synthesis-overlays">
        <VoidOverlay active={active === 0} />
        <DnaOverlay
          active={active === 1}
          selected={visible.dna}
          onSelect={(v) => handleSelect('dna', v)}
        />
        <CityOverlay
          active={active === 2}
          selected={visible.city}
          onSelect={(v) => handleSelect('city', v)}
        />
        <OrbitOverlay active={active === 3} />
        <MuseumOverlay active={active === 4} selected={visible.piece} />
        <LabOverlay active={active === 5} />
        <FlowOverlay active={active === 6} />
        <PortalOverlay
          active={active === 7}
          open={visible.portal}
          onOpen={(v) => handleSelect('portal', v === false ? false : true)}
        />
      </div>

      <SideNav />

      {/* The only element that actually scrolls. Its height defines the
          length of the flight; everything visible is fixed. */}
      <div
        className="synthesis-scroll"
        style={{ height: `${TOTAL_SCROLL_VH}vh` }}
        aria-hidden="true"
      />

      {visible.project !== null && (
        <ProjectDetail projectId={visible.project} onClose={closeProject} />
      )}
    </div>
  );
}
