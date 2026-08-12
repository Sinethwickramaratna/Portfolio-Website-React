import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SECTIONS, cameraAnchor, envPosition } from '../worldConfig';
import { world } from '../state/worldState';

/**
 * The camera is the navigation.
 *
 * Two Catmull-Rom splines run the length of the world: one the camera
 * rides, one its gaze follows. Because the position spline rests a fixed
 * distance *in front* of each environment, every leg of the journey
 * passes straight through the environment it is leaving — that is what
 * produces the fly-through at the hero and between every stop after it.
 */
export default function CameraRig() {
  const { camera } = useThree();

  const { posCurve, lookCurve } = useMemo(() => {
    const toVec = (fn) =>
      SECTIONS.map((_, i) => new THREE.Vector3(...fn(i)));

    return {
      posCurve: new THREE.CatmullRomCurve3(
        toVec(cameraAnchor),
        false,
        'catmullrom',
        0.4
      ),
      lookCurve: new THREE.CatmullRomCurve3(
        toVec(envPosition),
        false,
        'catmullrom',
        0.4
      ),
    };
  }, []);

  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const baseFov = useRef(camera.fov);

  // Damped lean-in applied when the visitor selects an object.
  const focus = useRef(new THREE.Vector3());
  const focusTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const t = Math.min(1, Math.max(0, world.progress));

    posCurve.getPointAt(t, pos.current);
    lookCurve.getPointAt(t, look.current);

    // Lean toward whatever the visitor has selected.
    focusTarget.current.set(world.focus.x, world.focus.y, world.focus.z);
    focus.current.lerp(focusTarget.current, 0.055);

    // Gravity system: the pointer nudges the camera through the space
    // without ever taking control of it.
    camera.position.set(
      pos.current.x + world.pointer.x * 3.4 + focus.current.x,
      pos.current.y - world.pointer.y * 2.4 + focus.current.y,
      pos.current.z + focus.current.z
    );

    camera.lookAt(look.current);

    // Bank into the turn, and widen slightly with speed. Both are small
    // enough to feel rather than notice.
    const speed = THREE.MathUtils.clamp(world.velocity, -1.4, 1.4);
    camera.rotation.z += -world.pointer.x * 0.022 + speed * 0.035;

    const targetFov = baseFov.current + Math.abs(speed) * 7;
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * 0.08;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
