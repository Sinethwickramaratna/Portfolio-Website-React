import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PALETTE, SECTION_COUNT, SECTION_SPACING } from '../worldConfig';
import { world } from '../state/worldState';

/**
 * Image-based lighting, generated at runtime.
 *
 * Liquid chrome needs something to reflect. RoomEnvironment ships with
 * three and is built procedurally, so the world gets convincing metal
 * reflections without downloading a single HDR map.
 */
export function ChromeEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();

    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      room.dispose?.();
    };
  }, [gl, scene]);

  return null;
}

/**
 * Three coloured lights that ride along with the camera.
 *
 * Placing accent lights at every environment would mean a dozen lights
 * in every shader compile. Instead a fixed rig travels down the
 * corridor, so lighting is identical everywhere and costs three lights
 * total.
 */
export function TravellingLights() {
  const key = useRef(null);
  const fill = useRef(null);
  const rim = useRef(null);
  const { camera } = useThree();

  useFrame(() => {
    const z = camera.position.z;
    if (key.current) key.current.position.set(38, 26, z - 18);
    if (fill.current) fill.current.position.set(-42, -14, z - 34);
    if (rim.current) rim.current.position.set(0, 8, z - 96);
  });

  return (
    <>
      <ambientLight intensity={0.28} color={PALETTE.light} />
      <hemisphereLight
        intensity={0.22}
        color={PALETTE.cyan}
        groundColor={PALETTE.void}
      />
      <pointLight ref={key} color={PALETTE.cyan} intensity={900} distance={340} decay={2} />
      <pointLight ref={fill} color={PALETTE.violet} intensity={700} distance={320} decay={2} />
      <pointLight ref={rim} color={PALETTE.magenta} intensity={420} distance={280} decay={2} />
    </>
  );
}

/**
 * Static particle volume spanning the whole corridor. Gives parallax and
 * a sense of scale as the camera moves; costs one draw call.
 */
/** Deterministic pseudo-random. The starfield must be identical on every
 *  load — and generating it during render has to stay pure. */
function seeded(i, salt = 1) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function StarField({ count = 2200 }) {
  const points = useRef(null);

  const { geometry, material } = useMemo(() => {
    const depth = SECTION_SPACING * (SECTION_COUNT - 1);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cCyan = new THREE.Color(PALETTE.cyan);
    const cViolet = new THREE.Color(PALETTE.violet);
    const cLight = new THREE.Color(PALETTE.light);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (seeded(i, 1) - 0.5) * 900;
      positions[i3 + 1] = (seeded(i, 2) - 0.5) * 620;
      positions[i3 + 2] = 140 - seeded(i, 3) * (depth + 320);

      // Overwhelmingly white/grey, with a minority of coloured motes —
      // the restraint is what makes the accents read as expensive.
      const roll = seeded(i, 4);
      const c = roll > 0.93 ? cCyan : roll > 0.87 ? cViolet : cLight;
      const dim = 0.35 + seeded(i, 5) * 0.65;
      colors[i3] = c.r * dim;
      colors[i3 + 1] = c.g * dim;
      colors[i3 + 2] = c.b * dim;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.15,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: true,
    });

    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useFrame((_, delta) => {
    if (!points.current) return;
    // Barely-there drift, plus a lateral lean from the pointer.
    points.current.rotation.z += delta * 0.004;
    points.current.position.x = world.pointer.x * -6;
    points.current.position.y = world.pointer.y * 4;
  });

  return <points ref={points} geometry={geometry} material={material} />;
}
