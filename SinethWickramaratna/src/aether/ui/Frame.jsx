import { useEffect, useRef } from 'react';
import { STATIONS, STATION_INDEX } from '../config';
import { registerStation } from '../state/flight';

/**
 * A document station.
 *
 * Gives its section the scroll runway declared in the config, registers
 * itself so the flight recorder can work out where the camera is, and
 * pins its contents to the viewport for the duration. The pinning is
 * what lets a composition hold still and be read while the world behind
 * it keeps moving — the difference between a site you scroll and a
 * place you travel through.
 */
export default function Frame({ id, className = '', children, tall = false }) {
  const index = STATION_INDEX[id];
  const ref = useRef();

  useEffect(() => {
    registerStation(index, ref.current);
    return () => registerStation(index, null);
  }, [index]);

  return (
    <section
      ref={ref}
      id={id}
      className={`ae-frame ${className}`}
      style={{ height: `${STATIONS[index].vh}vh` }}
    >
      <div className={`ae-pin${tall ? ' is-tall' : ''}`}>{children}</div>
    </section>
  );
}
