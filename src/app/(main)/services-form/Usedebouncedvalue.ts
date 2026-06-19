import { useEffect, useState } from 'react';

/**
 * Returns `value`, but only updates after `delayMs` of no further changes.
 * Used in customer search to avoid firing an API call on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}