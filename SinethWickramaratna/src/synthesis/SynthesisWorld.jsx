import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from './worldConfig';
import CameraRig from './world/CameraRig';
import { ChromeEnvironment, TravellingLights, StarField } from './world/Atmosphere';

import CrystallineCore from './environments/CrystallineCore';
import DnaHelix from './environments/DnaHelix';
import NeuralCity from './environments/NeuralCity';
import ProjectOrbit from './environments/ProjectOrbit';
import Museum from './environments/Museum';
import Lab from './environments/Lab';
import LightRiver from './environments/LightRiver';
import Portal from './environments/Portal';

/**
 * The whole universe, in one WebGL context.
 *
 * Every environment lives in the same scene at its own point along the
 * -Z axis; EnvGroup hides the ones the camera is not near. That keeps a
 * single canvas, single camera and single lighting rig for the entire
 * site — no per-section canvases, no context thrashing between them.
 */
export default function SynthesisWorld({ selection, onSelect, active }) {
  return (
    <div className="synthesis-canvas">
      <Canvas
        dpr={[1, 1.65]}
        /* Transparent, so the giant display type rendered *underneath*
           the canvas is occluded by the 3D objects themselves. */
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        camera={{ fov: 50, near: 0.5, far: 3200, position: [0, 0, 60] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <fogExp2 attach="fog" args={[PALETTE.void, 0.0041]} />

        <ChromeEnvironment />
        <TravellingLights />
        <CameraRig />
        <StarField />

        <Suspense fallback={null}>
          <CrystallineCore />

          <DnaHelix
            labels={active === 1}
            selected={selection.dna}
            onSelect={(key) => onSelect('dna', key)}
          />

          <NeuralCity
            labels={active === 2}
            selected={selection.city}
            onSelect={(key) => onSelect('city', key)}
          />

          <ProjectOrbit
            labels={active === 3}
            selected={selection.project}
            onSelect={(id) => onSelect('project', id)}
          />

          <Museum
            labels={active === 4}
            selected={selection.piece}
            onSelect={(id) => onSelect('piece', id)}
          />

          <Lab />
          <LightRiver labels={active === 6} />
          <Portal open={selection.portal} />
        </Suspense>
      </Canvas>
    </div>
  );
}
