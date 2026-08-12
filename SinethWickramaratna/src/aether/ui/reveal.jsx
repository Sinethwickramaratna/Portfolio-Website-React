import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Text reveals.
 *
 * Every headline on this site arrives from behind a mask rather than
 * fading in. Fading says "this was always here and you missed it";
 * a masked rise says "this is being set for you now", which is the
 * whole register the site is written in.
 *
 * Lines are authored by hand rather than split at runtime. Display type
 * this large has hand-chosen breaks anyway, and a runtime splitter has
 * to re-measure on every resize — a cost paid on the one element that
 * can least afford a reflow.
 */

/** A stack of masked lines. Pass the breaks you actually want. */
export function Lines({ text, className = '', tag: Tag = 'span', style }) {
  const lines = Array.isArray(text) ? text : [text];
  return (
    <Tag className={`ae-lines ${className}`} style={style}>
      {lines.map((line, i) => (
        <span className="ae-line" key={i}>
          <span className="ae-line-in" data-line style={{ '--li': i }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Runs the reveal for everything inside `ref` once it enters view.
 *
 * `[data-line]` rises out of its mask; `[data-fade]` drifts up; both are
 * staggered so a composition assembles in reading order instead of
 * arriving as one block.
 */
export function useReveal(ref, { start = 'top 78%', stagger = 0.075 } = {}) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(root.querySelectorAll('[data-line], [data-fade]'), {
        yPercent: 0,
        y: 0,
        opacity: 1,
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const lines = root.querySelectorAll('[data-line]');
      const fades = root.querySelectorAll('[data-fade]');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start, once: true },
        defaults: { ease: 'expo.out' },
      });

      if (lines.length) {
        tl.fromTo(
          lines,
          { yPercent: 108 },
          { yPercent: 0, duration: 1.25, stagger }
        );
      }
      if (fades.length) {
        tl.fromTo(
          fades,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.95, stagger: stagger * 0.7 },
          lines.length ? '-=0.85' : 0
        );
      }
    }, root);

    return () => ctx.revert();
  }, [ref, start, stagger]);
}

/**
 * Magnetic hover.
 *
 * The element leans towards the cursor while it is over it and springs
 * back when it leaves. Used only on the two or three things that are
 * genuinely clickable — if everything is magnetic, nothing reads as
 * interactive.
 */
export function useMagnetic(ref, strength = 0.32) {
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const move = (e) => {
      const r = el.getBoundingClientRect();
      quickX((e.clientX - (r.left + r.width / 2)) * strength);
      quickY((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref, strength]);
}

export { gsap, ScrollTrigger };
