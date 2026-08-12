import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, STATION_INDEX } from '../../config';
import { holo, chrome, chromeDark, metal, acrylic, emissive } from '../materials';
import { mulberry, range } from '../rng';

/**
 * Four projects, four unrelated objects.
 *
 * Reusing one shape across a body of work says the work is
 * interchangeable. Each of these was built from the thing the project
 * actually does: language becomes filaments strung with text fragments,
 * recommendation becomes bodies in orbit, vision becomes an aperture
 * scanning a point cloud, and a study platform becomes architecture.
 */

const lean = (g, mult = 1) => {
  g.rotation.y = flight.px * 0.3 * mult;
  g.rotation.x = -flight.py * 0.18 * mult;
};

/* ================================================================== *
 * 01 — VeriText AI · neural filaments threaded with text fragments
 * ================================================================== */
export function LanguageFilaments() {
  const group = useRef();
  const strandRefs = useRef([]);
  const glyphsRef = useRef();
  const coreRef = useRef();

  /* Strands are Catmull-Rom curves through jittered control points,
     tubed thin. They read as a sentence being traced through a model. */
  const strands = useMemo(() => {
    const rng = mulberry(3301);
    return Array.from({ length: 9 }, (_, i) => {
      const pts = [];
      const yaw = (i / 9) * Math.PI * 2;
      for (let k = 0; k <= 7; k += 1) {
        const t = k / 7;
        const r = 1.0 + Math.sin(t * Math.PI) * (2.4 + rng() * 1.6);
        pts.push(
          new THREE.Vector3(
            Math.cos(yaw + t * 1.9) * r,
            (t - 0.5) * 7.4 + range(rng, -0.4, 0.4),
            Math.sin(yaw + t * 1.9) * r * 0.7
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      return {
        geometry: new THREE.TubeGeometry(curve, 90, 0.012 + rng() * 0.012, 3, false),
        curve,
        phase: rng() * Math.PI * 2,
      };
    });
  }, []);

  /* Text fragments: thin slabs riding the strands. Actual glyphs would
     be unreadable at this scale and would fight the display type in the
     document layer — the shape of language is enough. */
  const glyphs = useMemo(() => {
    const rng = mulberry(8812);
    return Array.from({ length: 44 }, () => ({
      strand: Math.floor(rng() * 9),
      t: rng(),
      speed: 0.02 + rng() * 0.05,
      w: range(rng, 0.12, 0.5),
      h: range(rng, 0.03, 0.055),
    }));
  }, []);

  const glyphGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    lean(group.current);
    /* `+=` with an ever-growing `t` compounds — the strands would be
       spinning several turns a second by the time anyone scrolled here.
       A bounded oscillation on top of the pointer lean instead. */
    group.current.rotation.y += Math.sin(t * 0.09) * 0.14;

    strandRefs.current.forEach((m, i) => {
      if (!m) return;
      m.material.opacity = 0.18 + Math.sin(t * 0.7 + strands[i].phase) * 0.1;
    });

    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.2;
      coreRef.current.rotation.z = -t * 0.14;
    }

    if (glyphsRef.current) {
      glyphs.forEach((g, i) => {
        const s = strands[g.strand];
        const at = (g.t + t * g.speed) % 1;
        s.curve.getPointAt(at, v);
        tmp.position.copy(v);
        tmp.rotation.set(0, t * 0.3 + i, 0);
        tmp.scale.set(g.w, g.h, 1);
        tmp.updateMatrix();
        glyphsRef.current.setMatrixAt(i, tmp.matrix);
      });
      glyphsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 0, 3]} color={PALETTE.cyan} intensity={6} distance={14} />
      <pointLight position={[-4, 3, -2]} color={PALETTE.violet} intensity={3} distance={14} />

      {strands.map((s, i) => (
        <mesh
          key={i}
          geometry={s.geometry}
          ref={(el) => {
            strandRefs.current[i] = el;
          }}
        >
          <meshBasicMaterial
            {...holo(i % 4 === 0 ? PALETTE.violet : PALETTE.cyan, 0.22)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <group ref={coreRef}>
        <mesh>
          <torusGeometry args={[1.15, 0.03, 8, 90]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.025, 8, 90]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.42, 2]} />
          <meshStandardMaterial {...emissive(PALETTE.cyan, 1.8)} />
        </mesh>
      </group>

      <instancedMesh ref={glyphsRef} args={[glyphGeo, null, glyphs.length]}>
        <meshBasicMaterial
          {...holo(PALETTE.bright, 0.5)}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

/* ================================================================== *
 * 02 — CineMatch · bodies in orbit around a recommendation graph
 * ================================================================== */
export function MediaOrbit() {
  const group = useRef();
  const platesRef = useRef([]);
  const hubRef = useRef();
  const ringsRef = useRef();

  /* Film fragments: thin rounded slabs on inclined ellipses, each with
     its own period, so the arrangement never repeats. */
  const plates = useMemo(() => {
    const rng = mulberry(5150);
    return Array.from({ length: 13 }, (_, i) => ({
      a: rng() * Math.PI * 2,
      rx: range(rng, 2.6, 5.4),
      rz: range(rng, 1.6, 3.4),
      y: range(rng, -2.4, 2.4),
      speed: (0.05 + rng() * 0.09) * (i % 3 === 0 ? -1 : 1),
      w: range(rng, 0.5, 1.05),
      h: range(rng, 0.7, 1.5),
      tilt: range(rng, -0.5, 0.5),
      glass: i % 3 === 0,
    }));
  }, []);

  const linkGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(plates.length * 6), 3)
    );
    return geo;
  }, [plates.length]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    lean(group.current);

    const arr = linkGeo.attributes.position.array;
    plates.forEach((p, i) => {
      const m = platesRef.current[i];
      if (!m) return;
      const a = p.a + t * p.speed;
      const x = Math.cos(a) * p.rx;
      const z = Math.sin(a) * p.rz;
      const y = p.y + Math.sin(t * 0.4 + i) * 0.16;
      m.position.set(x, y, z);
      // Plates always face the viewer's side of the orbit, the way a
      // poster in a rack turns to be read.
      m.rotation.set(p.tilt * 0.4, -a + Math.PI / 2, p.tilt);
      arr.set([0, 0, 0, x, y, z], i * 6);
    });
    linkGeo.attributes.position.needsUpdate = true;

    if (hubRef.current) {
      hubRef.current.rotation.y = t * 0.16;
      hubRef.current.rotation.z = Math.sin(t * 0.3) * 0.2;
    }
    if (ringsRef.current) ringsRef.current.rotation.y = -t * 0.06;
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 0, 2]} color={PALETTE.cyan} intensity={7} distance={16} />
      <pointLight position={[4, -2, 3]} color={PALETTE.rose} intensity={2.6} distance={14} />

      <group ref={hubRef}>
        <mesh>
          <cylinderGeometry args={[0.72, 0.72, 0.16, 48]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.02, 8, 80]} />
          <meshBasicMaterial {...holo(PALETTE.cyan, 0.6)} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial {...emissive(PALETTE.cyan, 2.4)} />
        </mesh>
      </group>

      <lineSegments geometry={linkGeo}>
        <lineBasicMaterial
          {...holo(PALETTE.cyan, 0.14)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <group ref={ringsRef}>
        {[3.4, 4.6, 5.6].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2 + i * 0.16, 0, i * 0.3]}>
            <torusGeometry args={[r, 0.004, 3, 180]} />
            <meshBasicMaterial {...holo(i === 1 ? PALETTE.violet : PALETTE.cyan, 0.3)} />
          </mesh>
        ))}
      </group>

      {plates.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            platesRef.current[i] = el;
          }}
        >
          <boxGeometry args={[p.w, p.h, 0.02]} />
          {p.glass ? (
            <meshPhysicalMaterial {...acrylic} />
          ) : (
            <meshStandardMaterial {...(i % 2 ? chrome : chromeDark)} />
          )}
        </mesh>
      ))}
    </group>
  );
}

