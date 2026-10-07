import { PALETTE } from '../config';

/**
 * Five surfaces, and no others.
 *
 * The single fastest way to make real-time 3D look cheap is to give
 * every object its own material. These are the whole vocabulary:
 * chrome for sculpture, glass for anything that should read as
 * containing something, dark metal for mass, holo for light itself, and
 * emissive for objects lit from within.
 */

/** Liquid chrome. Relies on the scene environment map for its reflections. */
export const chrome = {
  color: '#dfe7f2',
  metalness: 1,
  roughness: 0.12,
  envMapIntensity: 2.1,
};

/** Chrome that should recede — structure rather than centrepiece. */
export const chromeDark = {
  color: '#3d4552',
  metalness: 1,
  roughness: 0.32,
  envMapIntensity: 1.1,
};

/** Dark industrial metal, faintly warm so it separates from the void. */
export const metal = {
  color: '#14181d',
  metalness: 0.85,
  roughness: 0.45,
  envMapIntensity: 0.8,
};

/**
 * Frosted glass. Transmission costs an extra render pass per object, so
 * this is reserved for the two or three places it earns its keep.
 */
export const glass = {
  color: '#cdeeff',
  metalness: 0,
  roughness: 0.08,
  transmission: 1,
  thickness: 3.2,
  ior: 1.42,
  transparent: true,
  envMapIntensity: 1.4,
};

/** Transparent acrylic — the cheap stand-in where transmission is too dear. */
export const acrylic = {
  color: '#8fd7ec',
  metalness: 0.1,
  roughness: 0.16,
  transparent: true,
  opacity: 0.22,
  envMapIntensity: 1.6,
};

/**
 * Holographic light. Untouched by tone mapping so it keeps full chroma
 * and reads as a source rather than a lit surface.
 */
export const holo = (color = PALETTE.cyan, opacity = 0.85) => ({
  color,
  toneMapped: false,
  transparent: true,
  opacity,
});

/** Surfaces that glow from inside. Bloom does the rest. */
export const emissive = (color = PALETTE.cyan, strength = 2.6) => ({
  color: '#080a0c',
  emissive: color,
  emissiveIntensity: strength,
  metalness: 0.3,
  roughness: 0.4,
  toneMapped: false,
});
