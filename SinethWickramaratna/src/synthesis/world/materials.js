import { PALETTE } from '../worldConfig';

/**
 * Three materials, used consistently everywhere.
 *
 * The discipline matters more than the values: chrome for sculpture,
 * glass for anything containing information, holographic light for
 * anything interactive. Mixing them arbitrarily is what makes 3D work
 * look cheap.
 */

/** 1. Liquid chrome — major sculptural objects. Relies on the runtime
 *  environment map from ChromeEnvironment for its reflections. */
export const chrome = {
  color: '#e8eef8',
  metalness: 1,
  roughness: 0.14,
  envMapIntensity: 1.7,
};

/** Darker chrome, for mass that should recede rather than shine. */
export const chromeDark = {
  color: '#4c5566',
  metalness: 1,
  roughness: 0.34,
  envMapIntensity: 0.9,
};

/** 2. Frosted glass — used sparingly in 3D (it forces an extra render
 *  pass per object). Information panels are DOM overlays instead. */
export const glass = {
  color: '#bfe4ff',
  metalness: 0,
  roughness: 0.12,
  transmission: 1,
  thickness: 5,
  ior: 1.44,
  transparent: true,
  envMapIntensity: 1.2,
};

/** 3. Holographic light — emissive, unaffected by tone mapping so it
 *  keeps its colour at full intensity and reads as a light source. */
export const holo = (color = PALETTE.cyan, intensity = 1) => ({
  color,
  toneMapped: false,
  transparent: true,
  opacity: 0.9 * intensity,
});

/** Emissive surface for objects that should appear lit from within. */
export const emissive = (color = PALETTE.cyan, strength = 2.4) => ({
  color: '#0a0d14',
  emissive: color,
  emissiveIntensity: strength,
  metalness: 0.4,
  roughness: 0.5,
  toneMapped: false,
});
