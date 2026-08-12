import { useEffect, useRef } from 'react';
import {
  subscribeToScroll,
  clamp,
  smoothstep,
  prefersReducedMotion,
} from './scrollTicker';

/**
 * Scroll-links an element and publishes its progress as CSS custom
 * properties on that element. Nothing here triggers a React render —
 * animation happens entirely in CSS off these variables, which is what
 * keeps it at 60fps.
 *
 * Published on the element:
 *   --p    0 → 1   raw traversal (0 = just below fold, 1 = just above)
 *   --ps   0 → 1   smoothstepped, for eased motion
 *   --pc  -1 → 1   centred (0 when the element is centred in viewport)
 *
 * @param {{ damping?: number }} options
 *        damping — lerp factor per frame, 1 = instant, 0.1 = heavy glide
 * @returns {import('react').RefObject<HTMLElement>}
 */
export function useScrollProgress({ damping = 0.14 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Reduced motion: pin every value to its resting state and skip the
    // subscription entirely.
    if (prefersReducedMotion()) {
      el.style.setProperty('--p', '0.5');
      el.style.setProperty('--ps', '0.5');
      el.style.setProperty('--pc', '0');
      return undefined;
    }

    let target = 0;
    let current = 0;
    let primed = false;

    return subscribeToScroll({
      measure() {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // Total distance the element travels from first appearing at the
        // bottom edge to fully clearing the top edge.
        const total = rect.height + vh;
        target = clamp((vh - rect.top) / total);
      },
      apply() {
        if (!primed) {
          // Snap on the first frame so nothing animates in from a stale 0.
          current = target;
          primed = true;
        } else {
          current += (target - current) * damping;
          if (Math.abs(target - current) < 0.0005) current = target;
        }

        const p = current;
        el.style.setProperty('--p', p.toFixed(4));
        el.style.setProperty('--ps', smoothstep(p).toFixed(4));
        el.style.setProperty('--pc', ((p - 0.5) * 2).toFixed(4));
      },
    });
  }, [damping]);

  return ref;
}

/**
 * Progress across a pinned scene.
 *
 * Expects an outer element taller than the viewport containing a
 * `position: sticky` inner element. Progress runs 0 → 1 across the
 * portion of the scroll where the inner element is stuck.
 *
 * Published on the outer element (inherited by the sticky child):
 *   --scene-p    0 → 1
 *   --scene-ps   0 → 1  smoothstepped
 *   --scene-pc  -1 → 1  centred
 *
 * @returns {import('react').RefObject<HTMLElement>}
 */
export function useSceneProgress({ damping = 0.16 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (prefersReducedMotion()) {
      el.style.setProperty('--scene-p', '0.5');
      el.style.setProperty('--scene-ps', '0.5');
      el.style.setProperty('--scene-pc', '0');
      return undefined;
    }

    let target = 0;
    let current = 0;
    let primed = false;

    return subscribeToScroll({
      measure() {
        const rect = el.getBoundingClientRect();
        // Distance the sticky child spends stuck to the top.
        const travel = el.offsetHeight - (window.innerHeight || 1);
        target = travel > 0 ? clamp(-rect.top / travel) : 0;
      },
      apply() {
        if (!primed) {
          current = target;
          primed = true;
        } else {
          current += (target - current) * damping;
          if (Math.abs(target - current) < 0.0005) current = target;
        }

        el.style.setProperty('--scene-p', current.toFixed(4));
        el.style.setProperty('--scene-ps', smoothstep(current).toFixed(4));
        el.style.setProperty('--scene-pc', ((current - 0.5) * 2).toFixed(4));
      },
    });
  }, [damping]);

  return ref;
}

/**
 * Global scroll state, published once on <html> for page-wide effects
 * (the fixed grid floor, the WebGL backdrop, the nav).
 *
 *   --scroll-progress  0 → 1 through the whole document
 *   --scroll-depth     px scrolled, for parallax backgrounds
 *   --scroll-velocity -1 → 1 normalised, damped
 *
 * Mount this exactly once, at the app root.
 */
export function useScrollDriver() {
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) return undefined;

    let scrollY = 0;
    let docTravel = 1;
    let lastY = window.scrollY || 0;
    let velocity = 0;

    return subscribeToScroll({
      measure() {
        scrollY = window.scrollY || 0;
        docTravel = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
      },
      apply() {
        const delta = scrollY - lastY;
        lastY = scrollY;

        // Normalise against a 60px/frame reference, then damp.
        const instant = clamp(delta / 60, -1, 1);
        velocity += (instant - velocity) * 0.18;
        if (Math.abs(velocity) < 0.001) velocity = 0;

        root.style.setProperty('--scroll-progress', (scrollY / docTravel).toFixed(4));
        root.style.setProperty('--scroll-depth', `${scrollY.toFixed(1)}px`);
        root.style.setProperty('--scroll-velocity', velocity.toFixed(4));
      },
    });
  }, []);
}
