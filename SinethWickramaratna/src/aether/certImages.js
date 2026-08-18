/**
 * Certificate artwork.
 *
 * Vite resolves these at build time, so the config file can stay plain
 * data — no import statements in it, which is what lets the flat
 * document read the same list.
 *
 * Shared rather than section-local because both layers need it now: the
 * document shows the certificate as a plate beside the row being read,
 * and the 3D stack maps the same image onto its pane.
 */
const IMAGES = import.meta.glob('../assets/Certificates/*', {
  eager: true,
  import: 'default',
  query: '?url',
});

/** Resolve a bare filename from CERTIFICATES to a built asset URL. */
export function certImage(file) {
  const hit = Object.entries(IMAGES).find(([path]) => path.endsWith(`/${file}`));
  return hit ? hit[1] : null;
}
