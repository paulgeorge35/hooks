import { useEffect, useState } from 'react';

/**
 * A hook that returns a debounced value that only updates after a specified delay
 * of inactivity. Useful for reducing the frequency of expensive operations.
 * 
 * @template T - The type of the value to debounce
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (defaults to 500ms)
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * // Basic usage with search input
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   // This will only run 300ms after the user stops typing
 *   performSearch(debouncedSearch);
 * }, [debouncedSearch]);
 * 
 * return (
 *   <input
 *     type="text"
 *     value={searchTerm}
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *     placeholder="Search..."
 *   />
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Usage with complex objects
 * interface User {
 *   name: string;
 *   age: number;
 * }
 * 
 * const [user, setUser] = useState<User>({ name: '', age: 0 });
 * const debouncedUser = useDebounce(user, 500);
 * 
 * useEffect(() => {
 *   // This will only run 500ms after the user object stops changing
 *   saveUserToAPI(debouncedUser);
 * }, [debouncedUser]);
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