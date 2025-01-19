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
    test("should initialize with ref", async () => {
        const { result } = renderHook(() => useClickOutside({}));
        expect(result.current).toBeDefined();
        expect(result.current.current).toBeNull();
    });

    test("should call callback when clicking outside", async () => {
        const callback = mock(() => {});
        const { result } = renderHook(() => useClickOutside({ callback }));
        
        // Create both inside and outside elements to properly test the click
        const insideElement = document.createElement('div');
        const outsideElement = document.createElement('div');
        document.body.appendChild(insideElement);
        document.body.appendChild(outsideElement);
        
        result.current.current = insideElement;
        
        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Simulate click outside
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(clickEvent);
        
        // Wait for event handling
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(callback).toHaveBeenCalled();
        
        // Cleanup
        document.body.removeChild(insideElement);
        document.body.removeChild(outsideElement);
    });

    test("should not call callback when clicking inside", async () => {
        const callback = mock(() => {});
        const { result } = renderHook(() => useClickOutside({ callback }));
        
        // Create a div element and set it as the ref's current
        const insideElement = document.createElement('div');
        document.body.appendChild(insideElement);
        result.current.current = insideElement;
        
        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Simulate click inside
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        insideElement.dispatchEvent(clickEvent);
        
        // Wait for event handling
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(callback).not.toHaveBeenCalled();
        
        document.body.removeChild(insideElement);
    });

    test("should work without callback", async () => {
        const { result } = renderHook(() => useClickOutside({}));
        
        // Create a div element that's not the ref
        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);
        
        // Simulate click outside
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        expect(() => {
            document.dispatchEvent(clickEvent);
        }).not.toThrow();
        
        document.body.removeChild(outsideElement);
    });

    test("should cleanup event listener on unmount", async () => {
        const removeEventListenerSpy = mock(document.removeEventListener);
        document.removeEventListener = removeEventListenerSpy;
        
        const { unmount } = renderHook(() => useClickOutside({}));
        unmount();
        
        expect(removeEventListenerSpy).toHaveBeenCalled();
        expect(removeEventListenerSpy.mock.calls[0][0]).toBe('click');
    });
}); 