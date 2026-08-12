import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { flight } from '../state/flight';
import { STATION_SPREAD } from '../config';

/**
 * A station in the flight.
 *
 * Every 3D composition sits inside one of these. The station does three
 * jobs and nothing else: it slides itself vertically so that it is dead
 * ahead of the camera when the matching document section fills the
 * screen, it hides itself when it is far away, and it unmounts its
 * children when it is far enough that keeping them alive is waste.
 *
 * Children therefore never think about scroll position — they animate
 * around their own origin and are placed by this.
 */
export default function Station({
  index,
  children,
  spread = STATION_SPREAD,
  z = 0,
  /* Compositions whose contents are expensive to create (remote
     textures, large buffers) opt into unmounting when out of range. */
  lazy = false,
  /* Extra depth push as the station approaches, so it arrives towards
     the viewer rather than simply sliding past. */
  dolly = 0,
}) {
  const ref = useRef();
  const [live, setLive] = useState(!lazy);
  const liveRef = useRef(!lazy);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const d = flight.station - index;
    const a = Math.abs(d);

    g.position.y = -d * spread;
    g.position.z = z + dolly * (1 - Math.min(1, a)) * -1;
    g.visible = a < 1.6;

    if (lazy) {
      /* Hysteresis: mount early, release late. Flipping on a single
         threshold would thrash at the boundary. */
      const want = liveRef.current ? a < 3.2 : a < 2.2;
      if (want !== liveRef.current) {
        liveRef.current = want;
        setLive(want);
      }
    }
  });

  return <group ref={ref}>{live ? children : null}</group>;
}
