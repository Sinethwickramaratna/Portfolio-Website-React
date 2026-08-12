import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import EnvGroup from '../world/EnvGroup';
import { chrome } from '../world/materials';
import { PALETTE, SECTIONS } from '../worldConfig';
import { world, localProgress } from '../state/worldState';

const CONFIG = SECTIONS[1];
const HEIGHT = 96;
const RADIUS = 9.5;
const TURNS = 2.4;
const SAMPLES = 160;

/** Points along one strand of the helix. */
function strandPoints(phase) {
  return Array.from({ length: SAMPLES }, (_, i) => {
    const u = i / (SAMPLES - 1);
    const angle = u * Math.PI * 2 * TURNS + phase;
    return new THREE.Vector3(
      Math.cos(angle) * RADIUS,
      (u - 0.5) * HEIGHT,
      Math.sin(angle) * RADIUS
    );
  });
}

/**
 * THE DNA — what the work is made of, as structure rather than prose.
 *
 * Two chrome strands wound around a shared axis, rungs between them, and
 * one holographic node per trait. The helix turns as the camera arrives
 * and each node can be selected to open its detail panel in the DOM
 * overlay above.
 */
export default function DnaHelix({ selected, onSelect, labels }) {
  const group = useRef(null);
  const [hovered, setHovered] = useState(null);

  const { strandA, strandB, rungs, nodes } = useMemo(() => {
    const a = new THREE.CatmullRomCurve3(strandPoints(0));
    const b = new THREE.CatmullRomCurve3(strandPoints(Math.PI));

    // Rungs every few samples, skipping the ends so it reads as open.
    const rungList = [];
    for (let i = 6; i < SAMPLES - 6; i += 7) {
      const u = i / (SAMPLES - 1);
      const p1 = a.getPoint(u);
      const p2 = b.getPoint(u);
      const mid = p1.clone().lerp(p2, 0.5);
      const dir = p2.clone().sub(p1);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      rungList.push({ key: i, position: mid, quaternion: quat, length: dir.length() });
    }

    // One node per trait, spaced down the axis.
    const nodeList = CONFIG.segments.map((seg, i) => {
      const u = (i + 0.5) / CONFIG.segments.length;
      const p = a.getPoint(u);
      return { ...seg, position: p, u };
    });

    return { strandA: a, strandB: b, rungs: rungList, nodes: nodeList };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const local = THREE.MathUtils.clamp(localProgress(1), -1.5, 1.5);

    // The helix turns as the visitor passes it — the scroll rotates the
    // structure rather than merely translating past it.
    group.current.rotation.y = local * Math.PI * 1.15 + t * 0.06;
    group.current.rotation.z = world.pointer.x * 0.07;
    group.current.position.y = world.pointer.y * 2 + Math.sin(t * 0.3) * 1.2;
  });

  const setCursor = (on) => {
    document.body.style.cursor = on ? 'pointer' : '';
  };

  return (
    <EnvGroup index={1}>
      <group ref={group}>
        {/* Chrome strands */}
        {[strandA, strandB].map((curve, i) => (
          <mesh key={i}>
            <tubeGeometry args={[curve, 140, 0.55, 10, false]} />
            <meshStandardMaterial {...chrome} roughness={0.18} />
          </mesh>
        ))}

        {/* Rungs */}
        {rungs.map((r) => (
          <mesh
            key={r.key}
            position={r.position}
            quaternion={r.quaternion}
          >
            <cylinderGeometry args={[0.14, 0.14, r.length, 6]} />
            <meshStandardMaterial
              color="#0d1119"
              emissive={PALETTE.cyan}
              emissiveIntensity={0.5}
              metalness={0.6}
              roughness={0.4}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Trait nodes */}
        {nodes.map((node, i) => {
          const isActive = selected === node.key;
          const isHot = hovered === node.key || isActive;
          const color = isActive ? PALETTE.magenta : PALETTE.cyan;

          return (
            <group key={node.key} position={node.position}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(isActive ? null : node.key);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHovered(node.key);
                  setCursor(true);
                }}
                onPointerOut={() => {
                  setHovered(null);
                  setCursor(false);
                }}
                scale={isHot ? 1.45 : 1}
              >
                <octahedronGeometry args={[2, 0]} />
                <meshStandardMaterial
                  color="#0b0f16"
                  emissive={color}
                  emissiveIntensity={isHot ? 3.2 : 1.5}
                  metalness={0.7}
                  roughness={0.25}
                  toneMapped={false}
                />
              </mesh>

              {/* Additive halo */}
              <mesh scale={isHot ? 3.4 : 2.4}>
                <sphereGeometry args={[1.6, 16, 16]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={isHot ? 0.16 : 0.07}
                  toneMapped={false}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>

              {labels && (
              <Html
                center
                distanceFactor={44}
                position={[
                  node.position.x > 0 ? 7 : -7,
                  0,
                  0,
                ]}
                zIndexRange={[20, 0]}
              >
                <button
                  type="button"
                  className={`dna-tag ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(isActive ? null : node.key);
                  }}
                >
                  <span className="dna-tag__index">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {node.name}
                </button>
              </Html>
              )}
            </group>
          );
        })}
      </group>
    </EnvGroup>
  );
}
