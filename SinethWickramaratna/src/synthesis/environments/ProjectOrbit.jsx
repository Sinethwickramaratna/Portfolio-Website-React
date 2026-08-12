import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import EnvGroup from '../world/EnvGroup';
import { chrome } from '../world/materials';
import { PALETTE } from '../worldConfig';
import { world, localProgress } from '../state/worldState';
import projectsData from '../../data/projectsData.json';

const ORBIT_RADIUS = 34;

/**
 * Each project gets a distinct form. The shape is chosen from the
 * project's own category and technologies so the sculpture says
 * something about the work rather than being decorative variety.
 */
function shapeFor(project) {
  const hay = `${project.category} ${project.title} ${project.technologies.join(' ')}`.toLowerCase();

  if (/vision|image|opencv|cnn/.test(hay)) return 'eye';
  if (/nlp|text|emotion|language|bert/.test(hay)) return 'neural';
  if (/recommend|movie|music|media/.test(hay)) return 'discs';
  if (/processor|hardware|circuit|vhdl|nano/.test(hay)) return 'lattice';
  if (/web|react|portfolio|dashboard/.test(hay)) return 'prism';
  return 'book';
}

function ProjectForm({ shape, color, hot }) {
  const mat = (
    <meshStandardMaterial
      {...chrome}
      roughness={hot ? 0.08 : 0.18}
      emissive={color}
      emissiveIntensity={hot ? 0.55 : 0.14}
    />
  );

  switch (shape) {
    case 'neural':
      return (
        <mesh>
          <torusKnotGeometry args={[2.6, 0.62, 128, 16, 2, 3]} />
          {mat}
        </mesh>
      );
    case 'discs':
      return (
        <group>
          {[-1.4, 0, 1.4].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, i * 0.4]}>
              <cylinderGeometry args={[3.1 - i * 0.3, 3.1 - i * 0.3, 0.28, 40]} />
              {mat}
            </mesh>
          ))}
        </group>
      );
    case 'eye':
      return (
        <group>
          <mesh>
            <sphereGeometry args={[2.6, 32, 32]} />
            {mat}
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[3.6, 0.18, 12, 60]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 2.3]}>
            <sphereGeometry args={[0.9, 20, 20]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        </group>
      );
    case 'lattice':
      return (
        <group>
          <mesh>
            <boxGeometry args={[4, 4, 4]} />
            {mat}
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(5.6, 5.6, 5.6)]} />
            <lineBasicMaterial color={color} toneMapped={false} transparent opacity={0.5} />
          </lineSegments>
        </group>
      );
    case 'prism':
      return (
        <mesh rotation={[0.4, 0.3, 0]}>
          <octahedronGeometry args={[3.4, 0]} />
          {mat}
        </mesh>
      );
    case 'book':
    default:
      return (
        <group rotation={[0, 0, 0.18]}>
          <mesh>
            <boxGeometry args={[4.4, 5.6, 0.7]} />
            {mat}
          </mesh>
          <mesh position={[0, 0, 0.45]}>
            <planeGeometry args={[3.6, 4.6]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.28}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      );
  }
}

/**
 * THE ORBIT — the portfolio proper.
 *
 * Projects orbit a chrome core rather than sitting in a grid of cards.
 * Selecting one leans the camera toward it and opens the cinematic
 * detail view in the DOM layer.
 */
export default function ProjectOrbit({ selected, onSelect, labels }) {
  const group = useRef(null);
  const coreRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const projects = useMemo(() => {
    const list = [...projectsData.projects].sort(
      (a, b) => parseInt(b.year, 10) - parseInt(a.year, 10)
    );
    return list.map((p, i) => {
      const angle = (i / list.length) * Math.PI * 2;
      return {
        ...p,
        shape: shapeFor(p),
        angle,
        // Slight vertical and depth stagger so it reads as a sphere of
        // objects rather than a flat ring.
        yOffset: Math.sin(angle * 2) * 7,
        zOffset: Math.cos(angle * 1.5) * 9,
        spin: 0.2 + (i % 3) * 0.12,
      };
    });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const local = THREE.MathUtils.clamp(localProgress(3), -1.5, 1.5);

    if (group.current) {
      group.current.rotation.y = t * 0.055 + local * 0.7 + world.pointer.x * 0.12;
      group.current.rotation.x = world.pointer.y * 0.07;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.2;
      coreRef.current.rotation.x += delta * 0.08;
    }
  });

  const setCursor = (on) => {
    document.body.style.cursor = on ? 'pointer' : '';
  };

  const handleSelect = (project) => {
    const isActive = selected === project.id;
    onSelect?.(isActive ? null : project.id);
    world.focus = isActive ? { x: 0, y: 0, z: 0 } : { x: 0, y: 0, z: -22 };
  };

  return (
    <EnvGroup index={3}>
      {/* Central core — the thing everything orbits */}
      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[6.4, 1]} />
          <meshStandardMaterial {...chrome} roughness={0.1} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.IcosahedronGeometry(9.4, 1)]} />
          <lineBasicMaterial
            color={PALETTE.violet}
            transparent
            opacity={0.3}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      <group ref={group}>
        {projects.map((project, i) => {
          const isActive = selected === project.id;
          const isHot = hovered === project.id || isActive;
          const color = isActive ? PALETTE.magenta : PALETTE.cyan;

          const x = Math.cos(project.angle) * ORBIT_RADIUS;
          const z = Math.sin(project.angle) * ORBIT_RADIUS + project.zOffset;

          return (
            <group key={project.id} position={[x, project.yOffset, z]}>
              {/* Orbit tether back to the core */}
              <OrbitTether target={[-x, -project.yOffset, -z]} color={color} hot={isHot} />

              <group
                scale={isHot ? 1.3 : 1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(project);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHovered(project.id);
                  setCursor(true);
                }}
                onPointerOut={() => {
                  setHovered(null);
                  setCursor(false);
                }}
              >
                <SpinningForm shape={project.shape} color={color} hot={isHot} speed={project.spin} />
              </group>

              {labels && (
              <Html center distanceFactor={62} position={[0, -8, 0]} zIndexRange={[20, 0]}>
                <button
                  type="button"
                  className={`orbit-tag ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(project);
                  }}
                >
                  <span className="orbit-tag__index">
                    PROJECT {String(i + 1).padStart(3, '0')}
                  </span>
                  <span className="orbit-tag__name">{project.title}</span>
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

/** Wraps a project form in its own idle rotation. */
function SpinningForm({ shape, color, hot, speed }) {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
      ref.current.rotation.x += delta * speed * 0.35;
    }
  });
  return (
    <group ref={ref}>
      <ProjectForm shape={shape} color={color} hot={hot} />
    </group>
  );
}

/** Thin holographic line from a project back to the central core. */
function OrbitTether({ target, color, hot }) {
  const geometry = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(...target),
      ]),
    [target]
  );

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={hot ? 0.32 : 0.1}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
}
