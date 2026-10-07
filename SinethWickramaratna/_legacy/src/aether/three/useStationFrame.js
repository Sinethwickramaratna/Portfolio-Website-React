import { createContext, useContext } from 'react';
import { useFrame as useRawFrame } from '@react-three/fiber';

/**
 * Station-aware useFrame.
 *
 * Every composition in this world lives inside a <Station>, which hides
 * its group once the camera is more than ~1.6 stations away. Hiding
 * stops the GPU drawing it, but React Three Fiber still calls every
 * useFrame callback in the tree — so a dozen scenes were rewriting
 * instance matrices, rotating meshes and updating buffers sixty times a
 * second while only one of them could be seen. That is pure main-thread
 * cost, and it is what makes scrolling feel heavy.
 *
 * This is a drop-in replacement: same signature, but the callback is
 * skipped while the enclosing station is out of range. Outside a
 * station (no context) it behaves exactly like the stock hook.
 */
export const StationContext = createContext(null);

export function useFrame(callback, priority) {
  const ctx = useContext(StationContext);
  useRawFrame((state, delta, frame) => {
    if (ctx && !ctx.active.current) return;
    callback(state, delta, frame);
  }, priority);
}
