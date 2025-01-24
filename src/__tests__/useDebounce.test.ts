import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
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
        const { result } = renderHook(() => useDebounce("initial", { delay: 500 }));
        expect(result.current.value).toBe("initial");
        expect(result.current.status).toBe("idle");
    });

    test("should not update value before delay", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, { delay: 500 }),
            { initialProps: { value: "initial" } }
        );

        expect(result.current.value).toBe("initial");
        expect(result.current.status).toBe("idle");

        // Change the value
        rerender({ value: "updated" });

        // Check before delay
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(result.current.value).toBe("initial");
        expect(result.current.status).toBe("pending");
    });

    test("should update value after delay", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, { delay: 500 }),
            { initialProps: { value: "initial" } }
        );

        // Change the value
        rerender({ value: "updated" });

        // Wait for the full delay
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(result.current.value).toBe("updated");
        expect(result.current.status).toBe("idle");
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
        expect(result.current.value).toBe("initial");
        expect(result.current.status).toBe("pending");

        // Wait for the default delay
        await new Promise(resolve => setTimeout(resolve, 500));
        expect(result.current.value).toBe("updated");
        expect(result.current.status).toBe("idle");
    });

    test("should handle multiple rapid updates", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, { delay: 500 }),
            { initialProps: { value: "initial" } }
        );

        // Multiple rapid updates
        rerender({ value: "update1" });
        await new Promise(resolve => setTimeout(resolve, 100));

        rerender({ value: "update2" });
        await new Promise(resolve => setTimeout(resolve, 100));

        rerender({ value: "update3" });

        // Check that intermediate values were not set
        expect(result.current.value).toBe("initial");
        expect(result.current.status).toBe("pending");

        // Wait for the delay
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(result.current.value).toBe("update3");
        expect(result.current.status).toBe("idle");
    });

    test("should handle different value types", async () => {
        const { result: numberResult, rerender: numberRerender } = renderHook(
            ({ value }) => useDebounce(value, { delay: 500 }),
            { initialProps: { value: 0 } }
        );

        numberRerender({ value: 42 });
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(numberResult.current.value).toBe(42);
        expect(numberResult.current.status).toBe("idle");

        const { result: boolResult, rerender: boolRerender } = renderHook(
            ({ value }) => useDebounce(value, { delay: 500 }),
            { initialProps: { value: false } }
        );

        boolRerender({ value: true });
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(boolResult.current.value).toBe(true);
        expect(boolResult.current.status).toBe("idle");
    });

    test("should cleanup timeout on unmount", async () => {
        const { result, rerender, unmount } = renderHook(
            ({ value }) => useDebounce(value, { delay: 500 }),
            { initialProps: { value: "initial" } }
        );

        rerender({ value: "updated" });
        unmount();

        // Even after delay, value should not update because hook was unmounted
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(result.current.value).toBe("initial");
    });

    test("should handle zero delay", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, { delay: 0 }),
            { initialProps: { value: "initial" } }
        );

        rerender({ value: "updated" });
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(result.current.value).toBe("updated");
        expect(result.current.status).toBe("idle");
    });

    test("should handle flush", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, { delay: 500 }),
            { initialProps: { value: "initial" } }
        );

        rerender({ value: "updated" });
        expect(result.current.value).toBe("initial");
        expect(result.current.status).toBe("pending");

        act(() => {
            result.current.flush();
        });
        expect(result.current.value).toBe("updated");
        expect(result.current.status).toBe("idle");
    });

    test("should handle cancel and resume", async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, { delay: 500 }),
            { initialProps: { value: "initial" } }
        );

        // Start a debounce
        rerender({ value: "update1" });
        expect(result.current.status).toBe("pending");

        // Cancel it
        act(() => {
            result.current.cancel();
        });
        expect(result.current.value).toBe("initial");
        expect(result.current.status).toBe("cancelled");

        // Same value update should maintain cancelled state
        rerender({ value: "update1" });
        expect(result.current.status).toBe("cancelled");
        expect(result.current.value).toBe("initial");

        // New value should resume debouncing
        rerender({ value: "update2" });
        expect(result.current.status).toBe("pending");

        // Wait for debounce to complete
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(result.current.value).toBe("update2");
        expect(result.current.status).toBe("idle");
    });
}); 