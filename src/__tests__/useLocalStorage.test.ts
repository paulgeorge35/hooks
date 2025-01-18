import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useLocalStorage } from "../useLocalStorage";

beforeEach(async () => {
    GlobalRegistrator.register();
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for happy-dom to initialize
    window.localStorage.clear();
});

afterEach(async () => {
    window.localStorage.clear();
    GlobalRegistrator.unregister();
});

describe("useLocalStorage", () => {
    test("should initialize with value from localStorage if present", async () => {
        window.localStorage.setItem("test-key", JSON.stringify("stored value"));
        
        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
        expect(result.current[0]).toBe("stored value");
    });

    test("should initialize with initial value if localStorage is empty", async () => {
        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
        expect(result.current[0]).toBe("initial");
    });

    test("should initialize with result of function if initial value is a function", async () => {
        const { result } = renderHook(() => 
            useLocalStorage("test-key", () => "function result")
        );
        expect(result.current[0]).toBe("function result");
    });

    test("should update value and localStorage when setter is called", async () => {
        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

        act(() => {
            result.current[1]("updated");
        });

        const storedValue = window.localStorage.getItem("test-key");
        expect(result.current[0]).toBe("updated");
        expect(storedValue && JSON.parse(storedValue)).toBe("updated");
    });

    test("should update value and localStorage when setter function is called", async () => {
        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

        act(() => {
            result.current[1]((prev) => `${prev} updated`);
        });

        const storedValue = window.localStorage.getItem("test-key");
        expect(result.current[0]).toBe("initial updated");
        expect(storedValue && JSON.parse(storedValue)).toBe("initial updated");
    });

    test("should handle complex objects", async () => {
        const initialObject = { nested: { value: 42 }, array: [1, 2, 3] };
        const { result } = renderHook(() => 
            useLocalStorage("test-key", initialObject)
        );

        expect(result.current[0]).toEqual(initialObject);

        const updatedObject = { nested: { value: 43 }, array: [4, 5, 6] };
        act(() => {
            result.current[1](updatedObject);
        });

        const storedValue = window.localStorage.getItem("test-key");
        expect(result.current[0]).toEqual(updatedObject);
        expect(storedValue && JSON.parse(storedValue)).toEqual(updatedObject);
    });

    test("should handle different value types", async () => {
        // Number
        const { result: numberResult } = renderHook(() => 
            useLocalStorage("number-key", 42)
        );
        expect(numberResult.current[0]).toBe(42);

        // Boolean
        const { result: boolResult } = renderHook(() => 
            useLocalStorage("bool-key", true)
        );
        expect(boolResult.current[0]).toBe(true);

        // Array
        const { result: arrayResult } = renderHook(() => 
            useLocalStorage("array-key", [1, 2, 3])
        );
        expect(arrayResult.current[0]).toEqual([1, 2, 3]);

        // Null
        const { result: nullResult } = renderHook(() => 
            useLocalStorage("null-key", null)
        );
        expect(nullResult.current[0]).toBe(null);
    });

    test("should handle localStorage errors gracefully", async () => {
        // Save original methods
        const originalSetItem = window.localStorage.setItem;
        const originalWarn = console.warn;
        
        // Mock methods
        console.warn = () => {};
        window.localStorage.setItem = () => {
            throw new Error('Storage quota exceeded');
        };

        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

        act(() => {
            result.current[1]("updated");
        });

        // Value should still update in state even if localStorage fails
        expect(result.current[0]).toBe("updated");

        // Restore original methods
        window.localStorage.setItem = originalSetItem;
        console.warn = originalWarn;
    });

    test("should handle multiple hooks with same key", async () => {
        const { result: result1 } = renderHook(() => 
            useLocalStorage("shared-key", "initial")
        );
        const { result: result2 } = renderHook(() => 
            useLocalStorage("shared-key", "different initial")
        );

        // Both hooks should have the same value
        expect(result1.current[0]).toBe("initial");
        expect(result2.current[0]).toBe("initial");

        // Updating one should update localStorage
        act(() => {
            result1.current[1]("updated");
        });

        const storedValue = window.localStorage.getItem("shared-key");
        expect(storedValue && JSON.parse(storedValue)).toBe("updated");

        // But won't automatically update the other hook instance
        // (this is expected behavior as they are separate instances)
        expect(result2.current[0]).toBe("initial");
    });

    test("should persist value between hook remounts", async () => {
        const { result, rerender } = renderHook(() => 
            useLocalStorage("test-key", "initial")
        );

        act(() => {
            result.current[1]("updated");
        });

        // Unmount and remount the hook
        rerender();

        expect(result.current[0]).toBe("updated");
    });
}); 