import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { presence } from '../state/flight';

/**
 * A label attached to a point in the world.
 *
 * drei's Html projects a DOM node onto a 3D position, which is exactly
 * what is wanted for anything that has to be read — real fonts, real
 * kerning, real accessibility. What it does *not* do is inherit the
 * visibility of its parent group, so a label three stations away would
 * otherwise sit in the middle of an unrelated composition.
 *
 * This ties the label's opacity to how close the flight is to its
 * station, and hides it outright once it is far enough to be noise.
 */
export default function Label({ station, children, className = '', ...props }) {
  const ref = useRef();

  useFrame(() => {
    const el = ref.current;
    if (!el) return;
    const p = presence(station, 0.85);
    el.style.opacity = p;
    el.style.visibility = p < 0.02 ? 'hidden' : 'visible';
  });

  return (
    <Html zIndexRange={[8, 0]} style={{ pointerEvents: 'none' }} {...props}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </Html>
  );
}
