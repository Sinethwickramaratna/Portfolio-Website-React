import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, AdaptiveDpr, Preload } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import * as THREE from 'three';

import Rig from './Rig';
import Station from './Station';
import Starfield from './Starfield';
import { PALETTE, STATION_INDEX } from '../config';

import IntelligenceCore from './scenes/IntelligenceCore';
import Constellation from './scenes/Constellation';
import ProfileHalo from './scenes/ProfileHalo';
import NeuralMap from './scenes/NeuralMap';
import Trajectory from './scenes/Trajectory';
import ResearchLab from './scenes/ResearchLab';
import Exhibition from './scenes/Exhibition';
import Doctrine from './scenes/Doctrine';
import Portal from './scenes/Portal';
import {
  LanguageFilaments,
  MediaOrbit,
  VisionAperture,
  KnowledgeArchitecture,
} from './scenes/ProjectVisuals';

/**
 * The world.
 *
 * One canvas for the entire site. Every 3D composition is a station on
 * a single continuous camera track, which is what stops each section
 * feeling like a separate page with its own graphic pinned to it.
 */

/**
 * The lighting environment is built in-scene from emissive planes
 * rather than loaded as an HDRI. It costs one render at start-up, ships
 * no asset, and — more to the point — it is *designed*: the chrome
 * reflects a cyan key from the upper left and a violet rim from behind,
 * because that is the palette, not because that is what a photograph of
 * a studio happened to contain.
 */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#050505']} />
      <Lightformer
        intensity={2.4}
        color={PALETTE.cyan}
        position={[-5, 4, -6]}
        scale={[10, 10, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        intensity={1.5}
        color={PALETTE.violet}
        position={[6, -2, -5]}
        scale={[8, 8, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        intensity={0.8}
        color={PALETTE.rose}
        position={[0, -6, 4]}
        scale={[8, 4, 1]}
        target={[0, 0, 0]}
      />
      {/* Two hard bars. Chrome needs a straight highlight to read as
          machined; broad fills alone make it look like plastic. */}
      <Lightformer
        form="rect"
        intensity={4}
        color="#ffffff"
        position={[3, 6, 2]}
        scale={[0.6, 14, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#ffffff"
        position={[-4, -5, 3]}
        scale={[0.35, 10, 1]}
        target={[0, 0, 0]}
      />
    </Environment>
  );
}

/**
 * Bloom, and nothing else.
 *
 * Every emissive cyan surface on this site is a *light* rather than a
 * bright material only because of this pass, so it earns its cost.
 * Vignette and grain are deliberately not here: the canvas is
 * transparent — display type sits behind it — and a screen-space darken
 * has nothing to act on where the buffer is empty. Both are done in CSS
 * over the whole page instead, where they also cover the document.
 */
function Grade({ quality }) {
  if (quality === 'low') return null;
  return (
    <EffectComposer disableNormalPass multisampling={quality === 'high' ? 4 : 0}>
      <Bloom
        intensity={quality === 'high' ? 0.95 : 0.7}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.35}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />
    </EffectComposer>
  );
}

/**
 * Reports the world genuinely ready.
 *
 * Not on mount and not on `onCreated` — both fire before a single
 * shader has been compiled. This waits for real frames to have been
 * drawn, which is the first moment the scene behind the curtain is
 * actually worth revealing.
 */
function FirstFrame({ onReady }) {
  const frames = useRef(0);
  const done = useRef(false);

  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 3) {
      done.current = true;
      onReady?.();
    }
  });

  return null;
}

export default function Stage({
  quality = 'high',
  portalOpen = false,
  onSkillHover,
  onMilestone,
  onReady,
}) {
  return (
    <Canvas
      className="ae-canvas"
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
      /* Transparent, and it has to stay that way: the giant display
         type on the hero, the neural map and the portal is painted by
         the document *underneath* this canvas, and is eclipsed by the
         3D objects drawn over it. An opaque clear colour would erase
         the whole depth trick. The void itself is a CSS background. */
      gl={{
        antialias: quality === 'high',
        powerPreference: 'high-performance',
        alpha: true,
        stencil: false,
      }}
      camera={{ fov: 42, near: 0.1, far: 260, position: [0, 0, 13.5] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearAlpha(0);
        scene.fog = new THREE.FogExp2(PALETTE.void, 0.012);
      }}
    >
      {/* A low ambient plus one rim. Everything else is per-station,
          because each composition needs its own key. */}
      <ambientLight intensity={0.35} color="#9fb4c8" />
      <directionalLight position={[-6, 8, 6]} intensity={0.5} color={PALETTE.cyan} />

      <Suspense fallback={null}>
        <Studio />
        <Starfield />
        <Rig />

        <Station index={STATION_INDEX.hero} dolly={1.2}>
          <IntelligenceCore />
        </Station>

        <Station index={STATION_INDEX.intro}>
          <Constellation />
        </Station>

        <Station index={STATION_INDEX.profile}>
          <ProfileHalo />
        </Station>

        <Station index={STATION_INDEX.skills}>
          <NeuralMap onHover={onSkillHover} />
        </Station>

        <Station index={STATION_INDEX['work-1']} z={-1}>
          <LanguageFilaments />
        </Station>
        <Station index={STATION_INDEX['work-2']} z={-1}>
          <MediaOrbit />
        </Station>
        <Station index={STATION_INDEX['work-3']} z={-1}>
          <VisionAperture />
        </Station>
        <Station index={STATION_INDEX['work-4']} z={-1}>
          <KnowledgeArchitecture />
        </Station>

        <Station index={STATION_INDEX.journey}>
          <Trajectory onActive={onMilestone} />
        </Station>

        <Station index={STATION_INDEX.research}>
          <ResearchLab />
        </Station>

        {/* The only station that unmounts: five remote textures should
            not be fetched by someone who never scrolls this far. */}
        <Station index={STATION_INDEX.creative} lazy>
          <Exhibition />
        </Station>

        <Station index={STATION_INDEX.philosophy}>
          <Doctrine />
        </Station>

        <Station index={STATION_INDEX.contact} dolly={0.8}>
          <Portal open={portalOpen} />
        </Station>

        <Preload all />
      </Suspense>

      <Grade quality={quality} />
      <AdaptiveDpr pixelated={false} />
      <FirstFrame onReady={onReady} />
    </Canvas>
  );
}
