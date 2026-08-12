import { useEffect, useRef, useState } from 'react';
import { flight } from '../state/flight';

/**
 * The threshold.
 *
 * A site that opens onto a half-built 3D scene has spent its first
 * impression before the visitor has done anything. This holds the void
 * closed until the world reports itself compiled, then lifts.
 *
 * It also does the quieter job of taking the visitor's first gesture:
 * the flight starts from a deliberate act, not from an accidental wheel
 * event during a loading screen.
 *
 * On the counter: there is no asset manifest to measure against — every
 * object in this world is generated in code, so there is nothing to
 * total up. What is actually being waited on is the 3D bundle arriving
 * and the renderer finishing its first frame, which is a single
 * boolean. The number climbs on a curve until that boolean flips and
 * then completes. It is an indicator of *waiting*, not a measurement,
 * and it never claims to be finished before the world genuinely is.
 */
export default function Curtain({ worldReady, onEnter }) {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const shown = useRef(performance.now());

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - shown.current) / 1000;
      setCount((prev) => {
        // Asymptotic towards 92 while waiting; snaps home once the world
        // is up, so the bar can never sit full in front of a dead scene.
        const ceiling = worldReady ? 100 : 92;
        const target = worldReady ? 100 : (1 - Math.exp(-elapsed * 0.9)) * 92;
        return Math.min(ceiling, prev + (target - prev) * 0.14);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [worldReady]);

  useEffect(() => {
    /* A floor on the wait. If the world compiles in 200 ms the curtain
       would flash, which reads as a bug rather than as an entrance. */
    if (!worldReady || count < 99.4) return undefined;
    const elapsed = performance.now() - shown.current;
    const t = setTimeout(() => setReady(true), Math.max(0, 1100 - elapsed));
    return () => clearTimeout(t);
  }, [worldReady, count]);

  useEffect(() => {
    if (!ready || gone) return undefined;
    const enter = () => {
      setGone(true);
      flight.entered = true;
      window.scrollTo(0, 0);
      onEnter?.();
    };
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready, gone, onEnter]);

  if (gone) return null;

  const enter = () => {
    if (!ready) return;
    setGone(true);
    flight.entered = true;
    window.scrollTo(0, 0);
    onEnter?.();
  };

  return (
    <div className={`ae-curtain${ready ? ' is-ready' : ''}`}>
      <div className="ae-curtain-in">
        <span className="ae-mono ae-dim ae-curtain-sys">SYSTEM / 01 — 2026</span>

        <span className="ae-curtain-name">
          SINETH
          <em>WICKRAMARATNA</em>
        </span>

        <div className="ae-curtain-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${count / 100})` }} />
        </div>

        <div className="ae-curtain-foot">
          <span className="ae-mono ae-dim">
            {ready ? 'WORLD COMPILED' : 'COMPILING WORLD'}
          </span>
          <span className="ae-mono ae-accent">
            {String(Math.round(count)).padStart(3, '0')}
          </span>
        </div>

        <button
          type="button"
          className="ae-curtain-enter ae-mono"
          onClick={enter}
          disabled={!ready}
        >
          ENTER
          <svg viewBox="0 0 24 12" aria-hidden="true">
            <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
