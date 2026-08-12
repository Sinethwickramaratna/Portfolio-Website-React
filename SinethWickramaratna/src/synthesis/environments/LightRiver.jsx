import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import EnvGroup from '../world/EnvGroup';
import { PALETTE, SECTIONS } from '../worldConfig';
import { world, localProgress } from '../state/worldState';

const CONFIG = SECTIONS[6];
const MILESTONES = CONFIG.milestones;

/**
 * THE FLOW — experience as a river of light rather than a timeline.
 *
 * A single curve runs through the environment, dim at its source and
 * brightest at the present. Milestones sit on the curve as nodes. The
 * brightness gradient is baked into vertex colours, so the whole river
 * is one draw call.
 */
export default function LightRiver({ labels }) {
  const group = useRef(null);
  const flowRef = useRef(null);

  const { tubeGeometry, nodes } = useMemo(() => {
    // A meandering path that drifts upward toward the present.
    const controls = MILESTONES.map((_, i) => {
      const u = i / (MILESTONES.length - 1);
      return new THREE.Vector3(
        (i % 2 === 0 ? -1 : 1) * 18 * (1 - u * 0.45),
        -34 + u * 68,
        Math.sin(u * Math.PI * 1.4) * 16
      );
    });

    const c = new THREE.CatmullRomCurve3(controls, false, 'catmullrom', 0.4);
    const geo = new THREE.TubeGeometry(c, 220, 0.9, 12, false);

    // Vertex colours: dim past → bright present.
    const count = geo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const dim = new THREE.Color(PALETTE.violet);
    const bright = new THREE.Color(PALETTE.cyan);
    const tmp = new THREE.Color();

    // TubeGeometry lays vertices out ring by ring along the path, so the
    // vertex index maps directly onto progress along the river.
    const ringSize = 13; // radialSegments + 1
    for (let i = 0; i < count; i += 1) {
      const u = Math.min(1, Math.floor(i / ringSize) / 220);
      tmp.copy(dim).lerp(bright, u * u);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nodeList = MILESTONES.map((m, i) => ({
      ...m,
      position: c.getPoint(i / (MILESTONES.length - 1)),
      strength: (i + 1) / MILESTONES.length,
    }));

    return { tubeGeometry: geo, nodes: nodeList };
  }, []);

  useFrame((state) => {
    const local = THREE.MathUtils.clamp(localProgress(6), -1.5, 1.5);
    if (group.current) {
      group.current.rotation.y = local * 0.5 + world.pointer.x * 0.1;
      group.current.position.y = world.pointer.y * 1.8;
    }
    if (flowRef.current) {
      flowRef.current.material.opacity =
        0.72 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    }
  });

  return (
    <EnvGroup index={6}>
      <group ref={group}>
        <mesh ref={flowRef} geometry={tubeGeometry}>
          <meshBasicMaterial
            vertexColors
            transparent
            opacity={0.8}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Wider, fainter sheath — gives the river volume */}
        <mesh geometry={tubeGeometry} scale={[2.6, 1, 2.6]}>
          <meshBasicMaterial
            vertexColors
            transparent
            opacity={0.08}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {nodes.map((node, i) => (
          <group key={`${node.year}-${i}`} position={node.position}>
            <mesh>
              <sphereGeometry args={[1.5, 20, 20]} />
              <meshBasicMaterial
                color={i === nodes.length - 1 ? PALETTE.magenta : PALETTE.cyan}
                toneMapped={false}
              />
            </mesh>
            <mesh scale={2.6 + node.strength * 1.6}>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshBasicMaterial
                color={i === nodes.length - 1 ? PALETTE.magenta : PALETTE.cyan}
                transparent
                opacity={0.1 + node.strength * 0.09}
                toneMapped={false}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {labels && (
            <Html
              center
              distanceFactor={50}
              position={[node.position.x > 0 ? 12 : -12, 0, 0]}
              zIndexRange={[20, 0]}
            >
              <div className="river-tag" style={{ opacity: 0.45 + node.strength * 0.55 }}>
                <span className="river-tag__year">{node.year}</span>
                <span className="river-tag__name">{node.name}</span>
                <span className="river-tag__note">{node.note}</span>
              </div>
            </Html>
            )}
          </group>
        ))}
      </group>
    </EnvGroup>
  );
}
