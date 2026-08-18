import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { flight } from '../../state/flight';
import { PALETTE, EXHIBITION, STATION_INDEX } from '../../config';
import { holo, chrome } from '../materials';
import { mulberry } from '../rng';
import { usePlateTexture, textureAspect } from '../usePlateTexture';
import Label from '../Label';

/**
 * The gallery.
 *
 * A room rather than a scatter: a back wall the visitor faces on
 * arrival, two side walls that only come into view once they move, and
 * a floor line to stand the whole thing on. Moving the pointer walks
 * the room — the amplitude is high here on purpose, because this is the
 * one station where the visitor is meant to feel they are moving their
 * own body rather than watching an object turn.
 *
 * Selecting a plate goes *into* it. The room recedes and dims, the
 * chosen work flies to the camera and squares up, and the document
 * layer takes over with the title and the ability to step through the
 * rest. Leaving returns it to exactly the hook it came off.
 */

const INDEX = STATION_INDEX.creative;

export default function Exhibition({ focus = -1, onFocus }) {
  const group = useRef();
  const [hover, setHover] = useState(-1);
  const focused = focus >= 0;

  const motes = useMemo(() => {
    const rng = mulberry(6161);
    const n = 300;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i += 1) {
      pos[i * 3] = (rng() - 0.5) * 20;
      pos[i * 3 + 1] = (rng() - 0.5) * 13;
      pos[i * 3 + 2] = (rng() - 0.5) * 16;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(0.05, delta);
    const g = group.current;
    if (!g) return;

    /* While a work is open the room stops answering the pointer and
       slides back, so nothing competes with what is being looked at. */
    const walkX = focused ? 0 : -flight.px * 2.4;
    const walkY = focused ? 0 : -flight.py * 1.0;
    const pushZ = focused ? -3.2 : 0;

    g.position.x += (walkX - g.position.x) * (1 - Math.exp(-3 * dt));
    g.position.y += (walkY - g.position.y) * (1 - Math.exp(-3 * dt));
    g.position.z += (pushZ - g.position.z) * (1 - Math.exp(-3.4 * dt));
    const yaw = focused ? 0 : flight.px * 0.2;
    g.rotation.y += (yaw - g.rotation.y) * (1 - Math.exp(-3 * dt));
    g.rotation.x = Math.sin(t * 0.1) * 0.015;
  });

  return (
    <group ref={group}>
      {/* Gallery lighting: enough to read the chrome edges, nowhere near
          enough to lift the room. The plates are their own light. */}
      <pointLight position={[0, 3, 6]} color={PALETTE.bright} intensity={4} distance={24} />
      <pointLight position={[-8, -2, 0]} color={PALETTE.cyan} intensity={3} distance={20} />
      <pointLight position={[8, 2, -4]} color={PALETTE.violet} intensity={2.2} distance={20} />

      {EXHIBITION.map((piece, i) => (
        <Plate
          key={`${piece.title}-${i}`}
          piece={piece}
          index={i}
          hovered={hover === i}
          focused={focus === i}
          dimmed={focus >= 0 && focus !== i}
          onEnter={() => setHover(i)}
          onLeave={() => setHover((h) => (h === i ? -1 : h))}
          onSelect={() => onFocus?.(focus === i ? -1 : i)}
        />
      ))}

      {/* The floor line. One hairline is enough to say "room"; a lit
          plane would say "stage". */}
      <mesh position={[0, -4.6, -4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 14, 1, 1]} />
        <meshBasicMaterial
          {...holo(PALETTE.cyan, 0.045)}
          wireframe
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

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

function Plate({
  piece,
  index,
  hovered,
  focused,
  dimmed,
  onEnter,
  onLeave,
  onSelect,
}) {
  const ref = useRef();
  const artRef = useRef();
  const camera = useThree((s) => s.camera);
  const texture = usePlateTexture(piece.src);

  /* Poster proportions vary; derive the plate's aspect from the image
     itself so nothing is stretched. Portrait is the safe default —
     every piece here is a poster. */
  const aspect = textureAspect(texture, 0.72);

  const w = piece.w;
  const h = piece.w / aspect;

  const home = useMemo(() => new THREE.Vector3(...piece.p), [piece.p]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const forward = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(0.05, delta);
    const g = ref.current;
    if (!g) return;

    if (focused) {
      /* Fly to a point along the camera's own view direction, then bring
         that point into the room's local space — the room is itself
         moving and rotating, so a fixed local offset would land the
         work beside the viewer rather than in front of them. */
      forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
      target.copy(camera.position).addScaledVector(forward, 5.4);
      g.parent.worldToLocal(target);
      g.position.lerp(target, 1 - Math.exp(-4.5 * dt));
      /* Square up to the viewer. */
      g.rotation.x += (0 - g.rotation.x) * (1 - Math.exp(-4.5 * dt));
      g.rotation.y += (0 - g.rotation.y) * (1 - Math.exp(-4.5 * dt));
      g.rotation.z += (0 - g.rotation.z) * (1 - Math.exp(-4.5 * dt));
      /* Fill a comfortable portion of the frame regardless of the
         plate's own size — a wristband and a poster should both arrive
         at a readable scale. Sized against the visible height at the
         distance it is flying to, so it fits whatever the viewport is. */
      const visibleH =
        2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 5.4;
      const want = Math.min(
        (visibleH * 0.74) / h,
        (visibleH * camera.aspect * 0.5) / w
      );
      const s = g.scale.x + (want - g.scale.x) * (1 - Math.exp(-4.5 * dt));
      g.scale.setScalar(s);
    } else {
      const drift = Math.sin(t * 0.35 + index * 1.7) * 0.1;
      target.set(home.x, home.y + drift, home.z + (hovered ? 0.9 : 0));
      g.position.lerp(target, 1 - Math.exp(-4 * dt));
      const targetTilt = hovered ? 0 : piece.tilt;
      g.rotation.y += (targetTilt - g.rotation.y) * (1 - Math.exp(-4 * dt));
      g.rotation.z = Math.sin(t * 0.25 + index) * 0.01;
      const s = hovered ? 1.05 : 1;
      g.scale.setScalar(g.scale.x + (s - g.scale.x) * (1 - Math.exp(-5 * dt)));
    }

    /* Everything not being looked at settles back rather than going
       dark. The point of opening a work here is to stand in front of it
       *in the room*, so the room has to still be visible around it —
       erase the rest and this stops being a gallery and becomes a
       lightbox with a 3D background. */
    const wantOpacity = dimmed ? 0.42 : 1;
    if (artRef.current) {
      const m = artRef.current.material;
      m.opacity += (wantOpacity - m.opacity) * (1 - Math.exp(-4 * dt));
    }
  });

  return (
    <group ref={ref} position={piece.p}>
      {/* chrome edge */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[w + 0.06, h + 0.06, 0.04]} />
        <meshStandardMaterial {...chrome} />
      </mesh>

      <mesh
        ref={artRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onEnter();
        }}
        onPointerOut={onLeave}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
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
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>

      {/* A hairline under the plate rather than a pool of light on a
          floor — a lit quad lying flat in the void reads as a stray
          polygon, not as a spill. */}
      <mesh position={[0, -h / 2 - 0.06, 0]}>
        <planeGeometry args={[w + 0.06, 0.012]} />
        <meshBasicMaterial
          {...holo(PALETTE.cyan, hovered || focused ? 0.9 : 0.28)}
          depthWrite={false}
        />
      </mesh>

      {/* One caption at a time, on the plate being pointed at.
          ------------------------------------------------------------
          Fourteen captions are positioned by projecting 3D points to
          the screen, and the room walks with the pointer — so any of
          them can land anywhere, including on top of the section's own
          copy. Showing only the hovered one bounds the problem
          completely: the single visible caption is always beside the
          cursor, which is the one place the reader is already looking
          and the one place the copy is not. */}
      {hovered && !focused && !dimmed && (
        <Label
          station={INDEX}
          position={[-w / 2, -h / 2 - 0.2, 0.1]}
          className="ex-plate is-on"
        >
          <span className="ex-kind">{piece.kind}</span>
          <span className="ex-title">{piece.title}</span>
        </Label>
      )}
    </group>
  );
}
