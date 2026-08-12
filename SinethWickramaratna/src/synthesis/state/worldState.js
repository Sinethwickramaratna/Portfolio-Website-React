import { useEffect, useState } from 'react';
import { SECTION_COUNT, sectionT } from '../worldConfig';

/**
 * Mutable world state, shared between the DOM layer and the WebGL layer.
 *
 * Deliberately a plain mutable object rather than React state: it is
 * written every animation frame, and routing that through React would
 * re-render the entire world sixty times a second. React only hears
 * about *discrete* changes — which section is active, which project is
 * focused — via the subscriber list.
 */
export const world = {
  /** Damped scroll position through the whole flight, 0 → 1. */
  progress: 0,
  /** Raw, undamped scroll position. */
  target: 0,
  /** Signed scroll speed, roughly -1 → 1. Drives motion trails. */
  velocity: 0,
  /** Damped pointer position, -1 → 1 on each axis. The gravity system. */
  pointer: { x: 0, y: 0 },
  pointerTarget: { x: 0, y: 0 },
  /** Index of the nearest stop. */
  activeSection: 0,
  /** id of the project the camera has dived into, or null. */
  focusedProject: null,
  /**
   * Camera offset applied on top of the flight path, used when the
   * visitor selects an object and the camera should lean in toward it.
   * Environments write to this; CameraRig damps toward it.
   */
  focus: { x: 0, y: 0, z: 0 },
  /** True while a nav jump is animating, so the rig can ease harder. */
  isTravelling: false,
};

/**
 * Where the camera is relative to one environment.
 *  0  — parked at that stop
 * ±1  — parked at an adjacent stop
 * Environments use this both to drive their own animation and to switch
 * themselves off entirely once the camera is far away.
 */
export function localProgress(index) {
  const step = SECTION_COUNT > 1 ? 1 / (SECTION_COUNT - 1) : 1;
  return (world.progress - sectionT(index)) / step;
}

/** Cheap visibility test — keeps distant environments out of the draw list. */
export function isNear(index, range = 1.45) {
  return Math.abs(localProgress(index)) < range;
}

const sectionSubscribers = new Set();

function setActiveSection(next) {
  if (world.activeSection === next) return;
  world.activeSection = next;
  sectionSubscribers.forEach((fn) => fn(next));
}

/** Subscribe to discrete section changes (for nav highlighting). */
export function onSectionChange(fn) {
  sectionSubscribers.add(fn);
  return () => sectionSubscribers.delete(fn);
}

/** React binding for the active section index. */
export function useActiveSection() {
  const [active, setActive] = useState(world.activeSection);
  useEffect(() => onSectionChange(setActive), []);
  return active;
}

/** Scroll the document to a given stop. */
export function travelTo(index) {
  const travel = document.documentElement.scrollHeight - window.innerHeight;
  const clamped = Math.max(0, Math.min(SECTION_COUNT - 1, index));
  world.isTravelling = true;
  window.scrollTo({
    top: sectionT(clamped) * travel,
    behavior: 'smooth',
  });
  window.setTimeout(() => {
    world.isTravelling = false;
  }, 1200);
}

/**
 * Single driver loop for the whole experience.
 *
 * Owns damping for scroll and pointer, and publishes `--t` on <html> so
 * DOM overlays can compute their own visibility in pure CSS (no
 * per-element JavaScript, no per-frame React work).
 *
 * Mount exactly once.
 */
export function useWorldDriver() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let raf = null;
    let lastProgress = 0;

    const readScroll = () => {
      const travel = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      world.target = Math.min(1, Math.max(0, window.scrollY / travel));
    };

    const onPointerMove = (e) => {
      world.pointerTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
      world.pointerTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onPointerLeave = () => {
      world.pointerTarget.x = 0;
      world.pointerTarget.y = 0;
    };

    const step = () => {
      raf = requestAnimationFrame(step);

      // Heavier damping while a nav jump is in flight keeps the camera
      // gliding rather than snapping to the smooth-scroll's easing.
      const k = reduced ? 1 : world.isTravelling ? 0.055 : 0.085;
      world.progress += (world.target - world.progress) * k;
      if (Math.abs(world.target - world.progress) < 0.00005) {
        world.progress = world.target;
      }

      world.velocity = (world.progress - lastProgress) * 60;
      lastProgress = world.progress;

      const pk = reduced ? 1 : 0.06;
      world.pointer.x += (world.pointerTarget.x - world.pointer.x) * pk;
      world.pointer.y += (world.pointerTarget.y - world.pointer.y) * pk;

      root.style.setProperty('--t', world.progress.toFixed(5));
      root.style.setProperty('--vel', world.velocity.toFixed(4));
      root.style.setProperty('--px', world.pointer.x.toFixed(4));
      root.style.setProperty('--py', world.pointer.y.toFixed(4));

      // Nearest stop, for nav highlighting.
      setActiveSection(
        Math.round(world.progress * (SECTION_COUNT - 1))
      );
    };

    readScroll();
    world.progress = world.target;
    lastProgress = world.progress;

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    raf = requestAnimationFrame(step);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);
}
