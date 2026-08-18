import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { flight, presence } from '../../state/flight';
import { PALETTE, STATION_INDEX, CERTIFICATES } from '../../config';
import { holo, chrome, emissive } from '../materials';
import { certImage } from '../../certImages';
import { usePlateTexture, textureAspect } from '../usePlateTexture';

const INDEX = STATION_INDEX.credentials;

/* Every pane is the same height so the fan stays even; the width follows
   from each certificate's own proportions. */
const PANE_H = 1.8;

/**
 * The credential stack.
 *
 * One pane per certificate, carrying the certificate itself, fanned
 * along a shallow arc so the set reads as a stack that has been riffled
 * rather than a grid of badges. The pane matching the row under the
 * cursor slides forward, squares up and comes to full brightness; the
 * rest hold their place and sit back.
 *
 * The panes were blank at first, on the reasoning that images belong in
 * the document layer where they can be crisp. That was wrong: seven
 * identical empty rectangles read as placeholders waiting to load. The
 * artwork is the whole point of a certificate.
 */
export default function CredentialStack({ active = -1, onSelect }) {
  const group = useRef();
  const dustRef = useRef();

  const panes = useMemo(
    () =>
      CERTIFICATES.map((c, i) => {
        const t = i / Math.max(1, CERTIFICATES.length - 1);
        return {
          key: c.title,
          src: certImage(c.image),
          /* A shallow arc, leaning away as it recedes. Spread wider than
             the panes are tall so each one's face stays partly clear of
             the one in front. */
          x: -2.2 + t * 4.4,
          y: 1.55 - t * 2.9,
          z: -t * 3.4,
          rot: -0.44 + t * 0.24,
        };
      }),
    []
  );

  const dust = useMemo(() => {
    const n = 160;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    g.rotation.y = flight.px * 0.22 + Math.sin(t * 0.12) * 0.05;
    g.rotation.x = -flight.py * 0.12;
    g.position.y = Math.sin(t * 0.22) * 0.09;

    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.014;
      dustRef.current.material.opacity = 0.3 * presence(INDEX, 1.2);
    }
  });

  return (
    /* Offset right and up: the ledger owns the left half of the frame,
       and the fan descends as it recedes. */
    <group ref={group} position={[2.4, 0.5, 0]}>
      <pointLight position={[0, 1, 5]} color={PALETTE.cyan} intensity={5} distance={18} />
      <pointLight position={[-5, 3, 1]} color={PALETTE.violet} intensity={2.2} distance={16} />
      <pointLight position={[4, -3, 2]} color={PALETTE.rose} intensity={1.2} distance={14} />

      {panes.map((p, i) => (
        <Pane
          key={p.key}
          pane={p}
          active={i === active}
          onEnter={() => onSelect?.(i)}
          onLeave={() => onSelect?.(-1)}
        />
      ))}

      <points ref={dustRef} geometry={dust}>
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

function Pane({ pane, active, onEnter, onLeave }) {
  const ref = useRef();
  const artRef = useRef();
  const texture = usePlateTexture(pane.src);

  /* Certificates are mostly landscape but not uniformly, so the width
     comes from the image rather than from a guess. */
  const aspect = textureAspect(texture, 1.4);
  const w = PANE_H * aspect;
  const h = PANE_H;

  const edgeGeo = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(w + 0.05, h + 0.05, 0.03)
      ),
    [w, h]
  );

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);
    const g = ref.current;
    if (!g) return;

    /* Damped rather than set, so moving down the ledger riffles the
       stack instead of snapping it. */
    const targetZ = pane.z + (active ? 2.1 : 0);
    const targetRot = pane.rot + (active ? 0.44 : 0);
    g.position.z += (targetZ - g.position.z) * (1 - Math.exp(-6 * dt));
    g.rotation.y += (targetRot - g.rotation.y) * (1 - Math.exp(-6 * dt));
    const s = active ? 1.14 : 1;
    g.scale.x += (s - g.scale.x) * (1 - Math.exp(-6 * dt));
    g.scale.y = g.scale.x;

    /* Unselected panes sit back rather than disappear — the stack has to
       stay legible as a stack. */
    if (artRef.current) {
      const m = artRef.current.material;
      const want = active ? 1 : 0.42;
      m.opacity += (want - m.opacity) * (1 - Math.exp(-6 * dt));
    }
  });

  return (
    <group
      ref={ref}
      position={[pane.x, pane.y, pane.z]}
      rotation={[0.05, pane.rot, 0.015]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onLeave();
      }}
    >
      {/* An opaque backing, so a certificate printed on white paper is
          not read through by whatever is behind it in the stack. */}
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[w + 0.05, h + 0.05]} />
        <meshBasicMaterial color="#080a0c" />
      </mesh>

      {/* The certificate. Keyed on whether a map exists yet: a material
          compiled without one has no sampler and stays flat until the
          shader is rebuilt. */}
      <mesh ref={artRef}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          key={texture ? 'art' : 'blank'}
          map={texture || null}
          /* Certificates are printed on white paper, which is the one
             thing this palette has none of — at full luminance seven of
             them punch a hole in the void. Unselected panes are graded
             down hard and only the one being read comes up to true
             colour. */
          color={texture ? (active ? '#ffffff' : '#5f6a75') : '#101418'}
          transparent
          opacity={0.42}
          toneMapped={false}
        />
      </mesh>

      {/* A lit edge, which is what makes it read as a pane rather than a
          picture floating in space. */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial
          {...holo(active ? PALETTE.cyan : PALETTE.muted, active ? 0.8 : 0.24)}
        />
      </lineSegments>

      {/* Seal, bottom right. */}
      <mesh position={[w / 2 - 0.2, -h / 2 + 0.18, 0.02]}>
        <cylinderGeometry args={[0.075, 0.075, 0.02, 6]} />
        <meshStandardMaterial {...(active ? emissive(PALETTE.cyan, 2.4) : chrome)} />
      </mesh>
    </group>
  );
}
