import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnvGroup from '../world/EnvGroup';
import { chrome, glass } from '../world/materials';
import { PALETTE } from '../worldConfig';
import { world, localProgress } from '../state/worldState';

/** Deterministic pseudo-random so the sculpture is identical on every
 *  load — a hero that reshuffles itself reads as an accident. */
function seeded(i, salt = 1) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const SHARD_COUNT = 18;

/**
 * THE VOID — the object the visitor meets first, and flies through.
 *
 * Built from the three materials in combination: a chrome nucleus, a
 * cloud of chrome shards, a transmissive glass shell, and holographic
 * line work threading between them. As the camera approaches, the
 * shards disperse outward so the interior opens up rather than the
 * camera clipping through a solid mass.
 */
export default function CrystallineCore() {
  const nucleus = useRef(null);
  const shards = useRef(null);
  const shell = useRef(null);
  const lattice = useRef(null);
  const halo = useRef(null);

  const shardData = useMemo(
    () =>
      Array.from({ length: SHARD_COUNT }, (_, i) => ({
        // Kept outside the glass shell (r = 13) so the shards read as a
        // cloud around the core rather than debris trapped inside it.
        radius: 15 + seeded(i, 1) * 12,
        theta: seeded(i, 2) * Math.PI * 2,
        phi: Math.acos(2 * seeded(i, 3) - 1),
        scale: 0.9 + seeded(i, 4) * 2.4,
        spin: (seeded(i, 5) - 0.5) * 0.6,
        tilt: seeded(i, 6) * Math.PI,
      })),
    []
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const local = THREE.MathUtils.clamp(localProgress(0), -1, 1);

    // Opening up as the camera closes in.
    const disperse = 1 + Math.max(0, local) * 1.9;

    if (nucleus.current) {
      nucleus.current.rotation.y += delta * 0.14;
      nucleus.current.rotation.x += delta * 0.06;
      const breathe = 1 + Math.sin(t * 0.5) * 0.04;
      nucleus.current.scale.setScalar(breathe);
    }

    if (shell.current) {
      shell.current.rotation.y -= delta * 0.05;
      shell.current.rotation.z += delta * 0.02;
      shell.current.scale.setScalar(disperse * 0.98);
    }

    if (lattice.current) {
      lattice.current.rotation.y += delta * 0.09;
      lattice.current.rotation.x -= delta * 0.04;
      lattice.current.scale.setScalar(disperse);
    }

    if (halo.current) {
      halo.current.rotation.z += delta * 0.12;
      halo.current.lookAt(state.camera.position);
    }

    // Instanced shard cloud.
    const mesh = shards.current;
    if (mesh) {
      shardData.forEach((s, i) => {
        const r = s.radius * disperse;
        const theta = s.theta + t * 0.08 * s.spin;
        const phi = s.phi + Math.sin(t * 0.2 + i) * 0.06;

        dummy.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * 0.75,
          r * Math.sin(phi) * Math.sin(theta)
        );
        dummy.rotation.set(s.tilt + t * 0.2 * s.spin, theta, s.tilt);
        dummy.scale.setScalar(s.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;

      // Gravity: the whole sculpture leans toward the cursor.
      mesh.parent.rotation.y = world.pointer.x * 0.16;
      mesh.parent.rotation.x = world.pointer.y * 0.1;
    }
  });

  return (
    <EnvGroup index={0} range={1.6}>
      {/* Chrome nucleus */}
      <mesh ref={nucleus}>
        <icosahedronGeometry args={[5.2, 0]} />
        <meshStandardMaterial {...chrome} />
      </mesh>

      {/* Dispersing shard cloud */}
      <instancedMesh ref={shards} args={[undefined, undefined, SHARD_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial {...chrome} roughness={0.22} />
      </instancedMesh>

      {/* Glass shell — the only transmissive object in the world, so the
          extra render pass it costs is affordable. */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[13, 1]} />
        <meshPhysicalMaterial {...glass} thickness={2.2} />
      </mesh>

      {/* Holographic lattice — thin energy lines */}
      <lineSegments ref={lattice}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(21, 1)]} />
        <lineBasicMaterial
          color={PALETTE.cyan}
          transparent
          opacity={0.22}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Faint bloom stand-in — an additive disc that always faces the
          camera, cheaper than a full post-processing pass. */}
      <mesh ref={halo} scale={2.2}>
        <circleGeometry args={[18, 48]} />
        <meshBasicMaterial
          color={PALETTE.cyan}
          transparent
          opacity={0.05}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </EnvGroup>
  );
}
