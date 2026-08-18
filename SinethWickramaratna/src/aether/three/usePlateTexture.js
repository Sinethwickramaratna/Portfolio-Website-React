import { useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Load an image onto a plate, without risking the world.
 *
 * `useLoader` would be shorter, but it suspends — and any one of these
 * requests can fail. The exhibition's artwork is hosted off-site, so a
 * blocked host, an expired link or a hostile network would throw a
 * promise into the shared Suspense boundary and take the entire scene
 * down with it. Loading by hand means a plate renders as a frame
 * immediately and adopts its image only if one arrives.
 *
 * Returns `null` until the texture is ready. Callers should key their
 * material on whether it exists: a material compiled without a map has
 * no sampler in its shader, so assigning `map` afterwards leaves the
 * surface flat until the program is rebuilt.
 */
export function usePlateTexture(src) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!src) return undefined;
    let live = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      src,
      (tex) => {
        if (!live) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        setTexture(tex);
      },
      undefined,
      () => {}
    );
    return () => {
      live = false;
    };
  }, [src]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}

/** Width-over-height of a loaded texture, with a sane portrait default. */
export function textureAspect(texture, fallback = 0.72) {
  const img = texture?.image;
  if (!img?.width || !img?.height) return fallback;
  return img.width / img.height;
}
