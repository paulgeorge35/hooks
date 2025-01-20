import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { useFocus } from "../useFocus";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useFocus", () => {
    test("should initialize with default state", () => {
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref }));
        expect(result.current.isFocused).toBe(false);
    });

    test("should handle focus event", async () => {
        const onFocus = mock(() => {});
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref, onFocus }));

        // Trigger focus event
        ref.current.dispatchEvent(new Event('focus'));
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(result.current.isFocused).toBe(true);
        expect(onFocus).toHaveBeenCalled();
    });

    test("should handle blur event", async () => {
        const onBlur = mock(() => {});
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref, onBlur }));

        // First focus
        ref.current.dispatchEvent(new Event('focus'));
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.isFocused).toBe(true);

        // Then blur
        ref.current.dispatchEvent(new Event('blur'));
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(result.current.isFocused).toBe(false);
        expect(onBlur).toHaveBeenCalled();
    });

    test("should handle multiple focus/blur events", async () => {
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref }));

        // Focus
        ref.current.dispatchEvent(new Event('focus'));
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.isFocused).toBe(true);

        // Blur
        ref.current.dispatchEvent(new Event('blur'));
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.isFocused).toBe(false);

        // Focus again
        ref.current.dispatchEvent(new Event('focus'));
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.isFocused).toBe(true);
    });

    test("should cleanup event listeners on unmount", async () => {
        const ref = { current: document.createElement('div') };
        const removeEventListenerSpy = mock(ref.current.removeEventListener);
        ref.current.removeEventListener = removeEventListenerSpy;

        const { unmount } = renderHook(() => useFocus({ ref }));
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledTimes(2); // Once for focus, once for blur
    });

    test("should handle null ref", () => {
        const ref = { current: null };
        const { result } = renderHook(() => useFocus({ ref }));
        expect(result.current.isFocused).toBe(false);
    });

    test("should not throw with undefined callbacks", async () => {
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref }));

        expect(() => {
            ref.current.dispatchEvent(new Event('focus'));
        }).not.toThrow();

        expect(() => {
            ref.current.dispatchEvent(new Event('blur'));
        }).not.toThrow();
    });
}); 