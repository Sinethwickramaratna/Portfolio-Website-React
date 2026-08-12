/**
 * Shared scroll ticker.
 *
 * Every scroll-linked element on the page subscribes here instead of
 * registering its own scroll listener + rAF loop. Two properties make
 * this cheap enough to run a dozen 3D scenes at once:
 *
 *  1. Two-phase frames. All subscribers `measure()` (DOM reads) before
 *     any subscriber `apply()` (DOM writes). Interleaving reads and
 *     writes would force a synchronous layout per subscriber per frame.
 *
 *  2. Activity windows. The rAF loop only spins while something is
 *     actually happening — a scroll or resize extends the window. Once
 *     the page settles the loop stops entirely rather than burning a
 *     frame budget forever.
 */

const subscribers = new Set();

let rafId = null;
let activeUntil = 0;

/** How long to keep ticking after the last scroll event (ms). Covers
 *  momentum scrolling and lets damped values settle. */
const SETTLE_MS = 700;

function frame() {
  rafId = null;

  // Phase 1 — reads
  for (const sub of subscribers) {
    try {
      sub.measure();
    } catch {
      /* a broken subscriber must not stall the whole page */
    }
  }

  // Phase 2 — writes
  for (const sub of subscribers) {
    try {
      sub.apply();
    } catch {
      /* as above */
    }
  }

  if (subscribers.size > 0 && performance.now() < activeUntil) {
    rafId = requestAnimationFrame(frame);
  }
}

function wake(duration = SETTLE_MS) {
  if (typeof document !== 'undefined' && document.hidden) return;
  activeUntil = performance.now() + duration;
  if (rafId === null && subscribers.size > 0) {
    rafId = requestAnimationFrame(frame);
  }
}

let listenersBound = false;

function onActivity() {
  wake();
}

function bindListeners() {
  if (listenersBound || typeof window === 'undefined') return;
  listenersBound = true;
  window.addEventListener('scroll', onActivity, { passive: true });
  window.addEventListener('resize', onActivity, { passive: true });
  window.addEventListener('orientationchange', onActivity, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) wake();
  });
}

function unbindListeners() {
  if (!listenersBound || typeof window === 'undefined') return;
  listenersBound = false;
  window.removeEventListener('scroll', onActivity);
  window.removeEventListener('resize', onActivity);
  window.removeEventListener('orientationchange', onActivity);
}

/**
 * Register a scroll-linked element.
 *
 * @param {{ measure: () => void, apply: () => void }} subscriber
 * @returns {() => void} unsubscribe
 */
export function subscribeToScroll(subscriber) {
  subscribers.add(subscriber);
  bindListeners();

  // Run a few frames immediately so the element is correctly positioned
  // on mount rather than waiting for the user's first scroll.
  wake(120);

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      unbindListeners();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
}

/** Force the loop awake — e.g. after images load and shift layout. */
export function pokeScroll(duration) {
  wake(duration);
}

export const clamp = (v, min = 0, max = 1) => (v < min ? min : v > max ? max : v);

/** Smoothstep — removes the linear "robotic" feel from raw progress. */
export const smoothstep = (t) => t * t * (3 - 2 * t);

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
