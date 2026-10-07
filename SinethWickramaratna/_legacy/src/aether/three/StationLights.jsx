import { Children, useContext, useRef } from 'react';
import { useFrame as useRawFrame } from '@react-three/fiber';
import { StationContext } from './useStationFrame';

/**
 * Lights that are only ever on for the station the camera is at.
 *
 * Every composition used to own two or three point lights, and a
 * station stays visible until the camera is 1.6 stations away — so at
 * any moment up to three compositions overlapped and six to nine point
 * lights were live. That hurts twice over:
 *
 *   - three.js unrolls one loop iteration per point light into every
 *     lit material's fragment shader, so every pixel of every chrome
 *     surface paid for all of them; and
 *   - the light count is part of a material's shader-program key, so
 *     each time a station entered or left range the count changed and
 *     every lit material was recompiled — a multi-hundred-millisecond
 *     stall in the middle of a scroll.
 *
 * Here exactly one station — the nearest — has its lights on, and each
 * station is padded to the same count with dark lights, so the total is
 * a constant three and the programs never change.
 */
const COUNT = 3;

export default function StationLights({ children }) {
  const ctx = useContext(StationContext);
  const group = useRef();
  const lights = Children.toArray(children);

  useRawFrame(() => {
    const g = group.current;
    if (!g) return;
    /* Outside a station there is nothing to gate on. */
    const on = ctx ? ctx.nearest.current : true;
    if (g.visible !== on) g.visible = on;
  });

  const pad = Math.max(0, COUNT - lights.length);

  return (
    <group ref={group} visible={ctx ? ctx.nearest.current : true}>
      {lights}
      {Array.from({ length: pad }, (_, i) => (
        <pointLight key={`dark-${i}`} intensity={0} distance={1} />
      ))}
    </group>
  );
}
