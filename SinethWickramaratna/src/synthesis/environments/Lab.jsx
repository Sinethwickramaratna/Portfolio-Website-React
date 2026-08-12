import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnvGroup from '../world/EnvGroup';
import { chrome } from '../world/materials';
import { PALETTE, SECTIONS } from '../worldConfig';
import { world, localProgress } from '../state/worldState';

const CONFIG = SECTIONS[5];

function seeded(i, salt = 1) {
  const x = Math.sin(i * 57.3 + salt * 133.9) * 43758.5453;
  return x - Math.floor(x);
}

/** A floating line chart, drawn as holographic light. */
function DataPlot({ position, rotation, points = 26, color = PALETTE.cyan, seed = 1 }) {
  const geometry = useMemo(() => {
    const pts = [];
    let y = 0;
    for (let i = 0; i < points; i += 1) {
      y += (seeded(i, seed) - 0.42) * 1.6;
      pts.push(new THREE.Vector3((i / (points - 1) - 0.5) * 18, y, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [points, seed]);

  return (
    <group position={position} rotation={rotation}>
      {/* Plot frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(20, 12)]} />
        <lineBasicMaterial color={PALETTE.grey} transparent opacity={0.35} toneMapped={false} />
      </lineSegments>
      <line geometry={geometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.85}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </line>
    </group>
  );
}

/** A cluster of nodes and edges — a neural network as an object. */
function NetworkCluster({ position }) {
  const ref = useRef(null);

  const { nodes, edgeGeometry } = useMemo(() => {
    const layers = [4, 6, 6, 3];
    const pts = [];
    layers.forEach((count, li) => {
      for (let n = 0; n < count; n += 1) {
        pts.push(
          new THREE.Vector3(
            (li - (layers.length - 1) / 2) * 6,
            (n - (count - 1) / 2) * 3.2,
            0
          )
        );
      }
    });

    const edges = [];
    let offset = 0;
    for (let li = 0; li < layers.length - 1; li += 1) {
      const start = offset;
      const mid = offset + layers[li];
      const end = mid + layers[li + 1];
      for (let a = start; a < mid; a += 1) {
        for (let b = mid; b < end; b += 1) {
          edges.push(pts[a], pts[b]);
        }
      }
      offset = mid;
    }

    return {
      nodes: pts,
      edgeGeometry: new THREE.BufferGeometry().setFromPoints(edges),
    };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={ref} position={position}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          color={PALETTE.violet}
          transparent
          opacity={0.16}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.42, 12, 12]} />
          <meshBasicMaterial color={PALETTE.cyan} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * THE LAB — research, presented as an environment you are standing in
 * rather than a list of papers.
 *
 * The 3D layer carries the instruments: plots, a network, a specimen
 * under glass. The numbers themselves live in the DOM overlay, where
 * they are selectable, accessible, and legible at any resolution.
 */
export default function Lab() {
  const group = useRef(null);
  const specimen = useRef(null);

  useFrame((state, delta) => {
    const local = THREE.MathUtils.clamp(localProgress(5), -1.5, 1.5);
    if (group.current) {
      group.current.rotation.y = local * 0.3 + world.pointer.x * 0.08;
      group.current.position.y = world.pointer.y * 1.5;
    }
    if (specimen.current) {
      specimen.current.rotation.y += delta * 0.25;
      specimen.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
  });

  return (
    <EnvGroup index={5}>
      <group ref={group}>
        {/* Specimen under study — chrome form inside a light cage */}
        <group ref={specimen} position={[0, 2, -6]}>
          <mesh>
            <torusKnotGeometry args={[4.2, 1.15, 160, 24, 3, 5]} />
            <meshStandardMaterial {...chrome} roughness={0.12} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(16, 16, 16)]} />
            <lineBasicMaterial
              color={PALETTE.cyan}
              transparent
              opacity={0.25}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </lineSegments>
        </group>

        {/* Instruments arranged around the specimen */}
        <DataPlot position={[-30, 10, 6]} rotation={[0, 0.5, 0]} color={PALETTE.cyan} seed={2} />
        <DataPlot position={[30, -8, 6]} rotation={[0, -0.5, 0]} color={PALETTE.magenta} seed={7} />
        <NetworkCluster position={[26, 12, -14]} />

        {/* Experiment count marker per configured experiment */}
        {CONFIG.experiments.map((exp, i) => (
          <mesh key={exp.code} position={[-28 + i * 56, -16, -2]}>
            <ringGeometry args={[3.2, 3.6, 40]} />
            <meshBasicMaterial
              color={i === 0 ? PALETTE.cyan : PALETTE.magenta}
              transparent
              opacity={0.6}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </EnvGroup>
  );
}
