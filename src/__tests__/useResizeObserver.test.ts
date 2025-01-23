import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useResizeObserver } from "../useResizeObserver";

interface ResizeObserverEntry {
    target: Element;
    contentRect: DOMRectReadOnly;
    borderBoxSize: ReadonlyArray<ResizeObserverSize>;
    contentBoxSize: ReadonlyArray<ResizeObserverSize>;
    devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
}

interface ResizeObserverSize {
    blockSize: number;
    inlineSize: number;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

let resizeCallback: ResizeObserverCallback;

beforeEach(() => {
    GlobalRegistrator.register();
    // Mock ResizeObserver
    window.ResizeObserver = class ResizeObserver {
        constructor(callback: ResizeObserverCallback) {
            resizeCallback = callback;
        }

        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useResizeObserver", () => {
    test("should initialize with default dimensions", () => {
        const { result } = renderHook(() => useResizeObserver());
        
        expect(result.current.dimensions).toEqual({ width: 0, height: 0 });
        expect(result.current.ref.current).toBeNull();
    });

    test("should update dimensions when element resizes", async () => {
        const { result } = renderHook(() => useResizeObserver());

        // Create and append a div element
        const div = document.createElement('div');
        document.body.appendChild(div);

        // Set the ref
        result.current.ref.current = div;

        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));

        // Trigger resize callback
        act(() => {
            resizeCallback([{
                target: div,
                contentRect: { width: 100, height: 200 } as DOMRectReadOnly,
                borderBoxSize: [],
                contentBoxSize: [],
                devicePixelContentBoxSize: []
            }], {} as ResizeObserver);
        });

        // Check if dimensions were updated
        expect(result.current.dimensions).toEqual({ width: 100, height: 200 });

        // Cleanup
        document.body.removeChild(div);
    });

    test("should handle null ref", async () => {
        const { result } = renderHook(() => useResizeObserver());

        // Initial state with null ref
        expect(result.current.dimensions).toEqual({ width: 0, height: 0 });
        expect(result.current.ref.current).toBeNull();

        // Wait to ensure no errors occur with null ref
        await new Promise(resolve => setTimeout(resolve, 100));

        // State should remain unchanged
        expect(result.current.dimensions).toEqual({ width: 0, height: 0 });
    });

    test("should cleanup observer on unmount", async () => {
        let disconnectCalled = false;
        const originalResizeObserver = window.ResizeObserver;
        window.ResizeObserver = class ResizeObserver {
            constructor(callback: ResizeObserverCallback) {
                resizeCallback = callback;
            }
            observe() {}
            unobserve() { }
            disconnect() { disconnectCalled = true}
        };

        const { result, unmount } = renderHook(() => useResizeObserver());

        // Create and append a div element
        const div = document.createElement('div');
        document.body.appendChild(div);

        // Set the ref
        result.current.ref.current = div;

        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));

        // Unmount the hook
        unmount();

        // Verify that disconnect was called
        expect(disconnectCalled).toBe(true);

        // Cleanup
        document.body.removeChild(div);
        window.ResizeObserver = originalResizeObserver;
    });

    test("should handle multiple resize events", async () => {
        const { result } = renderHook(() => useResizeObserver());

        // Create and append a div element
        const div = document.createElement('div');
        document.body.appendChild(div);

        // Set the ref
        result.current.ref.current = div;

        // Wait for effect to be set up
        await new Promise(resolve => setTimeout(resolve, 0));

        // First resize event
        act(() => {
            resizeCallback([{
                target: div,
                contentRect: { width: 100, height: 200 } as DOMRectReadOnly,
                borderBoxSize: [],
                contentBoxSize: [],
                devicePixelContentBoxSize: []
            }], {} as ResizeObserver);
        });
        expect(result.current.dimensions).toEqual({ width: 100, height: 200 });

        // Second resize event
        act(() => {
            resizeCallback([{
                target: div,
                contentRect: { width: 150, height: 300 } as DOMRectReadOnly,
                borderBoxSize: [],
                contentBoxSize: [],
                devicePixelContentBoxSize: []
            }], {} as ResizeObserver);
        });
        expect(result.current.dimensions).toEqual({ width: 150, height: 300 });

        // Cleanup
        document.body.removeChild(div);
    });
});