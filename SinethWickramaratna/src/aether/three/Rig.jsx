import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { flight } from '../state/flight';
import { STATIONS } from '../config';

/**
 * Per-station camera placement.
 *
 * The camera never cuts. It is on one continuous dolly for the whole
 * visit, and these are the marks it hits — distance from the world
 * origin, a little lateral offset so compositions are not all centred,
 * and the field of view, which is what actually sells "cinematic":
 * wide and close for the environments you are inside, long and flat for
 * the ones you are looking at.
 */
const MARKS = {
  hero: { z: 13.5, x: 0, y: 0, fov: 42 },
  intro: { z: 15.0, x: 0.6, y: 0.2, fov: 40 },
  profile: { z: 12.0, x: -1.4, y: 0.1, fov: 38 },
  skills: { z: 15.5, x: 0, y: 0, fov: 46 },
  'work-1': { z: 12.6, x: 1.2, y: 0, fov: 40 },
  'work-2': { z: 13.0, x: -1.2, y: 0, fov: 40 },
  'work-3': { z: 11.8, x: 1.0, y: 0.2, fov: 42 },
  'work-4': { z: 13.2, x: -1.0, y: -0.1, fov: 40 },
  journey: { z: 16.5, x: 0, y: 0.4, fov: 44 },
  research: { z: 14.2, x: 0.8, y: 0, fov: 41 },
  creative: { z: 10.5, x: 0, y: 0, fov: 52 },
  philosophy: { z: 15.0, x: -0.6, y: 0, fov: 38 },
  contact: { z: 11.0, x: 0, y: 0, fov: 44 },
};

const TRACK = STATIONS.map((s) => MARKS[s.id] ?? MARKS.hero);

function sample(t) {
  const i = Math.max(0, Math.min(TRACK.length - 1, Math.floor(t)));
  const j = Math.min(TRACK.length - 1, i + 1);
  const f = Math.max(0, Math.min(1, t - i));
  // Smoothstep between marks — a linear blend makes the arrival at each
  // station read as a stop rather than a settle.
  const e = f * f * (3 - 2 * f);
  const a = TRACK[i];
  const b = TRACK[j];
  return {
    z: a.z + (b.z - a.z) * e,
    x: a.x + (b.x - a.x) * e,
    y: a.y + (b.y - a.y) * e,
    fov: a.fov + (b.fov - a.fov) * e,
  };
}

const damp = (c, t, l, dt) => c + (t - c) * (1 - Math.exp(-l * dt));

/**
 * How far to pull back so a composition still fits the frame.
 *
 * Every scene in this world is arranged for a wide screen — nodes at
 * x = ±6, a trajectory running to x = ±10. On a portrait phone the
 * frustum is a third as wide and half of each composition falls outside
 * it, which is the single biggest thing that breaks the site on a
 * narrow viewport.
 *
 * Rather than give thirteen scenes their own breakpoints, the camera
 * retreats: the horizontal field is what matters, so the distance is
 * scaled by how far the viewport's aspect falls short of the one the
 * work was composed in. The exponent softens it — a literal correction
 * on a tall phone would push everything to a speck.
 */
const COMPOSED_FOR = 1.6;

function fitDistance(aspect) {
  const need = COMPOSED_FOR / Math.max(aspect, 0.3);
  return Math.min(2.35, Math.max(1, need ** 0.82));
}

export default function Rig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const state = useRef({ z: 13.5, x: 0, y: 0, fov: 42, roll: 0 });

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const mark = sample(flight.station);
    const s = state.current;
    const fit = fitDistance(size.width / Math.max(1, size.height));
    flight.fit = fit;

    /* Parallax is applied on top of the mark, not instead of it, and is
       small — the pointer suggests the camera, it does not drive it. */
    const targetX = mark.x + flight.px * 1.15;
    const targetY = mark.y + flight.py * 0.75;

    s.x = damp(s.x, targetX, 2.6, dt);
    s.y = damp(s.y, targetY, 2.6, dt);
    s.z = damp(s.z, mark.z * fit, 3.0, dt);
    s.fov = damp(s.fov, mark.fov, 3.0, dt);
    /* A degree of roll against scroll direction. Barely perceptible, and
       the entire reason the flight feels like it has weight. */
    s.roll = damp(s.roll, -flight.velocity * 0.05, 2.0, dt);

    camera.position.set(s.x, s.y, s.z);
    // lookAt writes the whole rotation, so the roll goes on afterwards.
    camera.lookAt(s.x * 0.25, s.y * 0.25, 0);
    camera.rotation.z += s.roll;

    if (Math.abs(camera.fov - s.fov) > 0.001) {
      camera.fov = s.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
