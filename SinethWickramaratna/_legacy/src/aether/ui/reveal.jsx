import { useEffect } from 'react';
import gsap from 'gsap';

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

/**
 * A stack of masked lines. Pass the breaks you actually want.
 *
 * Publishes `--chars`: the length of the longest line. Display type on
 * this site is set in viewport units, which sizes it against the screen
 * and not against the word — so a fourteen-character line like
 * RECOMMENDATION renders at the same size as a five-character one and
 * runs off the edge, while `.ae-line`'s reveal mask hides the evidence
 * by clipping it. Exposing the length lets the stylesheet cap the size
 * at what will actually fit, per heading, at any viewport width.
 */
export function Lines({ text, className = '', tag: Tag = 'span', style }) {
  const lines = Array.isArray(text) ? text : [text];
  const chars = lines.reduce((n, l) => Math.max(n, String(l).length), 0);
  return (
    <Tag className={`ae-lines ${className}`} style={{ '--chars': chars, ...style }}>
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
 * Runs the reveal once its section reaches the viewport.
 *
 * `[data-line]` rises out of its mask; `[data-fade]` drifts up; both are
 * staggered so a composition assembles in reading order instead of
 * arriving as one block.
 *
 * Deliberately an IntersectionObserver rather than a ScrollTrigger.
 * ------------------------------------------------------------------
 * Every composition on this site lives inside a `position: sticky`
 * frame, and ScrollTrigger resolves a trigger's start by measuring
 * where the element sits in the document — a number that, for a sticky
 * element, changes as you scroll. Measure it while it happens to be
 * stuck and the computed start lands somewhere behind the reader, so a
 * `once` trigger never fires and the section stays parked at its
 * `from` state: opacity 0, forever. That is precisely what happened to
 * the research read-outs, and it is the worst failure this file can
 * produce, because the content is not late — it is gone.
 *
 * An IntersectionObserver has no such model. It reports what actually
 * overlaps the viewport, sticky or not, and needs no re-measuring when
 * fonts land or the canvas changes the page height. It is also watching
 * the *outer* frame rather than the sticky child, so what it observes
 * is an element whose position genuinely is fixed in the document.
 * ------------------------------------------------------------------
 */
export function useReveal(ref, { stagger = 0.075 } = {}) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const lines = root.querySelectorAll('[data-line]');
    const fades = root.querySelectorAll('[data-fade]');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([...lines, ...fades], { yPercent: 0, y: 0, opacity: 1 });
      return undefined;
    }

    /* Park them up front, so nothing flashes in its final position
       during the frame between mount and the observer's first call. */
    if (lines.length) gsap.set(lines, { yPercent: 108 });
    if (fades.length) gsap.set(fades, { y: 26, opacity: 0 });

    let tl;
    let failsafe;
    const play = () => {
      tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      if (lines.length) {
        tl.to(lines, { yPercent: 0, duration: 1.25, stagger });
      }
      if (fades.length) {
        tl.to(
          fades,
          { y: 0, opacity: 1, duration: 0.95, stagger: stagger * 0.7 },
          lines.length ? '-=0.85' : 0
        );
      }

      /* The timeline runs on requestAnimationFrame, and GSAP stops
         advancing it across frames longer than half a second — a lag
         guard that is right for a dropped frame and wrong for a device
         that renders this slowly all the time, where it would leave the
         section half-faded indefinitely. The whole sequence is under
         2.5s, so anything still running after six is not going to
         finish on its own: snap it to the end. Content that never
         arrives is a far worse outcome than an animation that was
         skipped. */
      failsafe = setTimeout(() => {
        if (tl && tl.progress() < 1) tl.progress(1);
      }, 6000);
    };

    /* The frame is the stable element; the grid inside it is sticky. */
    const target = root.closest('.ae-frame') || root;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        play();
      },
      // Fires once the section has properly arrived rather than the
      // instant its first pixel appears.
      { rootMargin: '-12% 0px -12% 0px' }
    );
    io.observe(target);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
      tl?.kill();
    };
  }, [ref, stagger]);
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
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const move = (e) => {
      /* Measure from the element's *resting* centre, not its current
         one. The naive version reads a rect that already includes the
         offset it just applied, so each frame feeds its own output back
         in: the button chases the cursor, overshoots, and never
         settles. Subtracting the live transform breaks the loop. */
      const r = el.getBoundingClientRect();
      const dx = Number(gsap.getProperty(el, 'x')) || 0;
      const dy = Number(gsap.getProperty(el, 'y')) || 0;
      const restX = r.left + r.width / 2 - dx;
      const restY = r.top + r.height / 2 - dy;
      quickX((e.clientX - restX) * strength);
      quickY((e.clientY - restY) * strength);
    };
    const leave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref, strength]);
}

export { gsap };