/* ================================================================== *
 * 03 — Perception · aperture, scan plane, point cloud
 * ================================================================== */
export function VisionAperture() {
  const group = useRef();
  const irisRef = useRef();
  const bladesRef = useRef([]);
  const scanRef = useRef();
  const cloudRef = useRef();
  const pupilRef = useRef();

  /* A point cloud shaped like a face-sized volume rather than a sphere,
     so the scan plane crossing it has something to reveal. */
  const cloud = useMemo(() => {
    const rng = mulberry(6023);
    const n = 900;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      const a = rng() * Math.PI * 2;
      const r = Math.pow(rng(), 0.4) * 3.2;
      const y = range(rng, -2.6, 2.6);
      const squash = 1 - (y / 3.6) ** 2 * 0.5;
      pos[i * 3] = Math.cos(a) * r * squash;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(a) * r * squash * 0.6 - 1.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const blades = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);

  /* The scanning grid: a wire plane that sweeps the cloud top to bottom. */
  const gridGeo = useMemo(() => new THREE.PlaneGeometry(7.2, 7.2, 22, 22), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    lean(group.current, 1.3);

    /* The iris tracks the cursor directly — this is the one object on
       the site that should feel like it is looking back. */
    if (irisRef.current) {
      irisRef.current.rotation.y = flight.px * 0.55;
      irisRef.current.rotation.x = -flight.py * 0.4;
    }

    const open = 0.55 + Math.sin(t * 0.35) * 0.12 + Math.abs(flight.px) * 0.2;
    bladesRef.current.forEach((b, i) => {
      if (!b) return;
      const a = (i / blades.length) * Math.PI * 2;
      b.position.set(Math.cos(a) * open * 2.5, Math.sin(a) * open * 2.5, 0);
      b.rotation.z = a + Math.PI / 2;
    });

    if (pupilRef.current) {
      const s = 0.6 + Math.sin(t * 1.1) * 0.05;
      pupilRef.current.scale.setScalar(s);
    }

    if (scanRef.current) {
      const sweep = ((t * 0.28) % 1) * 2 - 1;
      scanRef.current.position.y = sweep * 3.2;
      scanRef.current.material.opacity = 0.12 * (1 - Math.abs(sweep));
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.05;
      cloudRef.current.material.size = 0.02 + Math.sin(t * 1.5) * 0.004;
    }
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 0, 4]} color={PALETTE.cyan} intensity={8} distance={14} />
      <pointLight position={[-5, 2, -2]} color={PALETTE.violet} intensity={2.4} distance={16} />

      <group ref={irisRef}>
        {/* Aperture blades. Chrome rather than dark metal: against a
            black void, unlit metal is invisible, and the blades are the
            one part of this object that has to read as machined. */}
        {blades.map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              bladesRef.current[i] = el;
            }}
          >
            <boxGeometry args={[2.4, 0.16, 0.22]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
        ))}

        {[2.9, 3.25].map((r, i) => (
          <mesh key={r}>
            <torusGeometry args={[r, i ? 0.02 : 0.09, 12, 140]} />
            <meshStandardMaterial {...(i ? chrome : chromeDark)} />
          </mesh>
        ))}

        {/* The pupil. Opaque and emissive rather than transmissive — a
            refraction pass on a body this size costs a full extra
            render for an effect the bloom already gives. */}
        <mesh ref={pupilRef}>
          <sphereGeometry args={[1.2, 40, 40]} />
          <meshStandardMaterial
            color="#04141a"
            metalness={0.65}
            roughness={0.12}
            emissive={PALETTE.cyan}
            emissiveIntensity={0.85}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[1.42, 0.01, 8, 120]} />
          <meshBasicMaterial {...holo(PALETTE.cyan, 0.9)} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.95, 0.005, 6, 120]} />
          <meshBasicMaterial {...holo(PALETTE.violet, 0.4)} />
        </mesh>
      </group>

      <mesh ref={scanRef} geometry={gridGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.4]}>
        <meshBasicMaterial
          {...holo(PALETTE.cyan, 0.12)}
          wireframe
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <points ref={cloudRef} geometry={cloud}>
        <pointsMaterial
          size={0.022}
          sizeAttenuation
          color={PALETTE.cyan}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/* ================================================================== *
 * 04 — Academent · knowledge architecture with documents in suspension
 * ================================================================== */
