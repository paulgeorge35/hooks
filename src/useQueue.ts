import { useState } from "react";

/**
 * Return type for the useQueue hook
 * @template T The type of items stored in the queue
 */
export type UseQueue<T> = {
    /** The current items in the queue */
    queue: T[];
    /** Add an item to the end of the queue */
    enqueue: (item: T) => void;
    /** Remove and return the first item from the queue */
    dequeue: () => void;
    /** Reset the queue to its initial state */
    reset: () => void;
}

/**
 * A React hook that implements a FIFO (First In, First Out) queue data structure
 * 
 * @template T The type of items stored in the queue
 * @param {T[]} initialValue The initial array of items to populate the queue
 * @returns {UseQueue<T>} An object containing the queue and methods to manipulate it
 * 
 * @example
 * ```typescript
 * const TaskQueue = () => {
 *   const { queue, enqueue, dequeue, reset } = useQueue<string>([]);
 * 
 *   return (
 *     <div>
 *       <h2>Tasks ({queue.length})</h2>
 *       <ul>
 *         {queue.map((task, index) => (
 *           <li key={index}>{task}</li>
 *         ))}
 *       </ul>
 *       <button onClick={() => enqueue('New Task')}>Add Task</button>
 *       <button onClick={dequeue}>Process Next Task</button>
 *       <button onClick={reset}>Clear All</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useQueue = <T>(initialValue: T[]): UseQueue<T> => {
    const [queue, setQueue] = useState(initialValue);

    /**
     * Add an item to the end of the queue
     * @param {T} item The item to add to the queue
     */
    const enqueue = (item: T) => {
        setQueue(prevQueue => [...prevQueue, item]);
    }

    /**
     * Remove the first item from the queue
     * This follows FIFO (First In, First Out) principle
     */
    const dequeue = () => {
        setQueue(prevQueue => prevQueue.slice(1));
    }

    /**
     * Reset the queue to its initial state
     * This will clear all items and restore the initial values
     */
    const reset = () => {
        setQueue(initialValue);
    }

    return { queue, enqueue, dequeue, reset };
}