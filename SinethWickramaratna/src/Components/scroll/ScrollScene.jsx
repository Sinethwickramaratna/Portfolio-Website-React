import { useEffect, useState } from 'react';
import { useSceneProgress } from '../../hooks/useScrollProgress';
import { prefersReducedMotion } from '../../hooks/scrollTicker';
import './ScrollScene.css';

/**
 * Small media-query hook. Pinning is disabled on narrow screens where
 * it fights the browser's own scroll affordances and the dynamic
 * toolbar makes 100vh unreliable.
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * A section that pins to the viewport while its contents animate, then
 * releases and hands off to the next section.
 *
 * Scroll distance is `(1 + pin) × 100vh`: the first viewport-height is
 * the section arriving, the rest is spent pinned. Progress across the
 * pinned portion is published as `--scene-p` / `--scene-ps` / `--scene-pc`
 * for descendants (see DepthLayer) to interpolate against.
 *
 * Falls back to a plain, unpinned section when the user prefers reduced
 * motion or is on a small screen — the content is identical, only the
 * choreography is dropped.
 */
export default function ScrollScene({
  children,
  pin = 1,
  id,
  className = '',
  perspective = 'var(--perspective-mid)',
  align = 'center',
  as: Tag = 'section',
  ...rest
}) {
  const sceneRef = useSceneProgress();
  const isNarrow = useMediaQuery('(max-width: 900px)');
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  const isStatic = isNarrow || reduced;

  if (isStatic) {
    return (
      <Tag id={id} className={`scroll-scene scroll-scene--static ${className}`} {...rest}>
        <div className="scroll-scene__stage">{children}</div>
      </Tag>
    );
  }

  return (
    <Tag
      id={id}
      ref={sceneRef}
      className={`scroll-scene ${className}`}
      /* Height is computed in CSS from --pin so it can use svh where
         supported and fall back to vh where it isn't. */
      style={{ '--pin': 1 + pin }}
      {...rest}
    >
      <div
        className="scroll-scene__viewport"
        style={{ perspective, alignItems: align }}
      >
        <div className="scroll-scene__stage">{children}</div>
      </div>
    </Tag>
  );
}

/**
 * A child of ScrollScene that moves through 3D space as the scene
 * progresses. All interpolation happens in CSS off a single progress
 * variable, so a scene with twenty layers still costs one variable
 * write per frame.
 *
 * Every prop is a `[from, to]` pair sampled at scene progress 0 and 1.
 *
 * @param {[number,number]} z        depth in px (negative = further away)
 * @param {[number,number]} y        vertical travel in px
 * @param {[number,number]} x        horizontal travel in px
 * @param {[number,number]} rotateX  degrees
 * @param {[number,number]} rotateY  degrees
 * @param {[number,number]} scale    multiplier
 * @param {[number,number]} opacity  0 → 1
 * @param {string} track   which progress variable to follow
 * @param {number} delay   0 → 1, shifts this layer later in the scene
 */
export function DepthLayer({
  children,
  z = [0, 0],
  y = [0, 0],
  x = [0, 0],
  rotateX = [0, 0],
  rotateY = [0, 0],
  scale = [1, 1],
  opacity = [1, 1],
  track = '--scene-ps',
  delay = 0,
  className = '',
  style,
  ...rest
}) {
  const vars = {
    '--dl-p': `var(${track}, 0)`,
    '--dl-delay': delay,
    '--dl-x0': x[0], '--dl-x1': x[1],
    '--dl-y0': y[0], '--dl-y1': y[1],
    '--dl-z0': z[0], '--dl-z1': z[1],
    '--dl-rx0': rotateX[0], '--dl-rx1': rotateX[1],
    '--dl-ry0': rotateY[0], '--dl-ry1': rotateY[1],
    '--dl-s0': scale[0], '--dl-s1': scale[1],
    '--dl-o0': opacity[0], '--dl-o1': opacity[1],
    ...style,
  };

  return (
    <div className={`depth-layer ${className}`} style={vars} {...rest}>
      {children}
    </div>
  );
}