export function KnowledgeArchitecture() {
  const group = useRef();
  const towerRef = useRef();
  const docsRef = useRef();
  const spineRef = useRef();

  /* Floors: concentric frames stepping outward and inward, so the
     structure has a silhouette instead of being a stack of equal discs. */
  const floors = useMemo(() => {
    const rng = mulberry(1204);
    return Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      const r = 1.1 + Math.sin(t * Math.PI) * 2.3;
      return {
        y: (t - 0.5) * 6.4,
        r,
        thickness: 0.012 + rng() * 0.01,
        spin: (rng() - 0.5) * 0.4,
        sides: 3 + Math.floor(rng() * 4),
      };
    });
  }, []);

  const docs = useMemo(() => {
    const rng = mulberry(4499);
    return Array.from({ length: 30 }, () => ({
      a: rng() * Math.PI * 2,
      r: range(rng, 1.5, 4.6),
      y: range(rng, -3.2, 3.2),
      speed: (0.03 + rng() * 0.06) * (rng() > 0.5 ? 1 : -1),
      w: range(rng, 0.22, 0.44),
      h: range(rng, 0.3, 0.58),
      tilt: range(rng, -0.4, 0.4),
    }));
  }, []);

  const docGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const tmp = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    lean(group.current, 0.8);

    if (towerRef.current) {
      towerRef.current.rotation.y = t * 0.05;
      towerRef.current.children.forEach((c, i) => {
        c.rotation.z = (floors[i]?.spin ?? 0) * t;
      });
    }
    if (spineRef.current) spineRef.current.rotation.y = -t * 0.11;

    if (docsRef.current) {
      docs.forEach((d, i) => {
        const a = d.a + t * d.speed;
        tmp.position.set(
          Math.cos(a) * d.r,
          d.y + Math.sin(t * 0.3 + i) * 0.2,
          Math.sin(a) * d.r * 0.7
        );
        tmp.rotation.set(d.tilt, -a, d.tilt * 0.6);
        tmp.scale.set(d.w, d.h, 1);
        tmp.updateMatrix();
        docsRef.current.setMatrixAt(i, tmp.matrix);
      });
      docsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 1, 3]} color={PALETTE.cyan} intensity={6} distance={16} />
      <pointLight position={[3, -3, -2]} color={PALETTE.violet} intensity={3} distance={16} />

      <group ref={towerRef}>
        {floors.map((f, i) => (
          <mesh key={i} position={[0, f.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[f.r, f.thickness, 3, f.sides * 2]} />
            <meshStandardMaterial {...(i % 2 ? chrome : chromeDark)} />
          </mesh>
        ))}
      </group>

      <group ref={spineRef}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 6.8, 12]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
        {[-2.1, 0, 2.1].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <octahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial {...emissive(PALETTE.cyan, 2.4)} />
          </mesh>
        ))}
      </group>

      <instancedMesh ref={docsRef} args={[docGeo, null, docs.length]}>
        <meshBasicMaterial
          {...holo(PALETTE.bright, 0.28)}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

export const PROJECT_VISUALS = {
  filaments: LanguageFilaments,
  orbit: MediaOrbit,
  eye: VisionAperture,
  archive: KnowledgeArchitecture,
};

export const PROJECT_STATIONS = [
  STATION_INDEX['work-1'],
  STATION_INDEX['work-2'],
  STATION_INDEX['work-3'],
  STATION_INDEX['work-4'],
];
