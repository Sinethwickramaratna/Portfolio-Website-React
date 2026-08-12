import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../state/flight';
import { PALETTE, STATIONS, STATION_SPREAD } from '../config';
import { mulberry, range } from './rng';

/**
 * The medium.
 *
 * A single tall column of particles spanning the whole flight, moving
 * at a fraction of the world's speed. It is the only thing on screen
 * during every second of the visit, which is exactly why it has to be
 * almost invisible: three depth layers, each dimmer and slower than the
 * one in front, so the void has parallax without ever having texture.
 */

const HEIGHT = STATIONS.length * STATION_SPREAD;

function layer(seed, count, spread, depth) {
  const rng = mulberry(seed);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    pos[i * 3] = range(rng, -spread, spread);
    pos[i * 3 + 1] = range(rng, -HEIGHT * 0.6, HEIGHT * 0.6);
    pos[i * 3 + 2] = range(rng, -depth, depth * 0.3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return geo;
}

export default function Starfield() {
  const near = useRef();
  const mid = useRef();
  const far = useRef();

  const layers = useMemo(
    () => [
      { geo: layer(101, 300, 22, 8), size: 0.05, opacity: 0.5, rate: 0.85 },
      { geo: layer(202, 520, 34, 22), size: 0.035, opacity: 0.3, rate: 0.5 },
      { geo: layer(303, 700, 52, 46), size: 0.022, opacity: 0.16, rate: 0.22 },
    ],
    []
  );

  const refs = [near, mid, far];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const y = flight.station * STATION_SPREAD;
    refs.forEach((r, i) => {
      if (!r.current) return;
      const rate = layers[i].rate;
      r.current.position.y = y * rate;
      r.current.position.x = flight.px * (2.2 - i * 0.7);
      r.current.rotation.y = t * 0.004 * (i + 1);
    });
  });

  return (
    <group>
      {layers.map((l, i) => (
        <points key={i} ref={refs[i]} geometry={l.geo}>
          <pointsMaterial
            size={l.size}
            sizeAttenuation
            color={i === 0 ? PALETTE.bright : PALETTE.cyan}
            transparent
            opacity={l.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      ))}
    </group>
  );
}
