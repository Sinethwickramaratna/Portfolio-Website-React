import { useEffect, useMemo, useRef } from 'react';
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

  /**
   * Radial falloff for the light beyond the aperture.
   *
   * A flat additive disc at this scale simply saturates to solid cyan
   * and swallows the copy sitting on top of it. Painting the gradient
   * into a texture keeps a bright core with a soft edge — which is what
   * actually reads as depth behind an opening.
   */
  const discTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const g = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    g.addColorStop(0, 'rgba(180, 245, 255, 0.95)');
    g.addColorStop(0.28, 'rgba(0, 229, 255, 0.42)');
    g.addColorStop(0.62, 'rgba(123, 97, 255, 0.14)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => () => discTexture.dispose(), [discTexture]);

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
      disc.current.material.opacity = 0.14 + aperture * 0.3;
      disc.current.scale.setScalar(0.72 + aperture * 0.3);
    }

    if (shimmer.current) {
      shimmer.current.rotation.z -= delta * 0.22;
      shimmer.current.material.opacity =
        0.05 + Math.sin(t * 1.4) * 0.02 + aperture * 0.07;
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
          <planeGeometry args={[RING_RADIUS * 2.1, RING_RADIUS * 2.1]} />
          <meshBasicMaterial
            map={discTexture}
            transparent
            opacity={0.35}
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
