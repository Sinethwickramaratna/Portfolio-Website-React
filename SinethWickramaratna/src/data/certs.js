import { CERTIFICATES } from './content.js'
import { certImage } from './certImages.js'

/** Certificates with resolved artwork, in the curated order from content.js. */
export const CERT_ITEMS = CERTIFICATES.map((c) => ({
  src: certImage(c.image),
  title: c.title,
  subtitle: `${c.issuer} · ${c.date}`,
  note: c.note,
  kind: c.kind,
  date: c.date,
  issuer: c.issuer,
}))
