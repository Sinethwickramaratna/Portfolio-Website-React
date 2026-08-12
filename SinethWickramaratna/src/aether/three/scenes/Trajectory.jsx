import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, JOURNEY, STATION_INDEX } from '../../config';
import { holo, chrome, emissive } from '../materials';
import { mulberry } from '../rng';
import Label from '../Label';

/**
 * The journey, as a trajectory.
 *
 * A vertical timeline says "these things happened in order". A curve
 * through space says "this went somewhere", which is the truer claim.
 * Milestones are placed by their position along the curve; a light runs
 * the whole path continuously, and the section's own scroll position
 * decides how much of the trajectory has been travelled.
 */

const INDEX = STATION_INDEX.journey;

export default function Trajectory() {
  const group = useRef();
  const travellerRef = useRef();
  const nodeRefs = useRef([]);
  const dustRef = useRef();

  /* A single sweeping curve — hand-placed control points, because a
     generated spline always looks like a spring. */
  const curve = useMemo(
    () =>
      /* Kept below the headline block, which occupies the upper-left of
         the frame. The path dips, climbs and dips again so consecutive
         milestones are never at the same height — their labels have to
         sit above and below the curve without meeting. */
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

    /* Position along the section decides how far the camera has slid
       down the trajectory. The path scrolls past you, not the reverse. */
    const local = THREE.MathUtils.clamp(flight.station - INDEX + 0.5, 0, 1);
    g.position.x = -(local - 0.5) * 7;
    /* Below the headline block, which owns the top-left of the frame —
       the milestone read-outs need that band to stay clear. */
    g.position.y = -1.1;
    g.rotation.y = flight.px * 0.2 + (local - 0.5) * 0.35;
    g.rotation.x = -flight.py * 0.12;

    if (travellerRef.current) {
      const at = (t * 0.055) % 1;
      curve.getPointAt(at, v);
      travellerRef.current.position.copy(v);
      travellerRef.current.rotation.y = t * 0.8;
      travellerRef.current.rotation.x = t * 0.5;
    }

    nodeRefs.current.forEach((m, i) => {
      if (!m) return;
      /* A milestone lights as the traveller's progress passes it. */
      const reached = local * 1.05 > nodes[i].t;
      const pulse = 0.9 + Math.sin(t * 1.5 + i * 1.3) * 0.12;
      const target = (reached ? 1 : 0.45) * pulse;
      m.scale.lerp({ x: target, y: target, z: target }, 0.1);
      m.rotation.y = t * 0.25 + i;
      m.rotation.z = t * 0.14;
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
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial {...emissive(PALETTE.rose, 4)} />
      </mesh>

      {nodes.map((n, i) => (
        <group key={n.key} position={n.point}>
          <mesh
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
          >
            <icosahedronGeometry args={[0.28, 1]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.5, 0.004, 3, 60]} />
            <meshBasicMaterial {...holo(PALETTE.cyan, 0.5)} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial {...emissive(PALETTE.cyan, 3.6)} />
          </mesh>

          <Label
            station={INDEX}
            center
            className={`tj-node tj-node--${i % 2 ? 'down' : 'up'}`}
          >
            <span className="tj-key">{n.key}</span>
            <span className="tj-title">{n.title}</span>
            <span className="tj-detail">{n.detail}</span>
            <span className="tj-year">{n.year}</span>
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
