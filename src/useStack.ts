import { useCallback, useMemo, useState } from "react";


/**
 * Return type for the useStack hook
 * @template T The type of items stored in the stack
 */
export type UseStack<T> = {
    /** The current items in the stack (readonly to prevent direct mutations) */
    stack: ReadonlyArray<T>;
    /** Add an item to the top of the stack */
    push: (item: T) => void;
    /** Add multiple items to the top of the stack */
    pushMany: (items: ReadonlyArray<T>) => void;
    /** Remove and return the top item from the stack */
    pop: () => T | undefined;
    /** Remove and return multiple items from the top of the stack */
    popMany: (count: number) => T[];
    /** Peek at an item at a specific index (default is 0) without removing it */
    peek: (index?: number) => T | undefined;
    /** Reset the stack to its initial state */
    reset: () => void;
    /** Clear all items from the stack */
    clear: () => void;
    /** Current size of the stack */
    size: number;
    /** Whether the stack is empty */
    isEmpty: boolean;
}

/**
 * Configuration options for the useStack hook
 * @template T The type of items stored in the stack
 */
export type UseStackOptions<T> = {
    /** Initial items to populate the stack with */
    initialItems?: ReadonlyArray<T>;
    /** Maximum size of the stack (optional); if set, oldest items will be removed when the stack exceeds this size */
    maxSize?: number;
    /** Callback when items are added */
    onPush?: (items: ReadonlyArray<T>) => void;
    /** Callback when items are removed */
    onPop?: (items: ReadonlyArray<T>) => void;
};

/**
 * A React hook that implements a LIFO (Last In, First Out) stack data structure
 * with type safety and additional utility functions.
 * 
 * @template T The type of items stored in the stack
 * @param {UseStackOptions<T>} options Configuration options
 * @returns {UseStack<T>} An object containing the stack and methods to manipulate it
 * 
 * @example
 * ```typescript
 * const { stack, push, pop, peek, reset, clear, size, isEmpty } = useStack<string>({
 *   initialItems: ['Item 1', 'Item 2'],
 *   onPush: (items) => console.log('Pushed:', items),
 *   onPop: (items) => console.log('Popped:', items)
 * });
 * ```
 */
export function useStack<T>({
    initialItems = [] as T[],
    maxSize,
    onPush,
    onPop,
}: UseStackOptions<T> = {}): UseStack<T> {
    const [stack, setStack] = useState<T[]>([...initialItems]);

    const push = useCallback((item: T) => {
        setStack(current => {
            if (maxSize !== undefined) {
                const newItems = [item, ...current].slice(0, maxSize);
                onPush?.(newItems);
                return newItems;
            }
            const newItems = [item, ...current];
            onPush?.(newItems);
            return newItems;
        });
    }, [maxSize, onPush]);
//TODO fix this bellow
    const pushMany = useCallback((items: ReadonlyArray<T>) => {
        if (!items.length) return;
        
        setStack(current => {
            if (maxSize !== undefined) {
                const newItems = [...items, ...current].slice(0, maxSize);
                onPush?.(newItems);
                return newItems;
            }
            const newItems = [...items, ...current];
            onPush?.(newItems);
            return newItems;
        });
    }, [maxSize, onPush]);

    const pop = useCallback(() => {
        if (stack.length === 0) return undefined;
        
        const item = stack[0];
        setStack(current => {
            const [first, ...rest] = current;
            if (first !== undefined) {
                onPop?.([first]);
            }
            return rest;
        });
        return item;
    }, [onPop, stack]);

    const popMany = useCallback((count: number) => {
        if (count <= 0) return [];
        if (stack.length === 0) return [];
        
        const actualCount = Math.min(count, stack.length);
        const items = stack.slice(0, actualCount);
        
        setStack(current => {
            if (items.length > 0) {
                onPop?.(items);
            }
            return current.slice(actualCount);
        });
        return items;
    }, [onPop, stack]);

    const peek = useCallback((index = 0) => {
        return stack[index];
    }, [stack]);

    const reset = useCallback(() => {
        setStack([...initialItems]);
    }, [initialItems]);

    const clear = useCallback(() => {
        setStack([]);
    }, []);

    const size = useMemo(() => {
        return stack.length;
    }, [stack]);

    const isEmpty = useMemo(() => {
        return stack.length === 0;
    }, [stack]);

    return {
        stack,
        push,
        pushMany,
        pop,
        popMany,
        peek,
        reset,
        clear,
        size,
        isEmpty,
    };
}