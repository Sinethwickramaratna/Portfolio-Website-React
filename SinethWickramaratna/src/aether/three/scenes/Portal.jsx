import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, STATION_INDEX } from '../../config';
import { holo, chrome, chromeDark, emissive } from '../materials';
import { mulberry, range } from '../rng';

/**
 * The portal.
 *
 * The last thing on the site and the only one that is symmetrical —
 * after twelve stations of deliberate asymmetry, a centred ring reads
 * as arrival. A machined chrome collar, a threshold of light inside it,
 * an accretion of particles being drawn in, and a tilt that follows the
 * cursor closely enough to feel like the ring is aware of you.
 *
 * `open` is raised once the visitor commits to the call to action; the
 * aperture widens and the intake accelerates.
 */

const INDEX = STATION_INDEX.contact;

export default function Portal({ open = false }) {
  const group = useRef();
  const collarRef = useRef();
  const thresholdRef = useRef();
  const innerRef = useRef();
  const intakeRef = useRef();
  const ringRefs = [useRef(), useRef(), useRef(), useRef()];
  const openRef = useRef(0);

  /* Particles on inbound spirals. Each keeps its own radius and angular
     speed, so the intake looks like accretion rather than a vortex
     preset. */
  const intake = useMemo(() => {
    const rng = mulberry(2026);
    const n = 700;
    return {
      count: n,
      seed: Array.from({ length: n }, () => ({
        r0: range(rng, 3.4, 11),
        a0: rng() * Math.PI * 2,
        speed: range(rng, 0.05, 0.22),
        pull: range(rng, 0.012, 0.05),
        y: range(rng, -3, 3),
        offset: rng(),
      })),
      geometry: (() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array(n * 3), 3)
        );
        return g;
      })(),
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(0.05, delta);
    const g = group.current;
    if (!g) return;

    openRef.current += ((open ? 1 : 0) - openRef.current) * (1 - Math.exp(-3 * dt));
    const o = openRef.current;

    /* Close tracking. The portal is the one object allowed to respond
       to the cursor almost immediately. */
    g.rotation.y = flight.px * 0.5;
    g.rotation.x = -flight.py * 0.38;

    if (collarRef.current) collarRef.current.rotation.z = t * 0.04;
    if (innerRef.current) {
      innerRef.current.rotation.z = -t * 0.11;
      innerRef.current.scale.setScalar(1 + o * 0.12);
    }
    if (thresholdRef.current) {
      const breathe = 0.55 + Math.sin(t * 0.9) * 0.08;
      thresholdRef.current.material.opacity = breathe * (0.16 + o * 0.3);
      thresholdRef.current.scale.setScalar(1 + o * 0.2);
    }

    ringRefs.forEach((r, i) => {
      if (!r.current) return;
      r.current.rotation.z = t * (0.03 + i * 0.025) * (i % 2 ? -1 : 1);
      r.current.rotation.x = Math.sin(t * 0.15 + i) * 0.12;
    });

    const pos = intake.geometry.attributes.position.array;
    const speedScale = 1 + o * 1.8;
    for (let i = 0; i < intake.count; i += 1) {
      const s = intake.seed[i];
      /* Radius decays on a loop; when a particle reaches the ring it is
         reissued from the outside. */
      const cycle = (s.offset + t * s.pull * speedScale) % 1;
      const r = s.r0 * (1 - cycle) + 2.5 * cycle;
      const a = s.a0 + t * s.speed * speedScale + cycle * 3.2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = s.y * (1 - cycle * 0.8) + Math.sin(a * 2) * 0.15;
      pos[i * 3 + 2] = Math.sin(a) * r * 0.55 - cycle * 2.5;
    }
    intake.geometry.attributes.position.needsUpdate = true;
    if (intakeRef.current) {
      intakeRef.current.material.opacity = 0.35 + o * 0.35;
    }
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 0, 1.5]} color={PALETTE.cyan} intensity={7} distance={16} />
      <pointLight position={[0, 0, -3]} color={PALETTE.violet} intensity={3.5} distance={14} />

      {/* machined collar */}
      <group ref={collarRef}>
        <mesh>
          <torusGeometry args={[3.0, 0.14, 20, 160]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
        <mesh>
          <torusGeometry args={[3.28, 0.03, 12, 160]} />
          <meshStandardMaterial {...chromeDark} />
        </mesh>
        {/* mounting lugs — the detail that makes it built rather than drawn */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 3.5, Math.sin(a) * 3.5, 0]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.28, 0.045, 0.09]} />
              <meshStandardMaterial {...chromeDark} />
            </mesh>
          );
        })}
      </group>

      {/* the threshold itself */}
      {/* The threshold is a suggestion of light, not a lamp: the display
          type sits behind this and has to survive it. */}
      <mesh ref={thresholdRef}>
        <circleGeometry args={[2.88, 96]} />
        <meshBasicMaterial
          {...holo(PALETTE.cyan, 0.14)}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group ref={innerRef}>
        <mesh>
          <torusGeometry args={[2.62, 0.012, 8, 160]} />
          <meshStandardMaterial {...emissive(PALETTE.cyan, 4)} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.1, 0.006, 6, 140]} />
          <meshBasicMaterial {...holo(PALETTE.rose, 0.45)} />
        </mesh>
      </group>

      {[4.3, 5.4, 6.8, 8.4].map((r, i) => (
        <mesh key={r} ref={ringRefs[i]}>
          <torusGeometry args={[r, 0.004, 3, 200]} />
          <meshBasicMaterial {...holo(i === 2 ? PALETTE.violet : PALETTE.cyan, 0.24 - i * 0.04)} />
        </mesh>
      ))}

      <points ref={intakeRef} geometry={intake.geometry}>
        <pointsMaterial
          size={0.028}
          sizeAttenuation
          color={PALETTE.cyan}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
