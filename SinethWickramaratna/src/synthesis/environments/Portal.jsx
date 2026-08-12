import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnvGroup from '../world/EnvGroup';
import { chrome } from '../world/materials';
import { PALETTE } from '../worldConfig';
import { world, localProgress } from '../state/worldState';

const RING_RADIUS = 26;

/**
 * THE PORTAL — the last thing in the world.
 *
 * A chrome ring around a disc of light. As the camera makes its final
 * approach the aperture opens: the ring widens, the disc brightens, and
 * the DOM overlay above it resolves into the contact panel.
 */
export default function Portal({ open }) {
  const group = useRef(null);
  const ring = useRef(null);
  const disc = useRef(null);
  const shimmer = useRef(null);

  /* Concentric guide rings that drift inward toward the aperture. */
  const guides = useMemo(
    () => [1.35, 1.7, 2.1, 2.6].map((scale, i) => ({ scale, i })),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // 0 → 1 across the final approach.
    const approach = THREE.MathUtils.clamp(localProgress(7) + 1, 0, 1);
    const aperture = Math.max(approach, open ? 1 : 0);

    if (group.current) {
      group.current.rotation.z = world.pointer.x * 0.05;
      group.current.position.x = world.pointer.x * -3;
      group.current.position.y = world.pointer.y * -2;
    }

    if (ring.current) {
      ring.current.rotation.z += delta * 0.06;
      ring.current.scale.setScalar(0.86 + aperture * 0.2);
    }

    if (disc.current) {
      disc.current.material.opacity = 0.06 + aperture * 0.5;
      disc.current.scale.setScalar(0.6 + aperture * 0.55);
    }

    if (shimmer.current) {
      shimmer.current.rotation.z -= delta * 0.22;
      shimmer.current.material.opacity = 0.1 + Math.sin(t * 1.4) * 0.05 + aperture * 0.2;
    }
  });

  return (
    <EnvGroup index={7} range={2}>
      <group ref={group}>
        {/* Chrome aperture ring */}
        <mesh ref={ring}>
          <torusGeometry args={[RING_RADIUS, 1.5, 24, 120]} />
          <meshStandardMaterial {...chrome} roughness={0.09} />
        </mesh>

        {/* The light beyond */}
        <mesh ref={disc} position={[0, 0, -2]}>
          <circleGeometry args={[RING_RADIUS, 96]} />
          <meshBasicMaterial
            color={PALETTE.cyan}
            transparent
            opacity={0.2}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Rotating shimmer across the aperture */}
        <mesh ref={shimmer} position={[0, 0, -1]}>
          <ringGeometry args={[RING_RADIUS * 0.35, RING_RADIUS * 0.98, 96, 1]} />
          <meshBasicMaterial
            color={PALETTE.violet}
            transparent
            opacity={0.14}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Guide rings receding toward the portal */}
        {guides.map(({ scale, i }) => (
          <mesh key={scale} position={[0, 0, 14 + i * 16]}>
            <torusGeometry args={[RING_RADIUS * scale, 0.16, 8, 96]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? PALETTE.cyan : PALETTE.violet}
              transparent
              opacity={0.22 - i * 0.04}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </EnvGroup>
  );
}
