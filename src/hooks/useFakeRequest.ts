import { useEffect, useRef, useState } from 'react';

/** Stand-in for a network round trip, so loading states are visible in the prototype. */
export const FAKE_LATENCY = 700;

/**
 * Runs `done` after a short fake delay and reports `loading` meanwhile. The pending timer
 * is cleared on unmount. Replace with the real request once the backend lands.
 */
export function useFakeRequest() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const run = (done: () => void) => {
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      done();
    }, FAKE_LATENCY);
  };

  return { loading, run };
}
