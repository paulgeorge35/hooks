import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { usePrevious } from "../usePrevious";

beforeEach(async () => {
    GlobalRegistrator.register();
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for happy-dom to initialize
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("usePrevious", () => {
    test("should return undefined on first render", () => {
        const { result } = renderHook(() => usePrevious("initial"));
        expect(result.current.previous).toBeUndefined();
        expect(result.current.history).toEqual([]);
    });

    test("should handle includeInitial option", () => {
        const { result } = renderHook(() => usePrevious("initial", { includeInitial: true }));
        expect(result.current.previous).toEqual("initial");
        expect(result.current.history).toEqual(["initial"]);
    });

    test("should return previous string value after update", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value, {
            maxHistory: 2,
        }), {
            initialProps: { value: "initial" }
        });

        // First render
        expect(result.current.previous).toBeUndefined();
        expect(result.current.history).toEqual([]);

        // Update the value
        rerender({ value: "updated" });
        expect(result.current.previous).toBe("initial");
        expect(result.current.history).toEqual(["initial"]);

        // Update again
        rerender({ value: "final" });
        expect(result.current.previous).toBe("updated");
        expect(result.current.history).toEqual(["updated", "initial"]);
    });

    test("should handle number values", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value, {
            maxHistory: 2,
        }), {
            initialProps: { value: 0 }
        });

        expect(result.current.previous).toBeUndefined();
        expect(result.current.history).toEqual([]);

        rerender({ value: 1 });
        expect(result.current.previous).toBe(0);
        expect(result.current.history).toEqual([0]);

        rerender({ value: -1 });
        expect(result.current.previous).toBe(1);
        expect(result.current.history).toEqual([1, 0]);
    });

    test("should handle boolean values", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value, {
            maxHistory: 2,
        }), {
            initialProps: { value: true }
        });

        expect(result.current.previous).toBeUndefined();
        expect(result.current.history).toEqual([]);

        rerender({ value: false });
        expect(result.current.previous).toBe(true);
        expect(result.current.history).toEqual([true]);

        rerender({ value: true });
        expect(result.current.previous).toBe(false);
        expect(result.current.history).toEqual([false, true]);
    });

    test("should handle object values", () => {
        const initialObject = { test: "value" };
        const { result, rerender } = renderHook(({ value }) => usePrevious(value, {
            maxHistory: 3,
            compare: (a, b) => Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => a[key] === b[key])
        }), {
            initialProps: { value: initialObject }
        });

        expect(result.current.previous).toBeUndefined();
        expect(result.current.history).toEqual([]);

        const updatedObject = { test: "updated" };
        rerender({ value: updatedObject });
        expect(result.current.previous).toBe(initialObject);
        expect(result.current.history).toEqual([initialObject]);

        const finalObject = { test: "final" };
        rerender({ value: finalObject });
        expect(result.current.previous).toBe(updatedObject);
        expect(result.current.history).toEqual([updatedObject, initialObject]);
    });

    test("should handle array values", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value, {
            maxHistory: 3,
        }), {
            initialProps: { value: [1, 2, 3] }
        });

        expect(result.current.previous).toBeUndefined();
        expect(result.current.history).toEqual([]);

        rerender({ value: [4, 5, 6] });
        expect(result.current.previous).toEqual([1, 2, 3]);
        expect(result.current.history).toEqual([[1, 2, 3]]);

        rerender({ value: [7, 8, 9] });
        expect(result.current.previous).toEqual([4, 5, 6]);
        expect(result.current.history).toEqual([[4, 5, 6], [1, 2, 3]]);
    });

    test("should respect maxHistory option", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value, { maxHistory: 3 }), {
            initialProps: { value: 1 }
        });

        expect(result.current.history).toEqual([]);

        rerender({ value: 2 });
        expect(result.current.history).toEqual([1]);

        rerender({ value: 3 });
        expect(result.current.history).toEqual([2, 1]);

        rerender({ value: 4 });
        expect(result.current.history).toEqual([3, 2, 1]);

        rerender({ value: 5 });
        expect(result.current.history).toEqual([4, 3, 2]);
    });

    test("should handle custom compare function", () => {
        const { result, rerender } = renderHook(({ value }) =>
            usePrevious(value, {
                compare: (a, b) => JSON.stringify(a) === JSON.stringify(b)
            }), {
            initialProps: { value: { id: 1, data: "test" } }
        });

        expect(result.current.previous).toBeUndefined();
        expect(result.current.history).toEqual([]);

        // Same data, different object reference
        rerender({ value: { id: 1, data: "test" } });
        expect(result.current.previous).toBeUndefined();
        expect(result.current.history).toEqual([]);

        // Different data
        rerender({ value: { id: 1, data: "changed" } });
        expect(result.current.previous).toEqual({ id: 1, data: "test" });
        expect(result.current.history).toEqual([{ id: 1, data: "test" }]);
    });
}); 