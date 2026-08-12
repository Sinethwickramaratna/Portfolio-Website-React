import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './AetherField.css';

/* Geometry of the flight path -------------------------------------- */
const FIELD_DEPTH = 2800;      // how deep the particle volume runs
const GATE_COUNT = 6;          // wireframe rings you pass through
const SPREAD_X = 1500;
const SPREAD_Y = 1000;

/* Palette ---------------------------------------------------------- */
const PALETTE = {
  dark: {
    aether: new THREE.Color(0x35e2ff),
    flux: new THREE.Color(0x8b5cff),
    frost: new THREE.Color(0xeef3ff),
    particleOpacity: 0.9,
    gateOpacity: 0.34,
    blending: THREE.AdditiveBlending,
  },
  light: {
    aether: new THREE.Color(0x0090b8),
    flux: new THREE.Color(0x6a35e8),
    frost: new THREE.Color(0x33415c),
    particleOpacity: 0.55,
    gateOpacity: 0.2,
    blending: THREE.NormalBlending,
  },
};

/**
 * Persistent WebGL backdrop.
 *
 * A volume of particles and wireframe gates that the camera flies
 * through as the page scrolls. It sits behind all content at z-index 0
 * and never intercepts pointer events.
 *
 * Cost control:
 *  - device pixel ratio capped at 1.5
 *  - particle count scaled to viewport size
 *  - loop suspended while the tab is hidden
 *  - replaced by a static CSS gradient under prefers-reduced-motion
 *  - degrades to nothing if WebGL is unavailable or the context is lost
 */
export default function AetherField() {
  const mountRef = useRef(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    // Reduced motion: skip WebGL entirely, the CSS fallback covers it.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisabled(true);
      return undefined;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      });
    } catch {
      setDisabled(true);
      return undefined;
    }

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, width / height, 1, 5200);
    camera.position.set(0, 0, 120);

    const isLight =
      document.documentElement.getAttribute('data-theme') === 'light';
    let theme = isLight ? PALETTE.light : PALETTE.dark;

    scene.fog = new THREE.FogExp2(isLight ? 0xeef1f7 : 0x04060d, 0.00058);

    /* ---------------- Particle volume ---------------- */
    const area = width * height;
    const particleCount = Math.round(
      THREE.MathUtils.clamp(area / 1400, 320, 1600)
    );

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * SPREAD_X;
      positions[i3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
      positions[i3 + 2] = -Math.random() * FIELD_DEPTH;

      // Mostly aether cyan, a minority flux violet, a few frost white.
      const roll = Math.random();
      const c =
        roll > 0.88 ? theme.frost : roll > 0.62 ? theme.flux : theme.aether;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      scales[i] = Math.random() * 2.4 + 0.6;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 3.2,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: theme.particleOpacity,
      depthWrite: false,
      blending: theme.blending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ---------------- Wireframe gates ----------------
       Large rings spaced along Z. They give the volume a readable
       sense of depth — you can see yourself passing through them. */
    const gateGroup = new THREE.Group();
    const gateGeometries = [];
    const gateMaterials = [];

    for (let i = 0; i < GATE_COUNT; i += 1) {
      const radius = 380 + (i % 3) * 90;
      const geo = new THREE.TorusGeometry(radius, 1.6, 3, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? theme.aether : theme.flux,
        transparent: true,
        opacity: theme.gateOpacity,
        blending: theme.blending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.z = -((i + 1) / GATE_COUNT) * FIELD_DEPTH;
      ring.rotation.z = Math.random() * Math.PI;
      gateGroup.add(ring);
      gateGeometries.push(geo);
      gateMaterials.push(mat);
    }
    scene.add(gateGroup);

    /* ---------------- Scroll + pointer input ---------------- */
    let scrollProgress = 0;
    let targetProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    const readScroll = () => {
      const travel = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetProgress = THREE.MathUtils.clamp(window.scrollY / travel, 0, 1);
    };

    const onPointerMove = (e) => {
      targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    /* ---------------- Theme changes ---------------- */
    const themeObserver = new MutationObserver(() => {
      const nowLight =
        document.documentElement.getAttribute('data-theme') === 'light';
      theme = nowLight ? PALETTE.light : PALETTE.dark;

      particleMat.opacity = theme.particleOpacity;
      particleMat.blending = theme.blending;
      particleMat.needsUpdate = true;

      gateMaterials.forEach((mat, i) => {
        mat.color.copy(i % 2 === 0 ? theme.aether : theme.flux);
        mat.opacity = theme.gateOpacity;
        mat.blending = theme.blending;
        mat.needsUpdate = true;
      });

      const colorAttr = particleGeo.getAttribute('color');
      for (let i = 0; i < particleCount; i += 1) {
        const roll = (i * 2654435761) % 100 / 100; // stable pseudo-random
        const c =
          roll > 0.88 ? theme.frost : roll > 0.62 ? theme.flux : theme.aether;
        colorAttr.setXYZ(i, c.r, c.g, c.b);
      }
      colorAttr.needsUpdate = true;

      scene.fog.color.set(nowLight ? 0xeef1f7 : 0x04060d);
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    /* ---------------- Resize ---------------- */
    const onResize = () => {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height);
      readScroll();
    };
    window.addEventListener('resize', onResize, { passive: true });

    /* ---------------- Context loss ---------------- */
    const canvas = renderer.domElement;
    const onContextLost = (e) => {
      e.preventDefault();
      setDisabled(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    /* ---------------- Render loop ---------------- */
    let frameId = null;
    let running = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!running) return;
      frameId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Ease toward the real scroll position so flings don't snap.
      scrollProgress += (targetProgress - scrollProgress) * 0.06;
      pointerX += (targetPointerX - pointerX) * 0.045;
      pointerY += (targetPointerY - pointerY) * 0.045;

      // Fly the volume toward the viewer.
      const travelZ = scrollProgress * FIELD_DEPTH;
      particles.position.z = travelZ;
      gateGroup.position.z = travelZ;

      // Ambient life so the field breathes when the page is still.
      particles.rotation.z = t * 0.012;
      particles.position.y = Math.sin(t * 0.22) * 14;

      gateGroup.children.forEach((ring, i) => {
        ring.rotation.z += 0.0006 * (i % 2 === 0 ? 1 : -1);
        ring.rotation.x = Math.sin(t * 0.18 + i) * 0.09;
      });

      // Subtle pointer parallax — the camera looks around, it doesn't move.
      camera.rotation.y += (-pointerX * 0.05 - camera.rotation.y) * 0.06;
      camera.rotation.x += (-pointerY * 0.035 - camera.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
      } else if (!running) {
        running = true;
        clock.getDelta(); // discard the gap
        animate();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    animate();

    /* ---------------- Teardown ---------------- */
    return () => {
      running = false;
      if (frameId !== null) cancelAnimationFrame(frameId);

      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      themeObserver.disconnect();

      particleGeo.dispose();
      particleMat.dispose();
      gateGeometries.forEach((g) => g.dispose());
      gateMaterials.forEach((m) => m.dispose());

      renderer.dispose();
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`aether-field ${disabled ? 'aether-field--fallback' : ''}`}
      aria-hidden="true"
    />
  );
}
