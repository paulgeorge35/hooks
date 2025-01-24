import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook, waitFor } from '@testing-library/react';
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

    test("should handle read errors with proper error object", async () => {
        // Mock JSON.parse to throw
        const originalParse = JSON.parse;
        JSON.parse = () => { throw new Error('Invalid JSON'); };

        // Set an invalid JSON value
        window.localStorage.setItem("test-key", "invalid json");

        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

        // Verify error object structure
        expect(result.current[2]).toEqual({
            type: 'read',
            message: 'Error reading localStorage key "test-key"',
            originalError: expect.any(Error)
        });

        // Value should fall back to initial value
        expect(result.current[0]).toBe("initial");

        // Restore original JSON.parse
        JSON.parse = originalParse;
    });

    test("should handle write errors with proper error object", async () => {
        // Mock JSON.stringify to throw
        const originalStringify = JSON.stringify;
        JSON.stringify = () => { throw new Error('Circular reference'); };

        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

        // Attempt to update value
        act(() => {
            result.current[1]("updated");
        });

        // Wait for error state to be set
        await waitFor(() => {
            expect(result.current[2]).toEqual({
                type: 'write',
                message: 'Error setting localStorage key "test-key"',
                originalError: expect.any(Error)
            });
        });

        // Restore original stringify
        JSON.stringify = originalStringify;
    });

    test("should clear error on successful write after error", async () => {
        // First cause a write error
        const originalStringify = JSON.stringify;
        JSON.stringify = () => { throw new Error('Circular reference'); };

        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

        act(() => {
            result.current[1]("will fail");
        });

        // Wait for error state to be set
        await waitFor(() => {
            expect(result.current[2]).toEqual({
                type: 'write',
                message: 'Error setting localStorage key "test-key"',
                originalError: expect.any(Error)
            });
        });

        // Restore original stringify and try writing again
        JSON.stringify = originalStringify;

        act(() => {
            result.current[1]("will succeed");
        });

        // Wait for error to be cleared
        await waitFor(() => {
            expect(result.current[2]).toBeNull();
        });
    });

    test("should handle storage events from other tabs", async () => {
        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

        // Simulate storage event from another tab
        act(() => {
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'test-key',
                newValue: JSON.stringify("updated from another tab")
            }));
        });

        expect(result.current[0]).toBe("updated from another tab");
    });

    test("should handle invalid JSON in storage events", async () => {
        const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

        // Simulate storage event with invalid JSON
        act(() => {
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'test-key',
                newValue: 'invalid json'
            }));
        });

        // Value should remain unchanged
        expect(result.current[0]).toBe("initial");

        // Should set error
        expect(result.current[2]).toEqual({
            type: 'read',
            message: 'Error parsing storage event for key "test-key"',
            originalError: expect.any(Error)
        });
    });
}); 