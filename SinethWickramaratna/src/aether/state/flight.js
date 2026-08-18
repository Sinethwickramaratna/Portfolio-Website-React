import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
/* Lenis stamps classes on <html> and relies on these rules to stop the
   browser's own smooth scrolling from fighting it. Without them the
   flight stutters on every wheel event. */
import 'lenis/dist/lenis.css';
import { STATIONS } from '../config';

/**
 * The flight recorder.
 *
 * One plain object, mutated sixty times a second, read directly inside
 * useFrame. Deliberately not React state: the 3D world needs this value
 * every frame and re-rendering a tree of scenes at that rate would cost
 * far more than the animation itself. React only ever hears about the
 * integer station index, which changes a dozen times in a whole visit.
 */
export const flight = {
  /** Absolute scroll offset in px, smoothed by Lenis. */
  y: 0,
  /** 0 → 1 across the whole document. */
  progress: 0,
  /** Signed scroll speed, normalised and damped. Drives motion blur-ish cues. */
  velocity: 0,
  /** Continuous station position, e.g. 3.42 = 42% of the way past station 3. */
  station: 0,
  /** Nearest whole station. */
  index: 0,
  /** Smoothed pointer, -1 → 1 on both axes, origin at screen centre. */
  px: 0,
  py: 0,
  /** Raw pointer, same units — used where lag would feel wrong. */
  rawX: 0,
  rawY: 0,
  /** Viewport, cached so scenes never touch layout during a frame. */
  vw: 1,
  vh: 1,
  /**
   * How far the camera has retreated to fit a narrow frame, 1 on a wide
   * screen. Published by the rig and read by anything spaced in world
   * units — pull the camera back without spreading the stations to
   * match and the next composition drifts into view behind this one.
   */
  fit: 1,
  /** True once the intro curtain has lifted. */
  entered: false,
};

/**
 * Where each station is "arrived at", in scroll pixels.
 *
 * Each section is taller than the viewport and pins its contents with
 * `position: sticky`, so there is a window of scroll during which the
 * composition is held still and fully on screen. The station is arrived
 * at in the *middle of that window* — not at the middle of the section,
 * which is half a screen further down and would leave every 3D
 * composition sitting below the frame it belongs to.
 *
 * Rebuilt on resize only; reading offsetTop per frame would force
 * layout sixty times a second.
 */
const anchors = [];
const elements = new Map();

export function registerStation(index, el) {
  if (el) elements.set(index, el);
  else elements.delete(index);
  measure();
}

function measure() {
  const vh = typeof window === 'undefined' ? 1 : window.innerHeight;
  anchors.length = STATIONS.length;
  for (let i = 0; i < STATIONS.length; i += 1) {
    const el = elements.get(i);
    if (!el) {
      anchors[i] = undefined;
      continue;
    }
    anchors[i] = el.offsetTop + Math.max(0, el.offsetHeight - vh) * 0.5;
  }
}

/**
 * Continuous station position from a scroll offset — 3.42 meaning
 * "42% of the way from station 3 to station 4".
 *
 * Interpolated between anchors rather than derived from section bounds,
 * so stations with different runways still hand over to each other
 * smoothly and every one of them is dead ahead at its own anchor.
 */
function stationAt(y) {
  let last = -1;
  for (let i = 0; i < anchors.length; i += 1) {
    if (anchors[i] === undefined) continue;
    if (y < anchors[i]) {
      if (last < 0) return i;
      const span = anchors[i] - anchors[last] || 1;
      return last + ((y - anchors[last]) / span) * (i - last);
    }
    last = i;
  }
  return last < 0 ? 0 : last;
}

const damp = (current, target, lambda, dt) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

/**
 * Installs Lenis, the pointer listeners and the single rAF loop that
 * feeds `flight`. Mount once, at the root of the experience.
 *
 * @returns the current integer station, as React state.
 */
export function useFlightDriver(enabled = true) {
  const [index, setIndex] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      // A long, flat tail: the page keeps gliding after the wheel stops,
      // which is what makes the camera moves read as cinematic rather
      // than as a reaction to input.
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    scrollToStation.lenis = lenis;

    const onResize = () => {
      flight.vw = window.innerWidth;
      flight.vh = window.innerHeight;
      measure();
      lenis.resize();
    };
    onResize();

    const onPointer = (e) => {
      flight.rawX = (e.clientX / window.innerWidth) * 2 - 1;
      flight.rawY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });

    /* Layout settles after fonts land; re-measure rather than trusting
       the first frame's offsets. */
    const settle = setTimeout(measure, 400);
    if (document.fonts?.ready) document.fonts.ready.then(measure);

    let raf = 0;
    let last = performance.now();
    let smoothIndex = 0;

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      lenis.raf(now);

      const prev = flight.y;
      /* The document, not Lenis, is the source of truth.
         ----------------------------------------------------------------
         `lenis.scroll` is Lenis's own animated value, and it only tracks
         scrolling that Lenis itself performed. Anything that moves the
         page natively — a keyboard PageDown or End, the browser
         restoring position on reload, a fragment jump, an extension —
         moves the document while that value stays put, and the entire
         3D world silently stays behind at whatever station it was on.
         The page reads as broken: the copy says one thing and the
         world shows another.

         Lenis writes its smoothed position to the document every frame,
         so `window.scrollY` already carries the easing *and* survives
         every scroll Lenis did not perform. Reading it costs nothing —
         it is a cached value, not a reflow. */
      flight.y = window.scrollY;
      const span = document.documentElement.scrollHeight - flight.vh;
      flight.progress = span > 0 ? Math.min(1, flight.y / span) : 0;

      /* Keep Lenis's internal value from drifting away from the document
         after such a jump, or its next eased scroll would start from a
         stale position and lurch. */
      if (Math.abs(lenis.scroll - flight.y) > 4) {
        lenis.scrollTo(flight.y, { immediate: true, force: true });
      }
      flight.velocity = damp(
        flight.velocity,
        (flight.y - prev) / Math.max(1, flight.vh) / Math.max(dt, 0.001) * 0.06,
        6,
        dt
      );

      flight.station = stationAt(flight.y);
      flight.px = damp(flight.px, flight.rawX, 3.2, dt);
      flight.py = damp(flight.py, flight.rawY, 3.2, dt);

      /* Hysteresis on the integer index. Without it, hovering exactly on
         a boundary would flip React state every frame. */
      const rounded = Math.round(flight.station);
      if (Math.abs(flight.station - smoothIndex) > 0.62) smoothIndex = rounded;
      if (smoothIndex !== flight.index) {
        flight.index = smoothIndex;
        setIndex(smoothIndex);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      lenis.destroy();
      lenisRef.current = null;
      scrollToStation.lenis = null;
    };
  }, [enabled]);

  return index;
}

/** Fly to a station by id. Used by the rail and by the hero's scroll cue. */
export function scrollToStation(id) {
  const i = STATIONS.findIndex((s) => s.id === id);
  const target = anchors[i];
  if (target === undefined) return;
  const lenis = scrollToStation.lenis;
  if (lenis) lenis.scrollTo(target, { duration: 1.6 });
  else window.scrollTo({ top: target, behavior: 'smooth' });
}

/**
 * How far the camera is from a given station, in stations.
 * 0 means dead ahead; negative means the station is still below.
 */
export function distanceTo(index) {
  return flight.station - index;
}

/** Smooth 0 → 1 → 0 presence curve for a station, used to fade scenes. */
export function presence(index, width = 1.15) {
  const d = Math.abs(flight.station - index);
  if (d >= width) return 0;
  const t = 1 - d / width;
  return t * t * (3 - 2 * t);
}
