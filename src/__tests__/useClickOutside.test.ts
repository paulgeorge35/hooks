import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { useClickOutside } from "../useClickOutside";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useClickOutside", () => {
    test("should initialize with refs", async () => {
        const callback = mock(() => {});
        const { result } = renderHook(() => useClickOutside(callback));
        expect(result.current).toBeDefined();
        expect(result.current.ref.current).toBeNull();
        expect(result.current.triggerRef.current).toBeNull();
    });

    test("should call callback when clicking outside", async () => {
        const callback = mock(() => {});
        const { result } = renderHook(() => useClickOutside(callback));

        // Create and append test elements
        const container = document.createElement('div');
        const element = document.createElement('div');
        const trigger = document.createElement('button');
        container.appendChild(element);
        container.appendChild(trigger);
        document.body.appendChild(container);

        // Set refs
        Object.defineProperty(result.current.ref, 'current', { value: element });
        Object.defineProperty(result.current.triggerRef, 'current', { value: trigger });

        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));

        // Simulate click outside
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        });
        container.dispatchEvent(clickEvent);

        // Wait for event handling
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(callback).toHaveBeenCalled();

        // Cleanup
        document.body.removeChild(container);
    });

    test("should not call callback when clicking inside", async () => {
        const callback = mock(() => {});
        const { result } = renderHook(() => useClickOutside(callback));

        // Create and append test elements
        const container = document.createElement('div');
        const element = document.createElement('div');
        const trigger = document.createElement('button');
        container.appendChild(element);
        container.appendChild(trigger);
        document.body.appendChild(container);

        // Set refs
        Object.defineProperty(result.current.ref, 'current', { value: element });
        Object.defineProperty(result.current.triggerRef, 'current', { value: trigger });

        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));

        // Simulate click inside
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        });
        element.dispatchEvent(clickEvent);

        // Wait for event handling
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(callback).not.toHaveBeenCalled();

        // Cleanup
        document.body.removeChild(container);
    });

    test("should not call callback when clicking trigger", async () => {
        const callback = mock(() => {});
        const { result } = renderHook(() => useClickOutside(callback));

        // Create and append test elements
        const container = document.createElement('div');
        const element = document.createElement('div');
        const trigger = document.createElement('button');
        container.appendChild(element);
        container.appendChild(trigger);
        document.body.appendChild(container);

        // Set refs
        Object.defineProperty(result.current.ref, 'current', { value: element });
        Object.defineProperty(result.current.triggerRef, 'current', { value: trigger });

        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));

        // Simulate click on trigger
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        });
        trigger.dispatchEvent(clickEvent);

        // Wait for event handling
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(callback).not.toHaveBeenCalled();

        // Cleanup
        document.body.removeChild(container);
    });

    test("should cleanup event listeners on unmount", async () => {
        const abortSpy = mock(() => {});
        const originalAbortController = globalThis.AbortController;
        class MockAbortController implements AbortController {
            readonly signal: AbortSignal = new EventTarget() as AbortSignal;
            abort = abortSpy;
        }
        globalThis.AbortController = MockAbortController;

        const callback = mock(() => {});
        const { unmount } = renderHook(() => useClickOutside(callback));

        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));

        unmount();

        // Wait for cleanup
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(abortSpy).toHaveBeenCalled();
        globalThis.AbortController = originalAbortController;
    });
}); 