import { useCallback, useMemo, useState } from "react";

/**
 * Return type for the useQueue hook
 * @template T The type of items stored in the queue
 */
export type UseQueue<T> = {
    /** The current items in the queue (readonly to prevent direct mutations) */
    queue: ReadonlyArray<T>;
    /** Add an item to the end of the queue */
    enqueue: (item: T) => void;
    /** Add multiple items to the end of the queue */
    enqueueMany: (items: ReadonlyArray<T>) => void;
    /** Remove and return the first item from the queue */
    dequeue: () => T | undefined;
    /** Remove and return multiple items from the front of the queue */
    dequeueMany: (count: number) => T[];
    /** Peek at the first item without removing it */
    peek: () => T | undefined;
    /** Reset the queue to its initial state */
    reset: () => void;
    /** Clear all items from the queue */
    clear: () => void;
    /** Current size of the queue */
    size: number;
    /** Whether the queue is empty */
    isEmpty: boolean;
};

/**
 * Configuration options for the useQueue hook
 * @template T The type of items stored in the queue
 */
export type UseQueueOptions<T> = {
    /** Initial items to populate the queue with */
    initialItems?: ReadonlyArray<T>;
    /** Maximum size of the queue (optional) */
    maxSize?: number;
    /** Callback when items are added */
    onEnqueue?: (items: ReadonlyArray<T>) => void;
    /** Callback when items are removed */
    onDequeue?: (items: ReadonlyArray<T>) => void;
};

/**
 * A React hook that implements a FIFO (First In, First Out) queue data structure
 * with type safety and additional utility functions.
 * 
 * @template T The type of items stored in the queue
 * @param {UseQueueOptions<T>} options Configuration options
 * @returns {UseQueue<T>} An object containing the queue and methods to manipulate it
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const TaskQueue = () => {
 *   const { 
 *     queue, 
 *     enqueue, 
 *     dequeue, 
 *     size,
 *     isEmpty 
 *   } = useQueue<string>({
 *     initialItems: ['Task 1', 'Task 2'],
 *     onDequeue: (items) => console.log('Processed:', items)
 *   });
 * 
 *   return (
 *     <div>
 *       <h2>Tasks ({size})</h2>
 *       <ul>
 *         {queue.map((task, index) => (
 *           <li key={index}>{task}</li>
 *         ))}
 *       </ul>
 *       <button 
 *         onClick={() => enqueue('New Task')}
 *         disabled={size >= maxSize}
 *       >
 *         Add Task
 *       </button>
 *       <button 
 *         onClick={() => dequeue()} 
 *         disabled={isEmpty}
 *       >
 *         Process Next Task
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 * 
 * @example
 * ```typescript
 * // Batch operations
 * const BatchProcessor = () => {
 *   const { 
 *     enqueueMany, 
 *     dequeueMany, 
 *     size 
 *   } = useQueue<number>({
 *     maxSize: 100
 *   });
 * 
 *   const addBatch = () => {
 *     enqueueMany([1, 2, 3, 4, 5]);
 *   };
 * 
 *   const processBatch = () => {
 *     const items = dequeueMany(3);
 *     console.log('Processing:', items);
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={addBatch}>Add Batch</button>
 *       <button onClick={processBatch}>Process Batch</button>
 *       <p>Queue size: {size}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export const useQueue = <T>({
    initialItems = [],
    maxSize = Number.MAX_SAFE_INTEGER,
    onEnqueue,
    onDequeue,
}: UseQueueOptions<T> = {}): UseQueue<T> => {
    const [items, setItems] = useState<T[]>(initialItems as T[]);

    const enqueue = useCallback((item: T) => {
        setItems(current => {
            if (current.length >= maxSize) {
                return current;
            }
            const newItems = [...current, item];
            onEnqueue?.([item]);
            return newItems;
        });
    }, [maxSize, onEnqueue]);

    const enqueueMany = useCallback((newItems: ReadonlyArray<T>) => {
        setItems(current => {
            const availableSpace = maxSize - current.length;
            if (availableSpace <= 0) {
                return current;
            }
            const itemsToAdd = newItems.slice(0, availableSpace);
            onEnqueue?.(itemsToAdd);
            return [...current, ...itemsToAdd];
        });
    }, [maxSize, onEnqueue]);

    const dequeue = useCallback((): T | undefined => {
        let dequeuedItem: T | undefined;
        setItems(current => {
            if (current.length === 0) {
                return current;
            }
            [dequeuedItem, ...current] = current;
            onDequeue?.([dequeuedItem as T]);
            return current;
        });
        return dequeuedItem;
    }, [onDequeue]);

    const dequeueMany = useCallback((count: number): T[] => {
        let dequeuedItems: T[] = [];
        setItems(current => {
            if (current.length === 0 || count <= 0) {
                return current;
            }
            dequeuedItems = current.slice(0, count);
            onDequeue?.(dequeuedItems);
            return current.slice(count);
        });
        return dequeuedItems;
    }, [onDequeue]);

    const peek = useCallback((): T | undefined => {
        return items[0];
    }, [items]);

    const reset = useCallback(() => {
        setItems(initialItems as T[]);
    }, [initialItems]);

    const clear = useCallback(() => {
        setItems([]);
    }, []);

    return useMemo(() => ({
        queue: items,
        enqueue,
        enqueueMany,
        dequeue,
        dequeueMany,
        peek,
        reset,
        clear,
        size: items.length,
        isEmpty: items.length === 0,
    }), [
        items,
        enqueue,
        enqueueMany,
        dequeue,
        dequeueMany,
        peek,
        reset,
        clear
    ]);
};