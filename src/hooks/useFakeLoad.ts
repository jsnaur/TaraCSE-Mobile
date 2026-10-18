import { useEffect, useState } from 'react';

import { FAKE_LATENCY } from './useFakeRequest';

/**
 * `true` for a short fake delay after mount, so list screens show their skeleton the way
 * they will once data comes over the network. Replace with the real query later.
 */
export function useFakeLoad(ms = FAKE_LATENCY) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(timer);
  }, [ms]);
  return loading;
}
