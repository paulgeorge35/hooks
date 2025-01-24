import { useCallback, useEffect, useState } from 'react';

export type StorageError = {
  type: 'read' | 'write';
  message: string;
  originalError: unknown;
};

/**
 * A hook that syncs state with localStorage with improved error handling and type safety
 * @param key - The localStorage key to store the value under
 * @param initialValue - The initial value (or function that returns it)
 * @returns A tuple containing the current value, setter function, and last error if any
 * @example
 * ```tsx
 * const [token, setToken, lastError] = useLocalStorage('auth-token', '');
 * if (lastError) {
 *   console.error('Storage error:', lastError.message);
 * }
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void, StorageError | null] {
  const [error, setError] = useState<StorageError | null>(null);

  // Get initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        const value = typeof initialValue === 'function'
          ? (initialValue as () => T)()
          : initialValue;
        // Initialize localStorage with the initial value
        window.localStorage.setItem(key, JSON.stringify(value));
        return value;
      }
      return JSON.parse(item);
    } catch (error) {
      setError({
        type: 'read',
        message: `Error reading localStorage key "${key}"`,
        originalError: error
      });
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }
  });

  // Memoize the setValue function to prevent unnecessary re-renders
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const nextValue = value instanceof Function ? value(storedValue) : value;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      }
      setStoredValue(nextValue);
      setError(null);
    } catch (error) {
      // Set error but still update state
      setError({
        type: 'write',
        message: `Error setting localStorage key "${key}"`,
        originalError: error
      });
      // Try to update state even if localStorage fails
      const nextValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(nextValue);
    }
  }, [key, storedValue]);

  // Handle storage events from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
          setError(null);
        } catch (error) {
          setError({
            type: 'read',
            message: `Error parsing storage event for key "${key}"`,
            originalError: error
          });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, error];
} 