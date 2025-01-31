import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useQueue } from '../useQueue';

// Setup and teardown
beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useQueue", () => {
    test("should initialize with empty queue when no initial value provided", () => {
        const { result } = renderHook(() => useQueue<number>());
        expect(result.current.queue).toEqual([]);
        expect(result.current.isEmpty).toBe(true);
        expect(result.current.size).toBe(0);
    });

    test("should initialize with provided initial values", () => {
        const initialItems = [1, 2, 3];
        const { result } = renderHook(() => useQueue<number>({ initialItems }));
        expect(result.current.queue).toEqual(initialItems);
        expect(result.current.isEmpty).toBe(false);
        expect(result.current.size).toBe(3);
    });

    test("should enqueue items correctly", () => {
        const { result } = renderHook(() => useQueue<string>());

        act(() => {
            result.current.enqueue("first");
        });
        expect(result.current.queue).toEqual(["first"]);
        expect(result.current.size).toBe(1);

        act(() => {
            result.current.enqueue("second");
        });
        expect(result.current.queue).toEqual(["first", "second"]);
        expect(result.current.size).toBe(2);
    });

    test("should handle dequeue on empty queue", () => {
        const { result } = renderHook(() => useQueue<string>());

        act(() => {
            const item = result.current.dequeue();
            expect(item).toBeUndefined();
        });
        expect(result.current.queue).toEqual([]);
        expect(result.current.isEmpty).toBe(true);
    });

    test("should respect maxSize option", () => {
        const { result } = renderHook(() => useQueue<number>({ maxSize: 3 }));

        act(() => {
            result.current.enqueue(1);
            result.current.enqueue(2);
            result.current.enqueue(3);
            result.current.enqueue(4); // Should not be added
        });

        expect(result.current.queue).toEqual([1, 2, 3]);
        expect(result.current.size).toBe(3);
    });

    test("should handle enqueueMany correctly", () => {
        const { result } = renderHook(() => useQueue<number>());

        act(() => {
            result.current.enqueueMany([1, 2, 3]);
        });
        expect(result.current.queue).toEqual([1, 2, 3]);
        expect(result.current.size).toBe(3);
        expect(result.current.isEmpty).toBe(false);

        act(() => {
            result.current.enqueueMany([4, 5]);
        });
        expect(result.current.queue).toEqual([1, 2, 3, 4, 5]);
        expect(result.current.size).toBe(5);
        expect(result.current.isEmpty).toBe(false);

        // Test empty array
        act(() => {
            result.current.enqueueMany([]);
        });
        expect(result.current.queue).toEqual([1, 2, 3, 4, 5]);
        expect(result.current.size).toBe(5);
    });

    test("should reset queue to initial value", () => {
        const initialItems = [1, 2, 3];
        const { result } = renderHook(() => useQueue<number>({ initialItems }));

        // Modify queue
        act(() => {
            result.current.enqueue(4);
            result.current.dequeue();
        });
        expect(result.current.queue).toEqual([2, 3, 4]);

        // Reset queue
        act(() => {
            result.current.reset();
        });
        expect(result.current.queue).toEqual(initialItems);
    });

    test("should handle mixed operations correctly", () => {
        const { result } = renderHook(() => useQueue<number>());

        act(() => {
            result.current.enqueue(1);
            result.current.enqueue(2);
        });
        expect(result.current.queue).toEqual([1, 2]);

        act(() => {
            result.current.dequeue();
            result.current.enqueue(3);
        });
        expect(result.current.queue).toEqual([2, 3]);

        act(() => {
            result.current.clear();
        });
        expect(result.current.queue).toEqual([]);
        expect(result.current.isEmpty).toBe(true);
    });

    test("should handle callbacks correctly", () => {
        const enqueueItems: number[][] = [];
        const dequeueItems: number[][] = [];

        const { result } = renderHook(() => useQueue<number>({
            onEnqueue: (items) => enqueueItems.push([...items]),
            onDequeue: (items) => dequeueItems.push([...items])
        }));

        // Test enqueue callback
        act(() => {
            result.current.enqueue(1);
            result.current.enqueueMany([2, 3]);
        });
        expect(enqueueItems).toEqual([[1], [2, 3]]);

        // Test dequeue callback
        act(() => {
            result.current.dequeue();
            result.current.dequeueMany(2);
        });
        expect(dequeueItems).toEqual([[1], [2, 3]]);
    });
}); 