import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, THESIS_NODES, STATION_INDEX } from '../../config';
import { holo, emissive, chrome } from '../materials';
import { mulberry } from '../rng';

/**
 * The thesis structure.
 *
 * Part neural network, part molecule, part star chart. The important
 * behaviour is that it *assembles*: at the top of the section the nodes
 * are scattered far out and the edges are dark, and by the time the
 * statement is centred on screen every node has flown to its place and
 * the lattice has lit up. The structure being built is the argument.
 */

const INDEX = STATION_INDEX.intro;
const COUNT = 78;
const LINK_RADIUS = 2.35;

export default function Constellation() {
  const group = useRef();
  const nodesRef = useRef();
  const linesRef = useRef();
  const anchorsRef = useRef();

  const { home, scatter, geometry, pairs, positions } = useMemo(() => {
    const rng = mulberry(20260812);
    const settled = [];

    /* A lopsided cloud, denser through the middle band. A uniform
       sphere reads as decoration; a cloud with a spine reads as data. */
    for (let i = 0; i < COUNT; i += 1) {
      const band = rng();
      const y = (band * 2 - 1) * 3.6;
      const r = 2.2 + Math.pow(rng(), 0.55) * 4.6 * (1 - Math.abs(y) / 6.4);
      const a = rng() * Math.PI * 2;
      settled.push(
        new THREE.Vector3(
          Math.cos(a) * r * 1.45,
          y,
          Math.sin(a) * r * 0.75 - 1.2
        )
      );
    }

    /* Where each node waits before the section is reached. */
    const away = settled.map((v) => {
      const dir = v.clone().normalize();
      return dir.multiplyScalar(14 + rng() * 16).setY(v.y * 3.4);
    });

    const pairList = [];
    for (let i = 0; i < COUNT; i += 1) {
      for (let j = i + 1; j < COUNT; j += 1) {
        if (settled[i].distanceTo(settled[j]) < LINK_RADIUS) pairList.push([i, j]);
      }
    }

    const pos = new Float32Array(pairList.length * 6);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    return {
      home: settled,
      scatter: away,
      geometry: geo,
      pairs: pairList,
      positions: pos,
    };
  }, []);

  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.05, 8, 8), []);
  const anchorGeo = useMemo(() => new THREE.OctahedronGeometry(0.17, 0), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const live = useMemo(() => home.map((v) => v.clone()), [home]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    /* Assembly is driven by position in the section, not by time: the
       reader controls the build, and can run it backwards. */
    const d = flight.station - INDEX;
    const build = THREE.MathUtils.clamp(1 - Math.abs(d) * 1.35, 0, 1);
    const eased = build * build * (3 - 2 * build);

    /* Oscillates rather than accumulates. A constant `t * k` yaw looks
       fine for ten seconds and then has silently turned a hand-composed
       arrangement edge-on — every layout on this site is placed for one
       viewing angle, so the drift has to come back. */
    g.rotation.y = flight.px * 0.3 + Math.sin(t * 0.07) * 0.12;
    g.rotation.x = -flight.py * 0.18;

    if (nodesRef.current) {
      for (let i = 0; i < COUNT; i += 1) {
        const drift = Math.sin(t * 0.5 + i) * 0.06;
        live[i].lerpVectors(scatter[i], home[i], eased);
        live[i].y += drift;
        tmp.position.copy(live[i]);
        tmp.scale.setScalar(0.6 + eased * (0.7 + Math.sin(t * 1.4 + i * 2.1) * 0.3));
        tmp.updateMatrix();
        nodesRef.current.setMatrixAt(i, tmp.matrix);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    /* Edges are rebuilt from the live node positions so they stretch
       during the assembly instead of popping in at the end. */
    for (let k = 0; k < pairs.length; k += 1) {
      const [i, j] = pairs[k];
      const o = k * 6;
      positions[o] = live[i].x;
      positions[o + 1] = live[i].y;
      positions[o + 2] = live[i].z;
      positions[o + 3] = live[j].x;
      positions[o + 4] = live[j].y;
      positions[o + 5] = live[j].z;
    }
    geometry.attributes.position.needsUpdate = true;
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.02 + eased * 0.22;
    }

    if (anchorsRef.current) {
      anchorsRef.current.children.forEach((c, i) => {
        c.rotation.x = t * 0.3 + i;
        c.rotation.y = t * 0.22;
        c.scale.setScalar(0.4 + eased * 0.6);
      });
    }
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 0, 4]} color={PALETTE.cyan} intensity={5} distance={16} />
      <pointLight position={[-6, 3, -3]} color={PALETTE.violet} intensity={3} distance={18} />

      <lineSegments ref={linesRef} geometry={geometry}>
        <lineBasicMaterial
          {...holo(PALETTE.cyan, 0.2)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <instancedMesh ref={nodesRef} args={[nodeGeo, null, COUNT]}>
        <meshStandardMaterial {...emissive(PALETTE.cyan, 3)} />
      </instancedMesh>

      {/* The four named nodes are physical objects, not just labels —
          chrome octahedra sitting where their word will appear. */}
      <group ref={anchorsRef}>
        {THESIS_NODES.map((n) => (
          <mesh key={n.text} position={n.p} geometry={anchorGeo}>
            <meshStandardMaterial {...chrome} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
