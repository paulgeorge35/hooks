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
        private callback: ResizeObserverCallback;
        private observing = false;

        constructor(callback: ResizeObserverCallback) {
            this.callback = callback;
            resizeCallback = (entries) => {
                if (this.observing) {
                    this.callback(entries, this);
                }
            };
        }

        observe(target: Element) {
            this.observing = true;
            // Initial callback with default dimensions
            if (this.callback) {
                const mockBoxSize = {
                    inlineSize: target.clientWidth,
                    blockSize: target.clientHeight
                };
                
                const entry = {
                    target,
                    contentRect: new DOMRectReadOnly(0, 0, target.clientWidth, target.clientHeight),
                    borderBoxSize: [mockBoxSize],
                    contentBoxSize: [mockBoxSize],
                    devicePixelContentBoxSize: []
                };
                
                this.callback([entry], this);
            }
        }

        unobserve() {
            this.observing = false;
        }

        disconnect() {
            this.observing = false;
        }
    };
});

afterEach(() => {
    GlobalRegistrator.unregister();
    resizeCallback = () => {};
});

describe("useResizeObserver", () => {
    test("should initialize with default options", () => {
        const { result } = renderHook(() => useResizeObserver());
        
        expect(result.current.dimensions).toEqual({
            width: 0,
            height: 0,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: []
        });
        expect(result.current.ref.current).toBeNull();
        expect(result.current.isObserving).toBe(true);
    });

    test("should initialize with custom options", () => {
        const { result } = renderHook(() => useResizeObserver({
            immediate: false,
            useBorderBox: true,
            debounceDelay: 100
        }));
        
        expect(result.current.isObserving).toBe(false);
    });

    test("should start observing when ref is set", async () => {
        const { result } = renderHook(() => useResizeObserver());

        // Create and setup test element
        const div = document.createElement('div');
        Object.defineProperties(div, {
            clientWidth: { value: 100, configurable: true },
            clientHeight: { value: 200, configurable: true }
        });

        // Set ref and start observing
        await act(async () => {
            Object.defineProperty(result.current.ref, 'current', {
                writable: true,
                value: div
            });
            result.current.startObserving();
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        expect(result.current.dimensions.width).toBe(100);
        expect(result.current.dimensions.height).toBe(200);
        expect(result.current.isObserving).toBe(true);
    });

    test("should handle resize events", async () => {
        let resizeCallCount = 0;
        const onResize = () => { resizeCallCount++; };
        const { result } = renderHook(() => useResizeObserver({ onResize }));

        // Create and setup test element
        const div = document.createElement('div');
        Object.defineProperties(div, {
            clientWidth: { value: 100, configurable: true },
            clientHeight: { value: 200, configurable: true }
        });

        // Set ref and start observing
        await act(async () => {
            Object.defineProperty(result.current.ref, 'current', {
                writable: true,
                value: div
            });
            result.current.startObserving();
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        // Trigger resize
        await act(async () => {
            const mockBoxSize = {
                inlineSize: 150,
                blockSize: 300
            };

            resizeCallback([{
                target: div,
                contentRect: new DOMRectReadOnly(0, 0, 150, 300),
                borderBoxSize: [mockBoxSize],
                contentBoxSize: [mockBoxSize],
                devicePixelContentBoxSize: []
            }], {} as ResizeObserver);

            await new Promise(resolve => setTimeout(resolve, 50));
        });

        expect(result.current.dimensions.width).toBe(150);
        expect(result.current.dimensions.height).toBe(300);
        expect(result.current.dimensions.borderBoxSize[0]).toEqual({
            inlineSize: 150,
            blockSize: 300
        });
        expect(resizeCallCount).toBeGreaterThan(0);
    });

    test("should handle border box measurements", async () => {
        const { result } = renderHook(() => useResizeObserver({ useBorderBox: true }));

        // Create and setup test element
        const div = document.createElement('div');
        Object.defineProperties(div, {
            clientWidth: { value: 100, configurable: true },
            clientHeight: { value: 200, configurable: true }
        });

        // Set ref and start observing
        await act(async () => {
            Object.defineProperty(result.current.ref, 'current', {
                writable: true,
                value: div
            });
            result.current.startObserving();
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        // Trigger resize with different border box size
        await act(async () => {
            const mockBoxSize = {
                inlineSize: 120,
                blockSize: 220
            };

            resizeCallback([{
                target: div,
                contentRect: new DOMRectReadOnly(0, 0, 100, 200),
                borderBoxSize: [mockBoxSize],
                contentBoxSize: [{
                    inlineSize: 100,
                    blockSize: 200
                }],
                devicePixelContentBoxSize: []
            }], {} as ResizeObserver);

            await new Promise(resolve => setTimeout(resolve, 50));
        });

        // Should use border box dimensions
        expect(result.current.dimensions.width).toBe(120);
        expect(result.current.dimensions.height).toBe(220);
    });

    test("should handle cleanup", async () => {
        let disconnectCalled = false;
        const originalResizeObserver = window.ResizeObserver;
        
        window.ResizeObserver = class ResizeObserver {
            private callback: ResizeObserverCallback;
            private observing = false;

            constructor(callback: ResizeObserverCallback) {
                this.callback = callback;
                resizeCallback = (entries) => {
                    if (this.observing) {
                        this.callback(entries, this);
                    }
                };
            }

            observe(target: Element) {
                this.observing = true;
            }

            unobserve() {
                this.observing = false;
            }

            disconnect() {
                this.observing = false;
                disconnectCalled = true;
            }
        };

        const { result, unmount } = renderHook(() => useResizeObserver());

        // Create and setup test element
        const div = document.createElement('div');
        Object.defineProperties(div, {
            clientWidth: { value: 100, configurable: true },
            clientHeight: { value: 200, configurable: true }
        });

        // Set ref and start observing
        await act(async () => {
            Object.defineProperty(result.current.ref, 'current', {
                writable: true,
                value: div
            });
            result.current.startObserving();
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        // Verify initial state
        expect(result.current.isObserving).toBe(true);

        // Unmount and wait for cleanup
        await act(async () => {
            unmount();
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        expect(disconnectCalled).toBe(true);

        window.ResizeObserver = originalResizeObserver;
    });

    test("should handle debounced updates", async () => {
        const { result } = renderHook(() => useResizeObserver({ debounceDelay: 100 }));

        // Create and setup test element
        const div = document.createElement('div');
        Object.defineProperties(div, {
            clientWidth: { value: 100, configurable: true },
            clientHeight: { value: 200, configurable: true }
        });

        // Set ref and start observing
        await act(async () => {
            Object.defineProperty(result.current.ref, 'current', {
                writable: true,
                value: div
            });
            result.current.startObserving();
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        // Trigger multiple rapid resizes
        await act(async () => {
            for (let i = 0; i < 5; i++) {
                const size = 100 + i * 50;
                const mockBoxSize = {
                    inlineSize: size,
                    blockSize: size
                };

                resizeCallback([{
                    target: div,
                    contentRect: new DOMRectReadOnly(0, 0, size, size),
                    borderBoxSize: [mockBoxSize],
                    contentBoxSize: [mockBoxSize],
                    devicePixelContentBoxSize: []
                }], {} as ResizeObserver);
            }

            // Wait for debounce
            await new Promise(resolve => setTimeout(resolve, 150));
        });

        // Should have final dimensions
        expect(result.current.dimensions.width).toBe(300); // 100 + 4 * 50
        expect(result.current.dimensions.height).toBe(300);
    });
});