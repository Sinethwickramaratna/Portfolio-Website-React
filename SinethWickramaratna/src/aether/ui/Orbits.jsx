/**
 * Orbital paths.
 *
 * Thin ellipses, drawn in SVG rather than in the 3D scene. Three
 * reasons: a one-pixel stroke stays exactly one pixel at any viewport,
 * the paths can be positioned against the *typography* instead of
 * against the world, and they can pass in front of the canvas while the
 * 3D object passes in front of them — which is how the layering reads
 * as a composition rather than as a stack.
 *
 * The small nodes riding each ellipse are the connective tissue between
 * the floating labels and the object they orbit.
 */

const SETS = {
  /* Hero: three wide, shallow ellipses on different rakes, sized to
     cross the display type rather than to circle the object. */
  hero: [
    { rx: 46, ry: 17, rot: -14, o: 0.34, dash: 0 },
    { rx: 38, ry: 27, rot: 22, o: 0.22, dash: 0 },
    { rx: 30, ry: 12, rot: 62, o: 0.16, dash: '2 6' },
  ],
  /* Profile: tighter, all raked the same way, so they read as one
     system wrapped around the figure. */
  profile: [
    { rx: 30, ry: 30, rot: 0, o: 0.28, dash: 0 },
    { rx: 40, ry: 22, rot: -18, o: 0.2, dash: 0 },
    { rx: 46, ry: 33, rot: 12, o: 0.12, dash: '2 7' },
  ],
  /* Doctrine: two big rings threaded through the word stack. */
  doctrine: [
    { rx: 44, ry: 26, rot: -8, o: 0.3, dash: 0 },
    { rx: 34, ry: 34, rot: 0, o: 0.18, dash: 0 },
    { rx: 49, ry: 15, rot: 18, o: 0.14, dash: '3 8' },
  ],
};

const NODES = {
  hero: [
    [0, 0.12],
    [0, 0.63],
    [1, 0.38],
    [1, 0.88],
    [2, 0.55],
  ],
  profile: [
    [0, 0.2],
    [0, 0.7],
    [1, 0.45],
    [2, 0.05],
  ],
  doctrine: [
    [0, 0.1],
    [0, 0.6],
    [1, 0.33],
    [1, 0.83],
  ],
};

/** Point on an ellipse, in the same percentage space as the SVG. */
function at(ring, t) {
  const a = t * Math.PI * 2;
  const x = Math.cos(a) * ring.rx;
  const y = Math.sin(a) * ring.ry;
  const r = (ring.rot * Math.PI) / 180;
  return {
    cx: 50 + x * Math.cos(r) - y * Math.sin(r),
    cy: 50 + x * Math.sin(r) + y * Math.cos(r),
  };
}

export default function Orbits({ set = 'hero', className = '', spin = true }) {
  const rings = SETS[set] ?? SETS.hero;
  const nodes = NODES[set] ?? NODES.hero;

  return (
    <svg
      className={`ae-orbits ${spin ? 'is-spinning' : ''} ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {rings.map((r, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="50"
          rx={r.rx}
          ry={r.ry}
          transform={`rotate(${r.rot} 50 50)`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.09"
          strokeOpacity={r.o}
          strokeDasharray={r.dash || undefined}
          vectorEffect="non-scaling-stroke"
          style={{ '--ri': i }}
        />
      ))}
      {nodes.map(([ringIndex, t], i) => {
        const p = at(rings[ringIndex], t);
        return (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r="0.55"
            fill="currentColor"
            className="ae-orbit-node"
            style={{ '--ni': i }}
          />
        );
      })}
    </svg>
  );
}
