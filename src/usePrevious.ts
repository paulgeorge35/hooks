import { useCallback, useEffect, useRef } from 'react';
import { useStack } from './useStack';

export type UsePreviousOptions<T> = {
    /** Whether to store the initial value as the first previous value */
    includeInitial?: boolean;
    /** Maximum number of previous values to store */
    maxHistory?: number;
    /** Callback when the value changes */
    onChange?: (current: T, previous: T | undefined) => void;
    /** Custom comparison function */
    compare?: (a: T, b: T) => boolean;
};

export type UsePreviousResult<T> = {
    /** The previous value */
    previous: T | undefined;
    /** Array of previous values, most recent first */
    history: ReadonlyArray<T>;
    /** Clear the history */
    clearHistory: () => void;
};

/**
 * A hook that returns the previous value of a variable from the last render.
 * Includes history tracking and change detection features.
 * 
 * @template T - The type of the value to track
 * @param value - The value to track
 * @param options - Configuration options
 * @returns An object containing the previous value and related information
 * 
 * @example
 * ```tsx
 * // Basic counter with previous value
 * const [count, setCount] = useState(0);
 * const { previous, hasChanged } = usePrevious(count);
 * 
 * return (
 *   <div>
 *     <p>Current: {count}</p>
 *     <p>Previous: {previous ?? 'No previous value'}</p>
 *     {hasChanged && <p>Value has changed!</p>}
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Form with undo/redo and change tracking
 * const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
 * const { 
 *   previous, 
 *   history, 
 *   hasChanged,
 *   clearHistory 
 * } = usePrevious(formData, {
 *   includeInitial: true,
 *   maxHistory: 10,
 *   onChange: (current, prev) => {
 *     if (prev && hasChanged) {
 *       saveFormDraft(current);
 *     }
 *   },
 *   compare: (a, b) => a.name === b.name && a.email === b.email
 * });
 * 
 * const handleUndo = () => {
 *   if (previous) {
 *     setFormData(previous);
 *   }
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Animation with value history
 * const [position, setPosition] = useState({ x: 0, y: 0 });
 * const { history } = usePrevious(position, { maxHistory: 5 });
 * 
 * useEffect(() => {
 *   if (history.length >= 2) {
 *     const [current, previous] = history;
 *     const velocity = {
 *       x: current.x - previous.x,
 *       y: current.y - previous.y
 *     };
 *     animate({ velocity });
 *   }
 * }, [history]);
 * ```
 */
export function usePrevious<T>(
    value: T,
    {
        includeInitial = false,
        maxHistory = 1,
        onChange,
        compare = (a: T, b: T) => a === b,
    }: UsePreviousOptions<T> = {}
): UsePreviousResult<T> {
    const isFirstRenderRef = useRef<boolean>(true);
    const hasChangedRef = useRef<boolean>(false);
    const currentValueRef = useRef<T>(value);

    const { stack, push, peek, clear } = useStack<T>({
        maxSize: Math.max(maxHistory, 1),
        // onPush: (items) => {
        //     if (items.length >= 2 && hasChangedRef.current) {
        //         onChange?.(items[0], items[1]);
        //     }
        // }
    });

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            if (includeInitial) {
                push(value);
                hasChangedRef.current = false;
            }
            currentValueRef.current = value;
            return;
        }

        const hasChanged = !compare(value, currentValueRef.current);
        hasChangedRef.current = hasChanged;

        if (hasChanged) {
            push(currentValueRef.current);
            currentValueRef.current = value;
            onChange?.(value, peek());
        }
    }, [value, includeInitial, compare, push, onChange, peek]);

    const clearHistory = useCallback(() => {
        clear();
        hasChangedRef.current = false;
        currentValueRef.current = value;
    }, [clear, value]);

    return {
        previous: peek(),
        history: stack,
        clearHistory,
    };
} 