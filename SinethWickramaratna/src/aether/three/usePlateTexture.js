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
 *
 * Performance
 * -----------
 * A plate is never drawn larger than a fraction of the screen, but the
 * source files can be enormous (the artwork is user-uploaded, and one
 * certificate was 4800 px wide). Uploading a full-size image stalls the
 * main thread while the browser decodes it and the driver builds its
 * mipmaps — which is exactly the "site freezes when I reach this
 * section" hitch. So the image is decoded off the main thread with
 * createImageBitmap and downscaled to MAX_SIZE before it ever reaches
 * the GPU. Where that API is unavailable it falls back to the plain
 * TextureLoader, so nothing is lost.
 */
const MAX_SIZE = 1024;

async function loadBitmapTexture(src, signal) {
  const res = await fetch(src, { mode: 'cors', signal });
  if (!res.ok) throw new Error(`texture ${res.status}`);
  const blob = await res.blob();
  let bitmap = await createImageBitmap(blob, { imageOrientation: 'flipY' });
  if (bitmap.width > MAX_SIZE) {
    const small = await createImageBitmap(bitmap, {
      resizeWidth: MAX_SIZE,
      resizeQuality: 'medium',
    });
    bitmap.close();
    bitmap = small;
  }
  const tex = new THREE.Texture(bitmap);
  /* Already flipped at decode time; WebGL ignores UNPACK_FLIP_Y for
     ImageBitmap sources. */
  tex.flipY = false;
  tex.needsUpdate = true;
  return tex;
}

export function usePlateTexture(src) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!src) return undefined;
    let live = true;
    const ctrl = new AbortController();

    const adopt = (tex) => {
      if (!live) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      setTexture(tex);
    };

    const fallback = () => {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(src, adopt, undefined, () => {});
    };

    if (typeof createImageBitmap === 'function' && typeof fetch === 'function') {
      loadBitmapTexture(src, ctrl.signal)
        .then(adopt)
        .catch((err) => {
          if (err?.name !== 'AbortError' && live) fallback();
        });
    } else {
      fallback();
    }

    return () => {
      live = false;
      ctrl.abort();
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
