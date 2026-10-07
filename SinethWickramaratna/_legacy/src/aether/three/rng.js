/**
 * Deterministic PRNG.
 *
 * Every scattered composition on this site — particle shells, filament
 * lattices, point clouds — is generated rather than authored. That is
 * only acceptable if it generates the *same* composition every time, so
 * the design can be judged and tuned. Math.random would make the site a
 * different site on every load.
 */
export function mulberry(seed) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random inside a range. */
export const range = (rng, a, b) => a + rng() * (b - a);
