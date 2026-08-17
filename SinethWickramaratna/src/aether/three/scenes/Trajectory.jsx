import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, JOURNEY, STATION_INDEX } from '../../config';
import { holo, chrome, chromeDark, emissive } from '../materials';
import { mulberry } from '../rng';
import Label from '../Label';

/**
 * The journey, as a trajectory.
 *
 * A vertical timeline says "these things happened in order". A curve
 * through space says "this went somewhere", which is the truer claim.
 *
 * The hard part is not the curve — it is the writing. Seven full
 * read-outs projected onto one path will always collide, because their
 * screen positions are decided by 3D geometry and their sizes by the
 * text. So the path carries only the *keys*: one short word per node,
 * which can be placed tightly and never wraps. The prose lives in a
 * single panel in the document layer, and scrolling the section walks
 * the active milestone along the path. One thing is being read at a
 * time, which is also how a trajectory is actually travelled.
 */

const INDEX = STATION_INDEX.journey;

export default function Trajectory({ onActive }) {
  const group = useRef();
  const travellerRef = useRef();
  const nodeRefs = useRef([]);
  const labelRefs = useRef([]);
  const dustRef = useRef();
  const activeRef = useRef(-1);

  /* A single sweeping curve — hand-placed control points, because a
     generated spline always looks like a spring. Kept below the
     headline block, which owns the upper-left of the frame. */
  /* Low on the left, climbing to the right — which is also the shape of
     the thing it describes. The document is laid out around this: the
     heading takes the top-left, above where the curve begins, and the
     read-out takes the bottom-right, below where it ends. */
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8.4, -4.4, -3.0),
        new THREE.Vector3(-5.6, -2.4, 1.4),
        new THREE.Vector3(-2.4, -0.4, -1.8),
        new THREE.Vector3(0.7, 1.3, 2.2),
        new THREE.Vector3(3.5, -1.0, -2.4),
        new THREE.Vector3(6.0, -3.0, 1.0),
        new THREE.Vector3(8.4, -0.8, -1.2),
        new THREE.Vector3(10.2, 1.8, 1.8),
      ]),
    []
  );

  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 220, 0.011, 3, false),
    [curve]
  );

  /* A second, wider ghost of the same path. Two strokes at different
     opacities read as depth of field; one stroke reads as a wire. */
  const haloGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 220, 0.05, 4, false),
    [curve]
  );

  const nodes = useMemo(
    () => JOURNEY.map((m) => ({ ...m, point: curve.getPointAt(m.t) })),
    [curve]
  );

  /* Sparse field around the path so it is travelling through something. */
  const dust = useMemo(() => {
    const rng = mulberry(9911);
    const n = 420;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      const p = curve.getPointAt(rng());
      pos[i * 3] = p.x + (rng() - 0.5) * 7;
      pos[i * 3 + 1] = p.y + (rng() - 0.5) * 6;
      pos[i * 3 + 2] = p.z + (rng() - 0.5) * 7;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [curve]);

  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    /* Position within the section decides how far along the trajectory
       the reader has travelled. The path slides past; the camera does
       not chase it. */
    const local = THREE.MathUtils.clamp(flight.station - INDEX + 0.5, 0, 1);
    g.position.x = -(local - 0.5) * 7;
    g.position.y = -1.1;
    g.rotation.y = flight.px * 0.2 + (local - 0.5) * 0.35;
    g.rotation.x = -flight.py * 0.12;

    /* The traveller is driven by the reader, not by a clock: it is the
       playhead for the section, and it stops where they stop. */
    const head = THREE.MathUtils.clamp(local * 1.04 - 0.02, 0, 1);
    if (travellerRef.current) {
      curve.getPointAt(head, v);
      travellerRef.current.position.copy(v);
      travellerRef.current.rotation.y = t * 0.8;
      travellerRef.current.rotation.x = t * 0.5;
    }

    /* Whichever milestone the playhead has most recently passed is the
       one being read. */
    let active = 0;
    for (let i = 0; i < nodes.length; i += 1) {
      if (head >= nodes[i].t - 0.04) active = i;
    }
    if (active !== activeRef.current) {
      activeRef.current = active;
      onActive?.(active);
    }

    nodeRefs.current.forEach((m, i) => {
      if (!m) return;
      const reached = head >= nodes[i].t - 0.04;
      const isActive = i === active;
      const pulse = 0.9 + Math.sin(t * 1.5 + i * 1.3) * 0.1;
      const target = (isActive ? 1.55 : reached ? 0.9 : 0.5) * pulse;
      m.scale.lerp({ x: target, y: target, z: target }, 0.12);
      m.rotation.y = t * 0.25 + i;
      m.rotation.z = t * 0.14;
    });

    /* Keys fade back once passed, so the eye is never asked to read
       seven words at once. */
    labelRefs.current.forEach((el, i) => {
      if (!el) return;
      const reached = head >= nodes[i].t - 0.04;
      el.classList.toggle('is-active', i === active);
      el.classList.toggle('is-past', reached && i !== active);
    });

    if (dustRef.current) dustRef.current.rotation.y = t * 0.01;
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 2, 4]} color={PALETTE.cyan} intensity={6} distance={22} />
      <pointLight position={[8, 2, 0]} color={PALETTE.violet} intensity={3} distance={20} />

      <mesh geometry={haloGeo}>
        <meshBasicMaterial
          {...holo(PALETTE.cyan, 0.05)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial {...holo(PALETTE.cyan, 0.55)} />
      </mesh>

      <mesh ref={travellerRef}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial {...emissive(PALETTE.rose, 4)} />
      </mesh>

      {nodes.map((n, i) => (
        <group key={n.key} position={n.point}>
          <mesh
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
          >
            <icosahedronGeometry args={[0.24, 1]} />
            <meshStandardMaterial {...(i % 2 ? chrome : chromeDark)} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.46, 0.004, 3, 60]} />
            <meshBasicMaterial {...holo(PALETTE.cyan, 0.45)} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial {...emissive(PALETTE.cyan, 3.6)} />
          </mesh>

          {/* One short word. Never wraps, so it can sit close to its
              node without colliding with its neighbours. */}
          <Label station={INDEX} center className="tj-key-wrap">
            <span
              className="tj-key"
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
            >
              {n.key}
            </span>
          </Label>
        </group>
      ))}

      <points ref={dustRef} geometry={dust}>
        <pointsMaterial
          size={0.018}
          sizeAttenuation
          color={PALETTE.cyan}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
