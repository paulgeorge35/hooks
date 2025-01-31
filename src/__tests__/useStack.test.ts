import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useStack } from '../useStack';

// Setup and teardown
beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useStack", () => {
    test("should initialize with empty stack when no initial value provided", () => {
        const { result } = renderHook(() => useStack<number>());
        expect(result.current.stack).toEqual([]);
        expect(result.current.isEmpty).toBe(true);
        expect(result.current.size).toBe(0);
    });

    test("should initialize with provided initial values", () => {
        const initialItems = [1, 2, 3];
        const { result } = renderHook(() => useStack<number>({ initialItems }));
        expect(result.current.stack).toEqual(initialItems);
        expect(result.current.isEmpty).toBe(false);
        expect(result.current.size).toBe(3);
    });

    test("should push items correctly", () => {
        const { result } = renderHook(() => useStack<string>());

        act(() => {
            result.current.push("first");
        });
        expect(result.current.stack).toEqual(["first"]);
        expect(result.current.size).toBe(1);

        act(() => {
            result.current.push("second");
        });
        expect(result.current.stack).toEqual(["second", "first"]);
        expect(result.current.size).toBe(2);
    });

    test("should pop items in LIFO order", () => {
        const { result } = renderHook(() => useStack<number>({ initialItems: [1, 2, 3] }));

        // First pop
        let poppedItem: number | undefined;
        act(() => {
            poppedItem = result.current.pop();
        });

        expect(poppedItem).toBe(1);
        expect(result.current.stack).toEqual([2, 3]);
        expect(result.current.size).toBe(2);

        // Second pop
        act(() => {
            poppedItem = result.current.pop();
        });

        expect(poppedItem).toBe(2);
        expect(result.current.stack).toEqual([3]);
        expect(result.current.size).toBe(1);

        // Third pop
        act(() => {
            poppedItem = result.current.pop();
        });

        expect(poppedItem).toBe(3);
        expect(result.current.stack).toEqual([]);
        expect(result.current.size).toBe(0);
        expect(result.current.isEmpty).toBe(true);

        // Pop from empty stack
        act(() => {
            poppedItem = result.current.pop();
        });

        expect(poppedItem).toBeUndefined();
        expect(result.current.stack).toEqual([]);
        expect(result.current.size).toBe(0);
        expect(result.current.isEmpty).toBe(true);
    });

    test("should handle pop on empty stack", () => {
        const { result } = renderHook(() => useStack<string>());

        act(() => {
            const item = result.current.pop();
            expect(item).toBeUndefined();
        });
        expect(result.current.stack).toEqual([]);
        expect(result.current.isEmpty).toBe(true);
    });

    test("should respect maxSize option", () => {
        const { result } = renderHook(() => useStack<number>({ maxSize: 3 }));

        act(() => {
            result.current.push(1); // Should be pushed out
            result.current.push(2);
            result.current.push(3);
            result.current.push(4);
        });

        expect(result.current.stack).toEqual([4, 3, 2]);
        expect(result.current.size).toBe(3);
    });

    test("should handle pushMany correctly", () => {
        const { result } = renderHook(() => useStack<number>());

        act(() => {
            result.current.pushMany([1, 2, 3]);
        });
        expect(result.current.stack).toEqual([1, 2, 3]);
        expect(result.current.size).toBe(3);
        expect(result.current.isEmpty).toBe(false);

        act(() => {
            result.current.pushMany([4, 5]);
        });
        expect(result.current.stack).toEqual([4, 5, 1, 2, 3]);
        expect(result.current.size).toBe(5);
        expect(result.current.isEmpty).toBe(false);

        // Test empty array
        act(() => {
            result.current.pushMany([]);
        });
        expect(result.current.stack).toEqual([4, 5, 1, 2, 3]);
        expect(result.current.size).toBe(5);
    });

    test("should handle popMany correctly", () => {
        const { result } = renderHook(() => useStack<number>({ initialItems: [1, 2, 3, 4, 5] }));

        // Pop multiple items
        let items: number[] = [];
        act(() => {
            items = result.current.popMany(3);
        });
        expect(items).toEqual([1, 2, 3]);
        expect(result.current.stack).toEqual([4, 5]);
        expect(result.current.size).toBe(2);

        // Pop remaining items
        act(() => {
            items = result.current.popMany(3);
        });
        expect(items).toEqual([4, 5]);
        expect(result.current.stack).toEqual([]);
        expect(result.current.size).toBe(0);
        expect(result.current.isEmpty).toBe(true);

        // Try to pop from empty stack
        act(() => {
            items = result.current.popMany(1);
        });
        expect(items).toEqual([]);
        expect(result.current.stack).toEqual([]);
        expect(result.current.size).toBe(0);
        expect(result.current.isEmpty).toBe(true);
    });

    test("should handle peek correctly", () => {
        const { result } = renderHook(() => useStack<number>({ initialItems: [1, 2, 3] }));

        // Peek at top
        expect(result.current.peek()).toBe(1);
        expect(result.current.stack).toEqual([1, 2, 3]); // Stack should remain unchanged

        // Peek at specific index
        expect(result.current.peek(1)).toBe(2);
        expect(result.current.stack).toEqual([1, 2, 3]); // Stack should remain unchanged

        // Peek at invalid index
        expect(result.current.peek(5)).toBeUndefined();
        expect(result.current.stack).toEqual([1, 2, 3]); // Stack should remain unchanged

        // Peek at empty stack
        act(() => {
            result.current.clear();
        });
        expect(result.current.peek()).toBeUndefined();
    });

    test("should reset stack to initial value", () => {
        const initialItems = [1, 2, 3];
        const { result } = renderHook(() => useStack<number>({ initialItems }));

        // Modify stack
        act(() => {
            result.current.push(4);
            result.current.pop();
        });
        expect(result.current.stack).toEqual([1, 2, 3]);

        // Reset stack
        act(() => {
            result.current.reset();
        });
        expect(result.current.stack).toEqual(initialItems);
    });

    test("should handle callbacks correctly", () => {
        const pushItems: number[][] = [];
        const popItems: number[][] = [];

        const { result } = renderHook(() => useStack<number>({
            onPush: (items) => pushItems.push([...items]),
            onPop: (items) => popItems.push([...items])
        }));

        // Test push callback
        act(() => {
            result.current.push(1);
            result.current.pushMany([2, 3]);
        });
        expect(pushItems).toEqual([[1], [2, 3, 1]]);

        // Test pop callback
        act(() => {
            result.current.pop();
            result.current.popMany(2);
        });
        expect(popItems).toEqual([[2], [2, 3]]);
    });
}); 