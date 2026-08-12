import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, SKILL_NODES, STATION_INDEX } from '../../config';
import { holo, chrome, chromeDark, emissive } from '../materials';
import Label from '../Label';

/**
 * The neural map.
 *
 * The one place on the site the visitor is meant to *play*. Ten skills,
 * each a distinct solid — no two share a shape, because a field of
 * identical spheres is a chart, not a map. Hovering one swells it,
 * lights every edge it touches, nudges its neighbours aside and prints
 * a line of description into the void beside it.
 */

const INDEX = STATION_INDEX.skills;

/* One primitive per node, assigned by hand. The shapes are read as
   character: the language is a many-faced solid, the frameworks are
   engineered rings, design is a soft capsule. */
function NodeGeometry({ shape }) {
  switch (shape) {
    case 0:
      return <icosahedronGeometry args={[1, 1]} />;
    case 1:
      return <octahedronGeometry args={[1.15, 0]} />;
    case 2:
      return <torusGeometry args={[0.78, 0.3, 12, 32]} />;
    case 3:
      return <dodecahedronGeometry args={[1, 0]} />;
    case 4:
      return <boxGeometry args={[1.3, 1.3, 1.3]} />;
    case 5:
      return <torusKnotGeometry args={[0.6, 0.2, 64, 8, 2, 3]} />;
    case 6:
      return <tetrahedronGeometry args={[1.3, 0]} />;
    case 7:
      return <cylinderGeometry args={[0.85, 0.85, 0.5, 6]} />;
    case 8:
      return <capsuleGeometry args={[0.6, 0.5, 4, 12]} />;
    default:
      return <coneGeometry args={[0.95, 1.5, 5]} />;
  }
}

export default function NeuralMap({ onHover }) {
  const group = useRef();
  const nucleusRef = useRef();
  const meshRefs = useRef([]);
  const [hover, setHover] = useState(-1);
  const hoverRef = useRef(-1);

  const home = useMemo(
    () => SKILL_NODES.map((n) => new THREE.Vector3(...n.p)),
    []
  );

  /* Edges: every node is tied to the nucleus, plus the lateral links
     declared in the config. Those laterals are the whole point — they
     are what makes it a map of one practice rather than ten hobbies. */
  const { edgeGeo, edgeIndex } = useMemo(() => {
    const list = [];
    home.forEach((p, i) => {
      list.push({ a: new THREE.Vector3(0, 0, 0), b: p, owners: [i] });
      SKILL_NODES[i].links.forEach((j) => {
        if (j > i) list.push({ a: p, b: home[j], owners: [i, j] });
      });
    });
    const pos = new Float32Array(list.length * 6);
    list.forEach((e, k) => {
      pos.set([e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z], k * 6);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { edgeGeo: geo, edgeIndex: list };
  }, [home]);

  /* Illuminated edges are a second, additive pass over the same buffer,
     rebuilt on hover. Cheaper and sharper than recolouring per-vertex. */
  const litGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(edgeIndex.length * 6), 3)
    );
    geo.setDrawRange(0, 0);
    return geo;
  }, [edgeIndex]);

  const setHovered = (i) => {
    hoverRef.current = i;
    setHover(i);
    onHover?.(i >= 0 ? SKILL_NODES[i] : null);

    const arr = litGeo.attributes.position.array;
    let n = 0;
    if (i >= 0) {
      edgeIndex.forEach((e) => {
        if (!e.owners.includes(i)) return;
        arr.set([e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z], n * 6);
        n += 1;
      });
    }
    litGeo.attributes.position.needsUpdate = true;
    litGeo.setDrawRange(0, n * 2);
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    const d = flight.station - INDEX;
    /* Oscillating, not accumulating — the map is hand-placed for one
       viewing angle and a constant yaw would eventually turn it
       edge-on, collapsing ten nodes into a vertical smear. */
    g.rotation.y = flight.px * 0.36 + Math.sin(t * 0.06) * 0.1 - d * 0.2;
    g.rotation.x = -flight.py * 0.2;

    if (nucleusRef.current) {
      nucleusRef.current.rotation.y = -t * 0.14;
      nucleusRef.current.rotation.x = t * 0.08;
    }

    const h = hoverRef.current;
    meshRefs.current.forEach((m, i) => {
      if (!m) return;
      const node = SKILL_NODES[i];
      const active = h === i;
      const neighbour = h >= 0 && !active && SKILL_NODES[h].links.includes(i);

      /* Neighbours drift outward along their own radius — the network
         opens up around whatever is being inspected. */
      const push = neighbour ? 0.5 : 0;
      const p = home[i];
      const len = p.length() || 1;
      m.position.set(
        p.x * (1 + push / len) + Math.sin(t * 0.6 + i) * 0.07,
        p.y * (1 + push / len) + Math.cos(t * 0.5 + i * 1.7) * 0.07,
        p.z * (1 + push / len)
      );

      const target = node.r * (active ? 1.85 : neighbour ? 1.12 : 1);
      m.scale.lerp({ x: target, y: target, z: target }, 0.14);
      m.rotation.y += 0.0035 + (active ? 0.01 : 0);
      m.rotation.x += 0.0018;
    });
  });

  return (
    <group ref={group}>
      <pointLight position={[0, 0, 2]} color={PALETTE.cyan} intensity={4} distance={16} />
      <pointLight position={[6, 4, -4]} color={PALETTE.violet} intensity={2.6} distance={20} />
      <pointLight position={[-6, -3, 3]} color={PALETTE.rose} intensity={1.4} distance={16} />

      {/* Nucleus — the words DATA / INTELLIGENCE sit over this in the
          document layer, so in 3D it is only mass and reflection. */}
      <group ref={nucleusRef}>
        <mesh>
          <icosahedronGeometry args={[0.95, 2]} />
          <meshStandardMaterial {...chromeDark} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial {...holo(PALETTE.cyan, 0.07)} wireframe />
        </mesh>
      </group>

      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial
          {...holo(PALETTE.cyan, 0.12)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments geometry={litGeo}>
        <lineBasicMaterial
          {...holo(PALETTE.cyan, 0.85)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {SKILL_NODES.map((node, i) => (
        <group key={node.name}>
          <mesh
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
            position={node.p}
            scale={node.r}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(i);
            }}
            onPointerOut={() => setHovered(-1)}
          >
            <NodeGeometry shape={i} />
            <meshStandardMaterial
              {...(hover === i ? emissive(PALETTE.cyan, 1.6) : chrome)}
            />
          </mesh>

          <Label
            station={INDEX}
            position={node.p}
            center
            className={`nm-tag${hover === i ? ' is-on' : ''}`}
          >
            <span className="nm-tag-name">{node.name}</span>
            <span className="nm-tag-note">{node.note}</span>
          </Label>
        </group>
      ))}
    </group>
  );
}
