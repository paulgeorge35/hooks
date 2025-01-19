import { useEffect, useRef } from 'react';

/**
 * A hook that returns the previous value of a variable from the last render.
 * Useful for comparing current and previous values or implementing undo functionality.
 * 
 * @template T - The type of the value to track
 * @param value - The value to track
 * @returns The previous value (undefined on first render)
 * 
 * @example
 * ```tsx
 * // Basic counter with previous value
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * 
 * return (
 *   <div>
 *     <p>Current: {count}</p>
 *     <p>Previous: {prevCount ?? 'No previous value'}</p>
 *     <button onClick={() => setCount(count + 1)}>Increment</button>
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Form with undo capability
 * interface FormData {
 *   name: string;
 *   email: string;
 * }
 * 
 * const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
 * const prevFormData = usePrevious(formData);
 * 
 * const handleUndo = () => {
 *   if (prevFormData) {
 *     setFormData(prevFormData);
 *   }
 * };
 * 
 * return (
 *   <form>
 *     <input
 *       value={formData.name}
 *       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 *     />
 *     <button type="button" onClick={handleUndo}>Undo</button>
 *   </form>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Animation based on value changes
 * const [position, setPosition] = useState({ x: 0, y: 0 });
 * const prevPosition = usePrevious(position);
 * 
 * useEffect(() => {
 *   if (prevPosition) {
 *     const dx = position.x - prevPosition.x;
 *     const dy = position.y - prevPosition.y;
 *     animate({ dx, dy });
 *   }
 * }, [position]);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
} 