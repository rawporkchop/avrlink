import { useEffect, useState } from 'react';
import { parseCompatibility } from '../csv';
import { asset } from '../utils';

// Loads public/compatibility.csv once. Edit that file to add receivers.
export function useCompatibility() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(asset('compatibility.csv'), { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('Could not load compatibility.csv');
        return r.text();
      })
      .then((text) => { if (!cancelled) setModels(parseCompatibility(text)); })
      .catch((e) => {
        console.error('AVR Link compatibility:', e);
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
  }, []);

  return { models, error };
}
