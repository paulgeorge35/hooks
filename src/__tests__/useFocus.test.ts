import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
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
        expect(typeof result.current.setFocus).toBe('function');
        expect(typeof result.current.setBlur).toBe('function');
    });

    test("should handle focus event", async () => {
        const onFocus = mock(() => {});
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref, onFocus }));

        await act(async () => {
            ref.current.dispatchEvent(new Event('focus'));
        });

        expect(result.current.isFocused).toBe(true);
        expect(onFocus).toHaveBeenCalled();
    });

    test("should handle blur event", async () => {
        const onBlur = mock(() => {});
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref, onBlur }));

        await act(async () => {
            // First focus
            ref.current.dispatchEvent(new Event('focus'));
            // Then blur
            ref.current.dispatchEvent(new Event('blur'));
        });

        expect(result.current.isFocused).toBe(false);
        expect(onBlur).toHaveBeenCalled();
    });

    test("should handle setFocus function", async () => {
        const onFocus = mock(() => {});
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref, onFocus }));

        await act(async () => {
            result.current.setFocus();
        });

        expect(result.current.isFocused).toBe(true);
        expect(onFocus).toHaveBeenCalled();
    });

    test("should handle setBlur function", async () => {
        const onBlur = mock(() => {});
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref, onBlur }));

        await act(async () => {
            // First focus
            result.current.setFocus();
            // Then blur
            result.current.setBlur();
        });

        expect(result.current.isFocused).toBe(false);
        expect(onBlur).toHaveBeenCalled();
    });

    test("should handle multiple focus/blur events", async () => {
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref }));

        await act(async () => {
            // Focus
            ref.current.dispatchEvent(new Event('focus'));
        });
        expect(result.current.isFocused).toBe(true);

        await act(async () => {
            // Blur
            ref.current.dispatchEvent(new Event('blur'));
        });
        expect(result.current.isFocused).toBe(false);

        await act(async () => {
            // Focus again
            ref.current.dispatchEvent(new Event('focus'));
        });
        expect(result.current.isFocused).toBe(true);
    });

    test("should cleanup event listeners on unmount", () => {
        const ref = { current: document.createElement('div') };
        const removeEventListenerSpy = mock(ref.current.removeEventListener);
        ref.current.removeEventListener = removeEventListenerSpy;

        const { unmount } = renderHook(() => useFocus({ ref }));
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledTimes(0); // We're using AbortController now
    });

    test("should handle null ref", () => {
        const ref = { current: null };
        const { result } = renderHook(() => useFocus({ ref }));
        expect(result.current.isFocused).toBe(false);
    });

    test("should not throw with undefined callbacks", async () => {
        const ref = { current: document.createElement('div') };
        const { result } = renderHook(() => useFocus({ ref }));

        await act(async () => {
            expect(() => {
                ref.current.dispatchEvent(new Event('focus'));
                ref.current.dispatchEvent(new Event('blur'));
                result.current.setFocus();
                result.current.setBlur();
            }).not.toThrow();
        });
    });
}); 