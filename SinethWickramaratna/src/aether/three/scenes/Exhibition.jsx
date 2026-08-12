import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, EXHIBITION, STATION_INDEX } from '../../config';
import { holo, chrome } from '../materials';
import { mulberry } from '../rng';
import Label from '../Label';

/**
 * The exhibition.
 *
 * Design work hung in a room, at real and different depths, with the
 * camera walking between the plates rather than past a wall of them.
 * Each plate has a chrome edge and a thin light on the floor beneath
 * it — the two details that separate "hung artwork" from "image on a
 * quad". Hovering brings a plate forward and squares it to the viewer.
 */

const INDEX = STATION_INDEX.creative;

export default function Exhibition() {
  const group = useRef();
  const [hover, setHover] = useState(-1);

  const motes = useMemo(() => {
    const rng = mulberry(6161);
    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      pos[i * 3] = (rng() - 0.5) * 18;
      pos[i * 3 + 1] = (rng() - 0.5) * 12;
      pos[i * 3 + 2] = (rng() - 0.5) * 12;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    /* The room drifts laterally with the pointer — the walk-through.
       Amplitude is high here on purpose; this is the one section where
       the visitor is meant to feel they are moving their own body. */
    g.position.x = -flight.px * 1.9;
    g.position.y = -flight.py * 0.8;
    g.rotation.y = flight.px * 0.16;
    g.rotation.x = Math.sin(t * 0.1) * 0.02;
  });

  return (
    <group ref={group}>
      {/* Gallery lighting: enough to read the chrome edges, nowhere near
          enough to lift the room. The plates are their own light. */}
      <pointLight position={[0, 3, 6]} color={PALETTE.bright} intensity={4} distance={20} />
      <pointLight position={[-7, -2, 2]} color={PALETTE.cyan} intensity={3} distance={18} />
      <pointLight position={[7, 2, -4]} color={PALETTE.violet} intensity={2.2} distance={18} />

      {EXHIBITION.map((piece, i) => (
        <Plate
          key={piece.title}
          piece={piece}
          index={i}
          hovered={hover === i}
          onEnter={() => setHover(i)}
          onLeave={() => setHover((h) => (h === i ? -1 : h))}
        />
      ))}

      <points geometry={motes}>
        <pointsMaterial
          size={0.02}
          sizeAttenuation
          color={PALETTE.cyan}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/**
 * The artwork is hosted off-site, which means any one of these five
 * requests can fail — a blocked host, an expired link, a hostile
 * network. `useLoader` would turn that into a thrown promise inside the
 * shared Suspense boundary and take the entire world down with it, so
 * the loading is done by hand: the plate renders as a chrome frame
 * immediately and adopts the image only if it arrives.
 */
function usePlateTexture(src) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let live = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      src,
      (tex) => {
        if (!live) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => {}
    );
    return () => {
      live = false;
    };
  }, [src]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}

function Plate({ piece, index, hovered, onEnter, onLeave }) {
  const ref = useRef();
  const texture = usePlateTexture(piece.src);

  /* Poster proportions vary; derive the plate's aspect from the image
     itself so nothing is stretched. Portrait is the safe default —
     every piece here is a poster. */
  const aspect = useMemo(() => {
    const img = texture?.image;
    if (!img?.width || !img?.height) return 0.72;
    return img.width / img.height;
  }, [texture]);

  const w = piece.scale * aspect;
  const h = piece.scale;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = ref.current;
    if (!g) return;
    const drift = Math.sin(t * 0.35 + index * 1.7) * 0.13;
    g.position.set(
      piece.p[0],
      piece.p[1] + drift,
      piece.p[2] + (hovered ? 1.1 : 0)
    );
    const targetTilt = hovered ? 0 : piece.tilt;
    g.rotation.y += (targetTilt - g.rotation.y) * 0.09;
    g.rotation.z = Math.sin(t * 0.25 + index) * 0.012;
    const s = hovered ? 1.06 : 1;
    g.scale.lerp({ x: s, y: s, z: s }, 0.1);
  });

  return (
    <group ref={ref}>
      {/* chrome edge */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[w + 0.06, h + 0.06, 0.04]} />
        <meshStandardMaterial {...chrome} />
      </mesh>

      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onEnter();
        }}
        onPointerOut={onLeave}
      >
        <planeGeometry args={[w, h]} />
        {/* Keyed on whether there is a map yet. A material compiled
            without one has no sampler in its shader, so assigning `map`
            later leaves it flat white until the program is rebuilt —
            remounting the material is the cheap, certain fix. */}
        <meshBasicMaterial
          key={texture ? 'plate' : 'blank'}
          map={texture || null}
          color={texture ? '#cfd6dd' : '#0d0f10'}
          toneMapped={false}
        />
      </mesh>

      {/* A hairline under the plate rather than a pool of light on a
          floor. There is no floor in this room — a lit quad lying flat
          in the void reads as a stray polygon, not as a spill. */}
      <mesh position={[0, -h / 2 - 0.06, 0]}>
        <planeGeometry args={[w + 0.06, 0.012]} />
        <meshBasicMaterial
          {...holo(PALETTE.cyan, hovered ? 0.9 : 0.28)}
          depthWrite={false}
        />
      </mesh>

      <Label
        station={INDEX}
        position={[-w / 2, -h / 2 - 0.22, 0.1]}
        className={`ex-plate${hovered ? ' is-on' : ''}`}
      >
        <span className="ex-kind">{piece.kind}</span>
        <span className="ex-title">{piece.title}</span>
      </Label>
    </group>
  );
}
