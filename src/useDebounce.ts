import { useEffect, useState } from 'react';

/**
 * A hook that returns a debounced value that only updates after a specified delay
 * @param value - The value to debounce
 * @param {number} [delay=500] - The delay in milliseconds (defaults to 500ms)
 * @returns The debounced value
 * @example
 * ```tsx
 * const [text, setText] = useState('');
 * const debouncedText = useDebounce(text, 300);
 * ```
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 