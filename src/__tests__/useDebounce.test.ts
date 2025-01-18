import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useDebounce } from "../useDebounce";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useDebounce", () => {
    test("should initialize with initial value", async () => {
        const { result } = renderHook(() => useDebounce("initial", 500));
        expect(result.current).toBe("initial");
    });

    test("should not update value before delay", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: "initial" } }
        );

        expect(result.current).toBe("initial");

        // Change the value
        rerender({ value: "updated" });
        
        // Wait less than the delay
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(result.current).toBe("initial");
    });

    test("should update value after delay", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: "initial" } }
        );

        // Change the value
        rerender({ value: "updated" });
        
        // Wait for the full delay
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(result.current).toBe("updated");
    });

    test("should use default delay of 500ms", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value),
            { initialProps: { value: "initial" } }
        );

        // Change the value
        rerender({ value: "updated" });
        
        // Check before default delay
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(result.current).toBe("initial");
        
        // Check after default delay
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(result.current).toBe("updated");
    });

    test("should handle multiple rapid updates", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: "initial" } }
        );

        // Simulate multiple rapid updates
        rerender({ value: "update1" });
        await new Promise(resolve => setTimeout(resolve, 100));
        
        rerender({ value: "update2" });
        await new Promise(resolve => setTimeout(resolve, 100));
        
        rerender({ value: "update3" });
        
        // Check that intermediate values were not set
        expect(result.current).toBe("initial");
        
        // Wait for the full delay
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(result.current).toBe("update3");
    });

    test("should handle different value types", async () => {
        // Test with number
        const { result: numberResult, rerender: numberRerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: 0 } }
        );
        
        numberRerender({ value: 42 });
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(numberResult.current).toBe(42);

        // Test with object
        const { result: objectResult, rerender: objectRerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: { test: "initial" } } }
        );
        
        objectRerender({ value: { test: "updated" } });
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(objectResult.current).toEqual({ test: "updated" });

        // Test with array
        const { result: arrayResult, rerender: arrayRerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: [1, 2, 3] } }
        );
        
        arrayRerender({ value: [4, 5, 6] });
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(arrayResult.current).toEqual([4, 5, 6]);
    });

    test("should cleanup timeout on unmount", async () => {
        const { result, rerender, unmount } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: "initial" } }
        );

        rerender({ value: "updated" });
        unmount();

        // Even after delay, value should not update because hook was unmounted
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(result.current).toBe("initial");
    });

    test("should handle zero delay", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 0),
            { initialProps: { value: "initial" } }
        );

        rerender({ value: "updated" });
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(result.current).toBe("updated");
    });
}); 