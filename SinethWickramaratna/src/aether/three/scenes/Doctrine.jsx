import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, STATION_INDEX } from '../../config';
import { holo, chrome, acrylic, emissive } from '../materials';

/**
 * The doctrine object.
 *
 * Four words, four states. The object literally evolves as the section
 * is read: a raw block subdivides, gains a shell, opens, and finally
 * fractures into a swarm — think, build, experiment, evolve — driven by
 * position in the section rather than by a timer, so it is the reader
 * who does the evolving.
 *
 * Orbital rings run through the plane the display type sits on, which
 * is what makes the words and the object read as one composition
 * instead of a headline with a graphic behind it.
 */

const INDEX = STATION_INDEX.philosophy;

export default function Doctrine() {
  const group = useRef();
  const bodyRef = useRef();
  const shellRef = useRef();
  const cageRef = useRef();
  const swarmRef = useRef();
  const ringRefs = [useRef(), useRef(), useRef()];

  const swarm = useMemo(() => {
    const n = 46;
    const dirs = [];
    for (let i = 0; i < n; i += 1) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963;
      dirs.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
    }
    return dirs;
  }, []);

  const shardGeo = useMemo(() => new THREE.TetrahedronGeometry(0.13, 0), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    /* 0 → 1 across the section; the four words map to quarters of it. */
    const phase = THREE.MathUtils.clamp(flight.station - INDEX + 0.5, 0, 1);

    g.rotation.y = flight.px * 0.3 + Math.sin(t * 0.08) * 0.16;
    g.rotation.x = -flight.py * 0.2;

    if (bodyRef.current) {
      bodyRef.current.rotation.y = t * 0.13;
      bodyRef.current.rotation.x = t * 0.07;
      // Contracts as the shell opens: the core gives up mass to the swarm.
      bodyRef.current.scale.setScalar(1 - phase * 0.45);
    }

    const shellScale = 1.25 + phase * 1.2;
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.09;
      shellRef.current.scale.setScalar(shellScale);
      shellRef.current.material.opacity = 0.2 * (1 - phase) + 0.03;
    }
    if (cageRef.current) {
      cageRef.current.rotation.y = -t * 0.09;
      cageRef.current.scale.setScalar(shellScale);
      cageRef.current.material.opacity = 0.24 * (1 - phase * 0.6);
    }

    ringRefs.forEach((r, i) => {
      if (!r.current) return;
      r.current.rotation.z = t * (0.06 + i * 0.04) * (i % 2 ? -1 : 1);
      r.current.scale.setScalar(1 + phase * (0.3 + i * 0.15));
    });

    if (swarmRef.current) {
      /* The swarm only exists in the back half — the fracture is the
         last movement, not a permanent state. */
      const burst = THREE.MathUtils.smoothstep(phase, 0.35, 1);
      swarm.forEach((d, i) => {
        const r = 0.9 + burst * (2.6 + (i % 5) * 0.42);
        const spin = t * (0.1 + (i % 7) * 0.02);
        tmp.position.set(
          d.x * r * Math.cos(spin) - d.z * r * Math.sin(spin),
          d.y * r + Math.sin(t * 0.6 + i) * 0.08,
          d.x * r * Math.sin(spin) + d.z * r * Math.cos(spin)
        );
        tmp.rotation.set(t * 0.4 + i, t * 0.25, 0);
        tmp.scale.setScalar(0.2 + burst * 0.9);
        tmp.updateMatrix();
        swarmRef.current.setMatrixAt(i, tmp.matrix);
      });
      swarmRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 0, 3]} color={PALETTE.cyan} intensity={6} distance={14} />
      <pointLight position={[-4, 2, -2]} color={PALETTE.violet} intensity={3} distance={14} />

      <mesh ref={bodyRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial {...chrome} flatShading />
      </mesh>

      {/* Acrylic and a wire cage rather than transmission. Refraction is
          a second render pass per object, and at this scale — the shell
          grows to fill the middle of the section — it turns into an
          opaque grey mass sitting on top of the display type. Two thin
          surfaces read as glass here and cost nothing. */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial {...acrylic} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={cageRef}>
        <icosahedronGeometry args={[1.52, 0]} />
        <meshBasicMaterial {...holo(PALETTE.cyan, 0.22)} wireframe />
      </mesh>

      {[
        [0.15, 0, 0],
        [1.42, 0.3, 0.2],
        [-0.7, 0.9, -0.4],
      ].map((tilt, i) => (
        <group key={i} rotation={tilt}>
          <mesh ref={ringRefs[i]}>
            <torusGeometry args={[3.6 + i * 1.4, 0.005, 3, 200]} />
            <meshBasicMaterial {...holo(i === 2 ? PALETTE.rose : PALETTE.cyan, 0.4 - i * 0.09)} />
          </mesh>
        </group>
      ))}

      <instancedMesh ref={swarmRef} args={[shardGeo, null, swarm.length]}>
        <meshStandardMaterial {...emissive(PALETTE.cyan, 1.4)} />
      </instancedMesh>
    </group>
  );
}
