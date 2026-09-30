import { useEffect, useRef } from 'react';

/**
 * The reticle.
 *
 * A ring and a dot, moving at two different rates: the dot is exact,
 * the ring lags. That single difference is what makes a custom cursor
 * feel like an instrument rather than a gimmick — the lag reads as
 * mass. It swells over anything interactive and disappears entirely on
 * touch devices, where it would be a lie.
 */
export default function Cursor() {
  const dot = useRef();
  const ring = useRef();

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const eased = { x: target.x, y: target.y };
    let over = false;
    let raf = 0;
    let visible = false;

    const move = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.current?.classList.add('is-live');
        ring.current?.classList.add('is-live');
      }
      const el = e.target;
      const next = Boolean(
        el?.closest?.('a, button, [data-interactive]')
      );
      if (next !== over) {
        over = next;
        ring.current?.classList.toggle('is-over', over);
      }
    };

    const leave = () => {
      visible = false;
      dot.current?.classList.remove('is-live');
      ring.current?.classList.remove('is-live');
    };

    /* Only touch the DOM when something moved. This used to rewrite two
       inline styles on every frame forever — even with a still pointer —
       and every rewrite is a mutation that page-scanning browser
       extensions (and DevTools) have to process. */
    const last = { dx: NaN, dy: NaN, rx: NaN, ry: NaN };
    const frame = () => {
      eased.x += (target.x - eased.x) * 0.16;
      eased.y += (target.y - eased.y) * 0.16;
      if (dot.current && (target.x !== last.dx || target.y !== last.dy)) {
        last.dx = target.x;
        last.dy = target.y;
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
      const rx = Math.round(eased.x * 10) / 10;
      const ry = Math.round(eased.y * 10) / 10;
      if (ring.current && (rx !== last.rx || ry !== last.ry)) {
        last.rx = rx;
        last.ry = ry;
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <>
      <span ref={ring} className="ae-cursor-ring" aria-hidden="true" />
      <span ref={dot} className="ae-cursor-dot" aria-hidden="true" />
    </>
  );
}
