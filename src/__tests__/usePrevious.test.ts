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
        expect(result.current).toBeUndefined();
    });

    test("should return previous string value after update", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: "initial" }
        });

        // First render should return undefined
        expect(result.current).toBeUndefined();

        // Update the value
        rerender({ value: "updated" });

        // Should now return the previous value
        expect(result.current).toBe("initial");

        // Update again
        rerender({ value: "final" });
        expect(result.current).toBe("updated");
    });

    test("should handle number values", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: 0 }
        });

        expect(result.current).toBeUndefined();

        rerender({ value: 1 });
        expect(result.current).toBe(0);

        rerender({ value: -1 });
        expect(result.current).toBe(1);
    });

    test("should handle boolean values", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: true }
        });

        expect(result.current).toBeUndefined();

        rerender({ value: false });
        expect(result.current).toBe(true);

        rerender({ value: true });
        expect(result.current).toBe(false);
    });

    test("should handle object values", () => {
        const initialObject = { test: "value" };
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: initialObject }
        });

        expect(result.current).toBeUndefined();

        const updatedObject = { test: "updated" };
        rerender({ value: updatedObject });
        expect(result.current).toBe(initialObject);

        const finalObject = { test: "final" };
        rerender({ value: finalObject });
        expect(result.current).toBe(updatedObject);
    });

    test("should handle array values", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: [1, 2, 3] }
        });

        expect(result.current).toBeUndefined();

        rerender({ value: [4, 5, 6] });
        expect(result.current).toEqual([1, 2, 3]);

        rerender({ value: [7, 8, 9] });
        expect(result.current).toEqual([4, 5, 6]);
    });

    test("should handle null and undefined values", () => {
        type NullableValue = string | null | undefined;
        const { result, rerender } = renderHook(
            ({ value }: { value: NullableValue }) => usePrevious(value),
            { initialProps: { value: null } }
        );

        expect(result.current).toBeUndefined();

        // @ts-ignore
        rerender({ value: "something" });
        expect(result.current).toBeNull();

        // @ts-ignore
        rerender({ value: undefined });
        expect(result.current).toBe("something");

        // @ts-ignore
        rerender({ value: "final" });
        expect(result.current).toBeUndefined();
    });

    test("should update previous value even if current value is the same", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: "test" }
        });

        expect(result.current).toBeUndefined();

        // Rerender with the same value
        rerender({ value: "test" });
        expect(result.current).toBe("test");

        // Update to a different value
        rerender({ value: "different" });
        expect(result.current).toBe("test");

        // Rerender with the same value again
        rerender({ value: "different" });
        expect(result.current).toBe("different");
    });

    test("should handle function values", () => {
        const initialFn = () => "initial";
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: initialFn }
        });

        expect(result.current).toBeUndefined();

        const updatedFn = () => "updated";
        rerender({ value: updatedFn });
        expect(result.current).toBe(initialFn);

        const finalFn = () => "final";
        rerender({ value: finalFn });
        expect(result.current).toBe(updatedFn);
    });

    test("should maintain reference equality for unchanged values", () => {
        const obj = { test: "value" };
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: obj }
        });

        expect(result.current).toBeUndefined();

        // Update with a new object
        const newObj = { test: "new value" };
        rerender({ value: newObj });
        const firstPrevious = result.current;
        expect(firstPrevious).toBe(obj);

        // Update with another new object
        const finalObj = { test: "final value" };
        rerender({ value: finalObj });
        expect(result.current).toBe(newObj);
        expect(result.current).not.toBe(firstPrevious);
    });
}); 