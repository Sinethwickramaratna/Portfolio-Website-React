import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, STATION_INDEX } from '../../config';
import { holo, chrome, chromeDark, glass, emissive } from '../materials';
import { mulberry, range } from '../rng';
import { useFrameExtent } from '../useFrameExtent';

/**
 * The research lab.
 *
 * Four instruments on a bench, each standing for one stage of the work:
 * a dataset cloud being sampled, a decision surface, a search over a
 * parameter space, and a result read off a curve. They are separate
 * objects at separate depths, which is what makes this a room you enter
 * rather than a diagram you look at.
 */

const INDEX = STATION_INDEX.research;

/* Where each instrument sits, as a fraction of the visible frame rather
   than as a world coordinate. The four read-outs are pinned to the four
   corners of the *screen*, so the instruments have to be placed against
   the same frame or they drift under the text as the window changes —
   which is exactly what happened at large sizes. Kept inside ±0.5 so
   the outer fifth of the frame stays clear for the words. */
const BENCH = [
  { key: 'data', fx: -0.37, fy: 0.30, z: -1.2 },
  { key: 'models', fx: 0.37, fy: 0.36, z: -2.6 },
  { key: 'search', fx: -0.36, fy: -0.42, z: 1.6 },
  { key: 'result', fx: 0.38, fy: -0.36, z: 0.8 },
];

export default function ResearchLab() {
  const group = useRef();
  const slots = useRef(BENCH.map(() => null));
  const extent = useFrameExtent();

  useFrame(() => {
    const { hw, hh } = extent.current;
    BENCH.forEach((slot, i) => {
      const g = slots.current[i];
      if (!g) return;
      g.position.set(slot.fx * hw, slot.fy * hh, slot.z);
      /* Shrink with the frame too. Held at a fixed world size, an
         instrument that clears the read-outs on a wide monitor grows
         into them the moment the window narrows. */
      g.scale.setScalar(THREE.MathUtils.clamp(hh / 5.3, 0.62, 1.15) * 0.85);
    });
  });

  const bind = (i) => (el) => {
    slots.current[i] = el;
  };

  return (
    <group ref={group}>
      <pointLight position={[0, 1, 5]} color={PALETTE.cyan} intensity={7} distance={20} />
      <pointLight position={[-7, 3, -3]} color={PALETTE.violet} intensity={3.4} distance={20} />
      <pointLight position={[6, -3, 2]} color={PALETTE.rose} intensity={1.8} distance={16} />

      <Bench />
      <group ref={bind(0)}><DatasetCloud /></group>
      <group ref={bind(1)}><DecisionSurface /></group>
      <group ref={bind(2)}><ParameterSearch /></group>
      <group ref={bind(3)}><ResultCurve /></group>
    </group>
  );
}

/* A faint reference frame — the only orthogonal thing on the site, and
   the reason the instruments read as being *in* a space. */
function Bench() {
  const ref = useRef();
  const gridGeo = useMemo(() => new THREE.PlaneGeometry(26, 16, 26, 16), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.z = flight.px * 0.05;
    ref.current.position.y = -5.4 + Math.sin(t * 0.2) * 0.1;
  });

  return (
    <mesh ref={ref} geometry={gridGeo} rotation={[-Math.PI / 2.15, 0, 0]} position={[0, -5.4, -3]}>
      {/* Faint enough that the strip of technical labels running along
          the bottom of the section stays readable over it. */}
      <meshBasicMaterial
        {...holo(PALETTE.cyan, 0.03)}
        wireframe
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* DATA — a labelled cloud with a sampling window sliding through it,
   which is literally how the sensor series was segmented. */
function DatasetCloud() {
  const ref = useRef();
  const windowRef = useRef();

  const geo = useMemo(() => {
    const rng = mulberry(2211);
    const n = 700;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const cyan = new THREE.Color(PALETTE.cyan);
    const violet = new THREE.Color(PALETTE.violet);
    for (let i = 0; i < n; i += 1) {
      /* Three clusters, not one blob — behaviour classes, separable. */
      const c = i % 3;
      const cx = [-0.9, 0.4, 1.1][c];
      const cy = [0.3, -0.8, 0.9][c];
      pos[i * 3] = cx + range(rng, -0.65, 0.65);
      pos[i * 3 + 1] = cy + range(rng, -0.6, 0.6);
      pos[i * 3 + 2] = range(rng, -0.8, 0.8);
      const tint = c === 1 ? violet : cyan;
      col[i * 3] = tint.r;
      col[i * 3 + 1] = tint.g;
      col[i * 3 + 2] = tint.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.11 + flight.px * 0.2;
      ref.current.rotation.x = Math.sin(t * 0.17) * 0.16;
    }
    if (windowRef.current) {
      windowRef.current.position.x = Math.sin(t * 0.5) * 1.5;
    }
  });

  return (
    <group scale={1.3}>
      <group ref={ref}>
        <points geometry={geo}>
          <pointsMaterial
            size={0.035}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
        <mesh>
          <boxGeometry args={[2.9, 2.6, 2.2]} />
          <meshBasicMaterial {...holo(PALETTE.cyan, 0.08)} wireframe />
        </mesh>
      </group>
      {/* the sliding window */}
      <mesh ref={windowRef}>
        <planeGeometry args={[0.34, 2.8]} />
        <meshBasicMaterial
          {...holo(PALETTE.rose, 0.22)}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* MODELS — a saddle. The one honest picture of what a classifier does:
   bend a space until two things fall on opposite sides. */
function DecisionSurface() {
  const ref = useRef();
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(3.4, 3.4, 30, 30);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i += 1) {
      const x = p.getX(i);
      const y = p.getY(i);
      p.setZ(i, (x * x - y * y) * 0.16 + Math.sin(x * 1.6) * 0.12);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.z = t * 0.07;
    ref.current.rotation.x = -0.9 + Math.sin(t * 0.2) * 0.1;
  });

  return (
    <group>
      <mesh ref={ref} geometry={geo}>
        <meshBasicMaterial
          {...holo(PALETTE.cyan, 0.28)}
          wireframe
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial {...emissive(PALETTE.cyan, 2.6)} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.005, 3, 120]} />
        <meshBasicMaterial {...holo(PALETTE.violet, 0.4)} />
      </mesh>
    </group>
  );
}

