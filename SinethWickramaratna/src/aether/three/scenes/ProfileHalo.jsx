import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, STATION_INDEX } from '../../config';
import { holo, chrome, emissive } from '../materials';
import { mulberry } from '../rng';

/**
 * The structure behind the portrait.
 *
 * The portrait itself is a DOM image — it has to be crisp, and it has
 * to bleed past the edge of the section, which is a layout job, not a
 * 3D one. What lives here is everything *behind* the person: a broken
 * chrome halo, nested orbital curves, and a slow arc of nodes tracking
 * around them. Built off-centre because the portrait is off-centre.
 */

const INDEX = STATION_INDEX.profile;
/* Sits behind and around the portrait, which is bled off the right
   edge. Placed left, the arcs would run straight through the body copy
   and make it hard to read for no compositional gain. */
const OFFSET = [3.4, 0.6, -2.0];

export default function ProfileHalo() {
  const group = useRef();
  const haloRef = useRef();
  const arcRefs = [useRef(), useRef(), useRef(), useRef()];
  const beadsRef = useRef();

  /* An arc, not a ring: the halo is deliberately incomplete so it reads
     as a fragment of a larger machine rather than a decorative circle. */
  const haloGeo = useMemo(
    () => new THREE.TorusGeometry(3.35, 0.055, 12, 160, Math.PI * 1.45),
    []
  );

  const arcs = useMemo(
    () => [
      { r: 4.3, thickness: 0.008, tilt: [0.5, 0.2, 0.3], color: PALETTE.cyan, o: 0.5 },
      { r: 5.1, thickness: 0.006, tilt: [-0.35, 0.7, -0.2], color: PALETTE.cyan, o: 0.3 },
      { r: 6.0, thickness: 0.005, tilt: [1.15, 0.1, 0.55], color: PALETTE.violet, o: 0.26 },
      { r: 3.7, thickness: 0.01, tilt: [0.15, -0.5, -0.4], color: PALETTE.rose, o: 0.18 },
    ],
    []
  );

  const beads = useMemo(() => {
    const rng = mulberry(7714);
    return Array.from({ length: 14 }, () => ({
      arc: Math.floor(rng() * 4),
      a: rng() * Math.PI * 2,
      speed: (0.08 + rng() * 0.14) * (rng() > 0.5 ? 1 : -1),
      size: 0.5 + rng() * 0.9,
    }));
  }, []);

  const beadGeo = useMemo(() => new THREE.SphereGeometry(0.055, 10, 10), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const euler = useMemo(() => new THREE.Euler(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    const d = flight.station - INDEX;
    g.rotation.y = flight.px * 0.22 - d * 0.12;
    g.rotation.x = -flight.py * 0.14;

    if (haloRef.current) {
      haloRef.current.rotation.z = -0.6 + t * 0.05;
      haloRef.current.rotation.x = Math.sin(t * 0.16) * 0.12;
    }

    arcRefs.forEach((r, i) => {
      if (!r.current) return;
      r.current.rotation.z = t * (0.05 + i * 0.02) * (i % 2 ? -1 : 1);
    });

    if (beadsRef.current) {
      beads.forEach((b, i) => {
        const arc = arcs[b.arc];
        const a = b.a + t * b.speed;
        euler.set(...arc.tilt);
        tmp.position
          .set(Math.cos(a) * arc.r, Math.sin(a) * arc.r, 0)
          .applyEuler(euler);
        tmp.scale.setScalar(b.size * (0.8 + Math.sin(t * 2 + i) * 0.2));
        tmp.updateMatrix();
        beadsRef.current.setMatrixAt(i, tmp.matrix);
      });
      beadsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group} position={OFFSET}>
      <pointLight position={[2.5, 1.5, 3]} color={PALETTE.cyan} intensity={7} distance={14} />
      <pointLight position={[-3, -2, 1]} color={PALETTE.violet} intensity={3} distance={12} />

      <mesh ref={haloRef} geometry={haloGeo}>
        <meshStandardMaterial {...chrome} />
      </mesh>

      {arcs.map((arc, i) => (
        <group key={i} rotation={arc.tilt}>
          <mesh ref={arcRefs[i]}>
            <torusGeometry args={[arc.r, arc.thickness, 3, 200]} />
            <meshBasicMaterial {...holo(arc.color, arc.o)} />
          </mesh>
        </group>
      ))}

      <instancedMesh ref={beadsRef} args={[beadGeo, null, beads.length]}>
        <meshStandardMaterial {...emissive(PALETTE.cyan, 3.2)} />
      </instancedMesh>
    </group>
  );
}
