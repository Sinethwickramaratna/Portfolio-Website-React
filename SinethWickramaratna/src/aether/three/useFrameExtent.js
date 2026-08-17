import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The visible world rectangle, in world units, measured every frame.
 *
 * Compositions that have to sit clear of DOM text need this. The text is
 * positioned in screen units — pinned to a gutter, sized in vw — while
 * the objects are positioned in world units, and the mapping between
 * the two changes with the viewport aspect, with the camera's dolly and
 * with the narrow-frame pull-back. Place an object at a fixed world x
 * and it will clear the read-outs at one window size and sit underneath
 * them at another.
 *
 * Drei's `useThree(s => s.viewport)` cannot answer this, because the rig
 * mutates the camera directly each frame rather than through React —
 * so the cached viewport reflects wherever the camera started.
 *
 * Returns a ref holding `{ hw, hh }`: half-width and half-height of what
 * the camera can see at the plane the scene sits on. Read it inside
 * your own useFrame and place things as fractions of it.
 */
export function useFrameExtent(planeZ = 0) {
  const camera = useThree((s) => s.camera);
  const extent = useRef({ hw: 9, hh: 5 });

  useFrame(() => {
    const dist = Math.abs(camera.position.z - planeZ);
    const hh = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * dist;
    extent.current.hh = hh;
    extent.current.hw = hh * camera.aspect;
  });

  return extent;
}
