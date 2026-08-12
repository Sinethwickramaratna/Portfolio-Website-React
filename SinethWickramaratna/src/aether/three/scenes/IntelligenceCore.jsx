import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { flight, presence } from '../../state/flight';
import { PALETTE } from '../../config';
import { chrome, chromeDark, acrylic, holo, emissive } from '../materials';
import { mulberry } from '../rng';

/**
 * The intelligence core.
 *
 * Not a sphere with a shader on it. It is a stack: a restless chrome
 * mass at the centre, a faceted acrylic shell that refracts it, a cage
 * of geometric fragments held on three inclined orbits, a filament
 * lattice strung between glowing nodes, and a shell of drifting
 * particles. Each layer moves at a different rate, which is what gives
 * the object its parallax and stops it reading as one rigid prop.
 */

const RING_TILTS = [
  [0.22, 0, 0.12],
  [1.32, 0.4, -0.5],
  [-0.85, 0.9, 0.35],
];

export default function IntelligenceCore() {
  const group = useRef();
  const massRef = useRef();
  const shellRef = useRef();
  const shardsRef = useRef();
  const darkShardsRef = useRef();
  const ringRefs = [useRef(), useRef(), useRef()];
  const nodesRef = useRef();
  const dustRef = useRef();

  /* ---- Geometric fragments -------------------------------------- *
     Angular offcuts, not tumbling cubes: each is a thin slab scaled on
     one axis so it catches the environment as a hard edge of light. */
  const shards = useMemo(() => {
    const rng = mulberry(9021);
    return Array.from({ length: 22 }, (_, i) => {
      const ring = i % 3;
      const a = rng() * Math.PI * 2;
      const radius = 2.7 + rng() * 1.9;
      return {
        ring,
        a,
        radius,
        speed: (0.06 + rng() * 0.1) * (rng() > 0.5 ? 1 : -1),
        wobble: rng() * Math.PI * 2,
        scale: [0.06 + rng() * 0.05, 0.34 + rng() * 0.5, 0.16 + rng() * 0.22],
        tilt: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI],
        dark: rng() > 0.62,
      };
    });
  }, []);

  /* ---- Nodes and the filaments between them ---------------------- *
     Nodes sit on a jittered sphere; a filament is drawn between any two
     that are close enough to plausibly be connected. The result reads
     as a network because it was built like one, not because the lines
     were drawn at random. */
  const { nodePositions, filaments } = useMemo(() => {
    const rng = mulberry(4471);
    const count = 26;
    const pts = [];
    for (let i = 0; i < count; i += 1) {
      // Fibonacci shell, pushed around so it does not look surveyed.
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963;
      const rad = 2.15 + rng() * 0.85;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * r * rad,
          y * rad * 1.05,
          Math.sin(theta) * r * rad
        )
      );
    }
    const segs = [];
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        if (pts[i].distanceTo(pts[j]) < 1.75) {
          segs.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
    return { nodePositions: pts, filaments: geo };
  }, []);

  /* ---- Particle shell -------------------------------------------- */
  const dust = useMemo(() => {
    const rng = mulberry(1187);
    const n = 620;
    const pos = new Float32Array(n * 3);
    const size = new Float32Array(n);
    for (let i = 0; i < n; i += 1) {
      const u = rng() * 2 - 1;
      const phi = rng() * Math.PI * 2;
      const r = 3.1 + Math.pow(rng(), 0.6) * 4.2;
      const s = Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(phi) * s * r;
      pos[i * 3 + 1] = u * r * 0.8;
      pos[i * 3 + 2] = Math.sin(phi) * s * r;
      size[i] = 0.012 + rng() * 0.03;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    return geo;
  }, []);

  const orbitGeo = useMemo(() => new THREE.TorusGeometry(3.6, 0.006, 3, 220), []);
  const orbitGeoWide = useMemo(
    () => new THREE.TorusGeometry(4.7, 0.004, 3, 220),
    []
  );
  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.045, 10, 10), []);
  const shardGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const brightShards = useMemo(() => shards.filter((s) => !s.dark), [shards]);
  const darkShards = useMemo(() => shards.filter((s) => s.dark), [shards]);

  const tmp = useMemo(() => new THREE.Object3D(), []);
  const euler = useMemo(() => new THREE.Euler(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(0.05, delta);
    const p = presence(0, 1.3);
    const g = group.current;
    if (!g) return;

    /* The whole assembly leans towards the pointer. Small angles: the
       object should feel aware of the cursor, not tethered to it. */
    g.rotation.y += (flight.px * 0.42 - g.rotation.y) * (1 - Math.exp(-1.8 * dt));
    g.rotation.x += (-flight.py * 0.26 - g.rotation.x) * (1 - Math.exp(-1.8 * dt));

    /* Scroll pulls the core apart and pushes it back: leaving the hero
       does not fade the object out, it disassembles it. */
    const d = Math.max(0, flight.station);
    const spread = 1 + Math.min(1.4, d) * 0.55;
    const collapse = 1 - Math.min(1, d * 0.5);

    if (massRef.current) {
      massRef.current.rotation.y = t * 0.09;
      massRef.current.rotation.x = Math.sin(t * 0.13) * 0.14;
      const s = 1 + Math.sin(t * 0.5) * 0.012;
      massRef.current.scale.setScalar(s * (0.6 + collapse * 0.4));
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.045;
      shellRef.current.rotation.z = t * 0.03;
      shellRef.current.scale.setScalar(spread);
    }

    ringRefs.forEach((r, i) => {
      if (!r.current) return;
      r.current.rotation.z = t * (0.05 + i * 0.03) * (i % 2 ? -1 : 1);
      r.current.scale.setScalar(spread);
    });

    [
      [shardsRef.current, brightShards],
      [darkShardsRef.current, darkShards],
    ].forEach(([mesh, list]) => {
      if (!mesh) return;
      list.forEach((sh, i) => {
        const a = sh.a + t * sh.speed;
        const rad = sh.radius * spread;
        euler.set(...RING_TILTS[sh.ring]);
        tmp.position.set(
          Math.cos(a) * rad,
          Math.sin(a * 0.7 + sh.wobble) * 0.9,
          Math.sin(a) * rad
        );
        tmp.position.applyEuler(euler);
        tmp.rotation.set(
          sh.tilt[0] + t * 0.12,
          sh.tilt[1] + t * 0.08,
          sh.tilt[2]
        );
        tmp.scale.set(...sh.scale);
        tmp.updateMatrix();
        mesh.setMatrixAt(i, tmp.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });

    if (nodesRef.current) {
      nodesRef.current.rotation.y = t * 0.07;
      nodesRef.current.scale.setScalar(spread);
      nodesRef.current.children.forEach((c, i) => {
        const pulse = 0.7 + Math.sin(t * 1.6 + i * 0.9) * 0.3;
        c.scale.setScalar(0.6 + pulse * 0.8);
      });
    }

    if (dustRef.current) {
      dustRef.current.rotation.y = -t * 0.02;
      dustRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
      dustRef.current.material.opacity = 0.5 * p;
    }
  });

  return (
    /* Off-centre and slightly back. Dead centre would make the cover a
       poster with an object stuck on it; sitting low and right puts the
       core on SINETH's shoulder and lets WICKRAMARATNA ride across its
       lower edge, which is the whole depth trick of the hero. */
    <group ref={group} position={[1.5, -1.15, -0.6]} scale={0.86}>
      {/* Volumetric suggestion: two coloured lights inside the shell so
          the chrome has something to be reflecting. */}
      <pointLight position={[0, 0, 0]} color={PALETTE.cyan} intensity={9} distance={9} />
      <pointLight position={[2.6, 1.8, 2.2]} color={PALETTE.violet} intensity={5} distance={11} />
      <pointLight position={[-2.8, -1.4, 1.6]} color={PALETTE.rose} intensity={2.2} distance={9} />

      {/* 1 — the restless chrome mass */}
      <mesh ref={massRef} castShadow={false}>
        <icosahedronGeometry args={[1.62, 24]} />
        <MeshDistortMaterial
          {...chrome}
          distort={0.34}
          speed={0.9}
          radius={1}
        />
      </mesh>

      {/* 2 — faceted acrylic shell, low subdivision so the facets read */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[2.42, 1]} />
        <meshPhysicalMaterial {...acrylic} side={THREE.DoubleSide} />
      </mesh>

      {/* 3 — inclined orbits */}
      {RING_TILTS.map((tilt, i) => (
        <group key={i} rotation={tilt}>
          <mesh ref={ringRefs[i]} geometry={i === 1 ? orbitGeoWide : orbitGeo}>
            <meshBasicMaterial {...holo(i === 2 ? PALETTE.violet : PALETTE.cyan, 0.5 - i * 0.09)} />
          </mesh>
        </group>
      ))}

      {/* 4 — geometric fragments on those orbits. Two passes rather than
          one: polished offcuts read as light, dark ones as mass, and the
          contrast between them is what gives the cage its depth. */}
      <instancedMesh ref={shardsRef} args={[shardGeo, null, brightShards.length]}>
        <meshStandardMaterial {...chrome} />
      </instancedMesh>
      <instancedMesh ref={darkShardsRef} args={[shardGeo, null, darkShards.length]}>
        <meshStandardMaterial {...chromeDark} />
      </instancedMesh>

      {/* 5 — the filament lattice and its nodes */}
      <group ref={nodesRef}>
        <lineSegments geometry={filaments}>
          <lineBasicMaterial
            {...holo(PALETTE.cyan, 0.16)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
        {nodePositions.map((p, i) => (
          <mesh key={i} position={p} geometry={nodeGeo}>
            <meshStandardMaterial
              {...emissive(i % 7 === 0 ? PALETTE.rose : PALETTE.cyan, 3.4)}
            />
          </mesh>
        ))}
      </group>

      {/* 6 — particle shell */}
      <points ref={dustRef} geometry={dust}>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          color={PALETTE.cyan}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
