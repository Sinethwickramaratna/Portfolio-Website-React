import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import EnvGroup from '../world/EnvGroup';
import { chrome } from '../world/materials';
import { PALETTE } from '../worldConfig';
import { world, localProgress } from '../state/worldState';
import galleryImages from '../../data/galleryImages.json';

const WALL_X = 30;
const PIECE_COUNT = 10;

/**
 * Loads a remote texture without suspending.
 *
 * The gallery images are hosted off-domain, so a CORS failure is a real
 * possibility. Suspense would take the whole scene down with it; this
 * returns null on failure instead and the frame falls back to a plain
 * chrome panel.
 */
function useSafeTexture(url) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!url) return undefined;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      url,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        setTexture(tex);
      },
      undefined,
      () => {
        /* leave null — the frame renders without artwork */
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}

function Piece({ item, position, rotation, onSelect, selected, labels }) {
  const texture = useSafeTexture(item.image);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const isActive = selected === item.id;
  const isHot = hovered || isActive;

  const aspect = texture
    ? texture.image.width / texture.image.height
    : 0.75;
  const height = 18;
  const width = height * aspect;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.4 + position[2] * 0.1) * 0.7;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Chrome frame */}
      <mesh position={[0, 0, -0.35]}>
        <boxGeometry args={[width + 1.4, height + 1.4, 0.5]} />
        <meshStandardMaterial
          {...chrome}
          roughness={isHot ? 0.1 : 0.24}
          emissive={isActive ? PALETTE.magenta : PALETTE.cyan}
          emissiveIntensity={isHot ? 0.4 : 0.08}
        />
      </mesh>

      {/* Artwork */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(isActive ? null : item.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        scale={isHot ? 1.04 : 1}
      >
        <planeGeometry args={[width, height]} />
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            color="#0d121b"
            metalness={0.6}
            roughness={0.4}
            emissive={PALETTE.violet}
            emissiveIntensity={0.15}
          />
        )}
      </mesh>

      {labels && isHot && (
        <Html center distanceFactor={54} position={[0, -height / 2 - 3.4, 0.4]} zIndexRange={[20, 0]}>
          <div className="museum-tag">
            <span className="museum-tag__name">{item.title}</span>
            <span className="museum-tag__sub">{item.subtitle}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * THE MUSEUM — the design work, hung in a corridor the camera flies down.
 *
 * Pieces alternate between the two walls so the flight path threads
 * between them, and each is lit by the travelling rig rather than its
 * own light.
 */
export default function Museum({ selected, onSelect, labels }) {
  const group = useRef(null);

  const pieces = useMemo(() => {
    const items = galleryImages.slice(0, PIECE_COUNT);
    return items.map((item, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const depth = (i - (items.length - 1) / 2) * 22;
      return {
        item,
        position: [side * WALL_X, 0, depth],
        rotation: [0, side * -0.42, 0],
      };
    });
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const local = THREE.MathUtils.clamp(localProgress(4), -1.5, 1.5);
    group.current.rotation.y = world.pointer.x * 0.05 + local * 0.1;
    group.current.position.y = world.pointer.y * 1.6;
  });

  return (
    <EnvGroup index={4}>
      <group ref={group}>
        {/* Floor rail — two light lines defining the corridor */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * (WALL_X - 6), -14, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.6, 240]} />
            <meshBasicMaterial
              color={PALETTE.cyan}
              transparent
              opacity={0.35}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {pieces.map(({ item, position, rotation }) => (
          <Piece
            key={item.id}
            item={item}
            position={position}
            rotation={rotation}
            selected={selected}
            onSelect={onSelect}
            labels={labels}
          />
        ))}
      </group>
    </EnvGroup>
  );
}
