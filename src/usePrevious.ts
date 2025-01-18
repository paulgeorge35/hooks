import { useEffect, useRef } from 'react';

/**
 * A hook that returns the previous value of a variable
 * @param value - The value to track
 * @returns The previous value
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
} 