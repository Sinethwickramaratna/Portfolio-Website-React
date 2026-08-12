import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import EnvGroup from '../world/EnvGroup';
import { chrome, chromeDark } from '../world/materials';
import { PALETTE } from '../worldConfig';
import { world, localProgress } from '../state/worldState';
import skillsData from '../../data/skillsData.json';

const GROUND_Y = -26;
const FILLER_COUNT = 110;

function seeded(i, salt = 1) {
  const x = Math.sin(i * 91.7 + salt * 217.3) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * NEURAL CITY — capability as skyline.
 *
 * Each skill category is a tower whose height is set by how many skills
 * it contains, so the silhouette is a truthful chart rather than
 * decoration. A field of instanced filler blocks gives the city density
 * for the cost of a single draw call, and holographic roads run between
 * the towers.
 */
export default function NeuralCity({ selected, onSelect, labels }) {
  const group = useRef(null);
  const [hovered, setHovered] = useState(null);

  const towers = useMemo(() => {
    const cats = skillsData.skillCategories;
    const cols = 3;
    const spacing = 26;

    return cats.map((cat, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const height = 16 + cat.skills.length * 3.4;
      return {
        key: cat.category,
        category: cat.category,
        icon: cat.icon,
        skills: cat.skills,
        height,
        position: new THREE.Vector3(
          (col - (cols - 1) / 2) * spacing,
          GROUND_Y + height / 2,
          (row - 0.5) * spacing
        ),
      };
    });
  }, []);

  /* Filler blocks — the city around the landmarks. */
  const { fillerGeo, fillerMat, fillerMatrices } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices = [];

    for (let i = 0; i < FILLER_COUNT; i += 1) {
      const x = (seeded(i, 1) - 0.5) * 190;
      const z = (seeded(i, 2) - 0.5) * 150;

      // Keep the plaza around the landmark towers clear.
      if (Math.abs(x) < 46 && Math.abs(z) < 40) continue;

      const h = 3 + seeded(i, 3) * 26;
      const w = 2.4 + seeded(i, 4) * 4.5;
      dummy.position.set(x, GROUND_Y + h / 2, z);
      dummy.scale.set(w, h, w);
      dummy.rotation.y = seeded(i, 5) * Math.PI;
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }

    return {
      fillerGeo: new THREE.BoxGeometry(1, 1, 1),
      fillerMat: new THREE.MeshStandardMaterial({ ...chromeDark }),
      fillerMatrices: matrices,
    };
  }, []);

  const fillerRef = useRef(null);

  /* Holographic road grid. */
  const roadGeometry = useMemo(() => {
    const pts = [];
    const extent = 95;
    for (let i = -3; i <= 3; i += 1) {
      const o = i * 26;
      pts.push(new THREE.Vector3(-extent, GROUND_Y + 0.1, o));
      pts.push(new THREE.Vector3(extent, GROUND_Y + 0.1, o));
      pts.push(new THREE.Vector3(o, GROUND_Y + 0.1, -extent));
      pts.push(new THREE.Vector3(o, GROUND_Y + 0.1, extent));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((state, delta) => {
    if (fillerRef.current && fillerRef.current.userData.filled !== true) {
      fillerMatrices.forEach((m, i) => fillerRef.current.setMatrixAt(i, m));
      fillerRef.current.instanceMatrix.needsUpdate = true;
      fillerRef.current.userData.filled = true;
    }

    if (!group.current) return;
    const local = THREE.MathUtils.clamp(localProgress(2), -1.5, 1.5);
    // Slow orbital drift over the city as the visitor passes.
    group.current.rotation.y = local * 0.42 + world.pointer.x * 0.05;
    group.current.position.y = world.pointer.y * 1.4;
    void state;
    void delta;
  });

  const setCursor = (on) => {
    document.body.style.cursor = on ? 'pointer' : '';
  };

  const handleSelect = (tower) => {
    const isActive = selected === tower.key;
    onSelect?.(isActive ? null : tower.key);
    // Lean the camera toward the selected tower.
    world.focus = isActive
      ? { x: 0, y: 0, z: 0 }
      : { x: tower.position.x * 0.28, y: 6, z: -18 };
  };

  return (
    <EnvGroup index={2}>
      <group ref={group}>
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, 0]}>
          <planeGeometry args={[260, 220]} />
          {/* Matte, not mirror: at high metalness this plane catches the
              whole environment map and reads as a bright grey slab,
              which flattens the skyline sitting on it. */}
          <meshStandardMaterial
            color="#04060b"
            metalness={0.1}
            roughness={0.92}
            envMapIntensity={0.15}
          />
        </mesh>

        {/* Holographic roads */}
        <lineSegments geometry={roadGeometry}>
          <lineBasicMaterial
            color={PALETTE.cyan}
            transparent
            opacity={0.3}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {/* City filler */}
        <instancedMesh
          ref={fillerRef}
          args={[fillerGeo, fillerMat, fillerMatrices.length]}
        />

        {/* Landmark towers */}
        {towers.map((tower, i) => {
          const isActive = selected === tower.key;
          const isHot = hovered === tower.key || isActive;
          const color = isActive ? PALETTE.magenta : PALETTE.cyan;

          return (
            <group key={tower.key} position={tower.position}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(tower);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHovered(tower.key);
                  setCursor(true);
                }}
                onPointerOut={() => {
                  setHovered(null);
                  setCursor(false);
                }}
                scale={isHot ? [1.12, 1.04, 1.12] : [1, 1, 1]}
              >
                <boxGeometry args={[9, tower.height, 9]} />
                <meshStandardMaterial
                  {...chrome}
                  roughness={isHot ? 0.1 : 0.2}
                  emissive={color}
                  emissiveIntensity={isHot ? 0.5 : 0.12}
                />
              </mesh>

              {/* Beacon */}
              <mesh position={[0, tower.height / 2 + 3, 0]}>
                <sphereGeometry args={[0.8, 12, 12]} />
                <meshBasicMaterial color={color} toneMapped={false} />
              </mesh>
              <mesh position={[0, tower.height / 2 + 3, 0]} scale={isHot ? 5 : 3}>
                <sphereGeometry args={[0.8, 12, 12]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.12}
                  toneMapped={false}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>

              {labels && (
              <Html
                center
                distanceFactor={58}
                position={[0, tower.height / 2 + 9, 0]}
                zIndexRange={[20, 0]}
              >
                <button
                  type="button"
                  className={`city-tag ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(tower);
                  }}
                >
                  <span className="city-tag__index">
                    TOWER {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="city-tag__name">{tower.category}</span>
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
