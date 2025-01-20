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
        const { result } = renderHook(() => useQueue<number>([]));
        expect(result.current.queue).toEqual([]);
    });

    test("should initialize with provided initial values", () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useQueue<number>(initialValue));
        expect(result.current.queue).toEqual(initialValue);
    });

    test("should enqueue items correctly", () => {
        const { result } = renderHook(() => useQueue<string>([]));

        act(() => {
            result.current.enqueue("first");
        });
        expect(result.current.queue).toEqual(["first"]);

        act(() => {
            result.current.enqueue("second");
        });
        expect(result.current.queue).toEqual(["first", "second"]);
    });

    test("should dequeue items in FIFO order", () => {
        const { result } = renderHook(() => useQueue<number>([1, 2, 3]));

        act(() => {
            result.current.dequeue();
        });
        expect(result.current.queue).toEqual([2, 3]);

        act(() => {
            result.current.dequeue();
        });
        expect(result.current.queue).toEqual([3]);
    });

    test("should handle dequeue on empty queue", () => {
        const { result } = renderHook(() => useQueue<string>([]));

        act(() => {
            result.current.dequeue();
        });
        expect(result.current.queue).toEqual([]);
    });

    test("should reset queue to initial value", () => {
        const initialValue = [1, 2, 3];
        const { result } = renderHook(() => useQueue<number>(initialValue));

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
        expect(result.current.queue).toEqual(initialValue);
    });

    test("should handle mixed operations correctly", () => {
        const { result } = renderHook(() => useQueue<number>([]));

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
            result.current.reset();
        });
        expect(result.current.queue).toEqual([]);
    });

    test("should preserve type safety", () => {
        type TestItem = { id: number; value: string };
        const initialItems: TestItem[] = [
            { id: 1, value: "one" },
            { id: 2, value: "two" }
        ];

        const { result } = renderHook(() => useQueue<TestItem>(initialItems));

        act(() => {
            result.current.enqueue({ id: 3, value: "three" });
        });
        expect(result.current.queue).toEqual([
            { id: 1, value: "one" },
            { id: 2, value: "two" },
            { id: 3, value: "three" }
        ]);

        act(() => {
            result.current.dequeue();
        });
        expect(result.current.queue).toEqual([
            { id: 2, value: "two" },
            { id: 3, value: "three" }
        ]);
    });
}); 