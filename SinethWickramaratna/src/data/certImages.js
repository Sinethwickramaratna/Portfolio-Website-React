const IMAGES = import.meta.glob('../assets/Certificates/*', {
  eager: true,
  import: 'default',
  query: '?url',
})

/** Resolve a bare filename from CERTIFICATES to a built asset URL. */
export function certImage(file) {
  const hit = Object.entries(IMAGES).find(([path]) => path.endsWith(`/${file}`))
  return hit ? hit[1] : null
}
