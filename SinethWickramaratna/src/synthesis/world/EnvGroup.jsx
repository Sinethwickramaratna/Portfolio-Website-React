import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { envPosition } from '../worldConfig';
import { isNear } from '../state/worldState';

/**
 * Positions an environment at its stop and switches it off once the
 * camera is far enough away.
 *
 * With eight environments in one scene this is the difference between
 * drawing the whole universe every frame and drawing the two or three
 * parts of it that are actually on screen.
 */
export default function EnvGroup({ index, range = 1.5, children, ...props }) {
  const ref = useRef(null);

  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    const near = isNear(index, range);
    if (group.visible !== near) group.visible = near;
  });

  return (
    <group ref={ref} position={envPosition(index)} {...props}>
      {children}
    </group>
  );
}