/* EXPERIMENTS — candidates scattered over a parameter grid, with the
   current best held in glass. */
function ParameterSearch() {
  const ref = useRef();
  const marksRef = useRef();
  const bestRef = useRef();

  const marks = useMemo(() => {
    const rng = mulberry(3388);
    return Array.from({ length: 34 }, () => ({
      x: range(rng, -1.6, 1.6),
      y: range(rng, -1.4, 1.4),
      z: range(rng, -0.7, 0.7),
      s: range(rng, 0.3, 1),
      phase: rng() * Math.PI * 2,
    }));
  }, []);

  const markGeo = useMemo(() => new THREE.OctahedronGeometry(0.075, 0), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y = -t * 0.09 + flight.px * 0.15;
    if (marksRef.current) {
      marks.forEach((m, i) => {
        tmp.position.set(m.x, m.y + Math.sin(t * 0.7 + m.phase) * 0.07, m.z);
        tmp.scale.setScalar(m.s * (0.7 + Math.sin(t * 2 + i) * 0.3));
        tmp.rotation.set(t * 0.3, t * 0.2, 0);
        tmp.updateMatrix();
        marksRef.current.setMatrixAt(i, tmp.matrix);
      });
      marksRef.current.instanceMatrix.needsUpdate = true;
    }
    if (bestRef.current) {
      bestRef.current.rotation.y = t * 0.4;
      bestRef.current.rotation.x = t * 0.25;
    }
  });

  return (
    <group scale={1.25}>
      <group ref={ref}>
        <instancedMesh ref={marksRef} args={[markGeo, null, marks.length]}>
          <meshStandardMaterial {...chrome} />
        </instancedMesh>
        <mesh>
          <boxGeometry args={[3.4, 3.0, 1.6]} />
          <meshBasicMaterial {...holo(PALETTE.cyan, 0.07)} wireframe />
        </mesh>
      </group>
      <mesh ref={bestRef} position={[0.4, 0.2, 0]}>
        <octahedronGeometry args={[0.34, 0]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
    </group>
  );
}

/* RESULTS — a learning curve lifted into three dimensions, with the
   final value marked. */
function ResultCurve() {
  const ref = useRef();
  const markerRef = useRef();

  const { tube, bars } = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 40; i += 1) {
      const t = i / 40;
      // A real-looking learning curve: fast early, asymptotic late.
      const y = (1 - Math.exp(-t * 4.2)) * 2.0 + Math.sin(t * 22) * 0.045;
      pts.push(new THREE.Vector3((t - 0.5) * 3.6, y - 1.0, Math.sin(t * 3) * 0.25));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return {
      tube: new THREE.TubeGeometry(curve, 120, 0.018, 4, false),
      bars: pts.filter((_, i) => i % 5 === 0),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.2) * 0.35 + flight.px * 0.25;
    }
    if (markerRef.current) {
      markerRef.current.scale.setScalar(0.9 + Math.sin(t * 2.2) * 0.16);
    }
  });

  return (
    <group ref={ref} scale={1.15}>
      <mesh geometry={tube}>
        <meshStandardMaterial {...emissive(PALETTE.cyan, 2.2)} />
      </mesh>
      {bars.map((p, i) => (
        <mesh key={i} position={[p.x, (p.y - 1.0) / 2, p.z]}>
          <boxGeometry args={[0.035, Math.max(0.05, p.y + 1.0), 0.035]} />
          <meshStandardMaterial {...chromeDark} />
        </mesh>
      ))}
      <mesh ref={markerRef} position={bars[bars.length - 1]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial {...emissive(PALETTE.rose, 4)} />
      </mesh>
      <mesh position={[0, -1.05, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.9, 0.006, 0.006]} />
        <meshBasicMaterial {...holo(PALETTE.muted, 0.3)} />
      </mesh>
    </group>
  );
}
