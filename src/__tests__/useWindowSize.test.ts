import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useWindowSize } from "../useWindowSize";

beforeEach(async () => {
    GlobalRegistrator.register();
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for happy-dom to initialize
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useWindowSize", () => {
    test("should initialize with current window dimensions", () => {
        // Mock initial window dimensions
        Object.defineProperties(window, {
            innerWidth: { value: 1024 },
            innerHeight: { value: 768 }
        });

        const { result } = renderHook(() => useWindowSize());

        expect(result.current.width).toBe(1024);
        expect(result.current.height).toBe(768);
    });

    test("should update on window resize", () => {
        // Set initial dimensions
        Object.defineProperties(window, {
            innerWidth: { value: 1024 },
            innerHeight: { value: 768 }
        });

        const { result } = renderHook(() => useWindowSize());

        // Initial size check
        expect(result.current.width).toBe(1024);
        expect(result.current.height).toBe(768);

        // Update window dimensions
        act(() => {
            Object.defineProperties(window, {
                innerWidth: { value: 1440 },
                innerHeight: { value: 900 }
            });

            // Dispatch resize event
            window.dispatchEvent(new Event('resize'));
        });

        // Check updated dimensions
        expect(result.current.width).toBe(1440);
        expect(result.current.height).toBe(900);
    });

    test("should handle multiple resize events", () => {
        // Set initial dimensions
        Object.defineProperties(window, {
            innerWidth: { value: 1024 },
            innerHeight: { value: 768 }
        });

        const { result } = renderHook(() => useWindowSize());

        // Sequence of resize events
        const dimensions = [
            { width: 800, height: 600 },
            { width: 1920, height: 1080 },
            { width: 375, height: 667 }  // iPhone SE
        ];

        for (const { width, height } of dimensions) {
            act(() => {
                Object.defineProperties(window, {
                    innerWidth: { value: width },
                    innerHeight: { value: height }
                });
                window.dispatchEvent(new Event('resize'));
            });

            expect(result.current.width).toBe(width);
            expect(result.current.height).toBe(height);
        }
    });

    test("should handle rapid resize events", () => {
        // Set initial dimensions
        Object.defineProperties(window, {
            innerWidth: { value: 1024 },
            innerHeight: { value: 768 }
        });

        const { result } = renderHook(() => useWindowSize());

        // Simulate rapid resize events
        for (let i = 0; i < 10; i++) {
            act(() => {
                Object.defineProperties(window, {
                    innerWidth: { value: 1024 + i * 100 },
                    innerHeight: { value: 768 + i * 50 }
                });
                window.dispatchEvent(new Event('resize'));
            });
        }

        // Should have the final dimensions
        expect(result.current.width).toBe(1924);  // 1024 + 900
        expect(result.current.height).toBe(1218); // 768 + 450
    });

    test("should cleanup event listener on unmount", () => {
        // Mock removeEventListener to track cleanup
        const originalRemoveEventListener = window.removeEventListener;
        let cleanupCalled = false;
        
        // Override removeEventListener with type-safe mock
        const mockRemoveEventListener: typeof window.removeEventListener = (event, handler, options) => {
            if (event === 'resize') {
                cleanupCalled = true;
            }
            originalRemoveEventListener.call(window, event, handler, options);
        };
        window.removeEventListener = mockRemoveEventListener;

        // Set initial dimensions
        Object.defineProperties(window, {
            innerWidth: { value: 1024 },
            innerHeight: { value: 768 }
        });

        const { unmount } = renderHook(() => useWindowSize());

        // Unmount the hook
        unmount();

        // Verify cleanup
        expect(cleanupCalled).toBe(true);

        // Restore original removeEventListener
        window.removeEventListener = originalRemoveEventListener;
    });

    test("should handle extreme dimensions", () => {
        const extremeDimensions = [
            { width: 320, height: 480 },    // Small mobile
            { width: 3840, height: 2160 },  // 4K
            { width: 7680, height: 4320 },  // 8K
            { width: 0, height: 0 },        // Minimized
        ];

        for (const { width, height } of extremeDimensions) {
            // Set dimensions
            Object.defineProperties(window, {
                innerWidth: { value: width },
                innerHeight: { value: height }
            });

            const { result } = renderHook(() => useWindowSize());

            expect(result.current.width).toBe(width);
            expect(result.current.height).toBe(height);
        }
    });

    test("should handle window being undefined", () => {
        // Save original values
        const originalInnerWidth = window.innerWidth;
        const originalInnerHeight = window.innerHeight;
        const originalAddEventListener = window.addEventListener;
        const originalRemoveEventListener = window.removeEventListener;

        // Mock window properties
        Object.defineProperties(window, {
            innerWidth: { value: 0, configurable: true },
            innerHeight: { value: 0, configurable: true },
            addEventListener: { value: () => {}, configurable: true },
            removeEventListener: { value: () => {}, configurable: true }
        });

        const { result } = renderHook(() => useWindowSize());

        // Should return default dimensions
        expect(result.current.width).toBe(0);
        expect(result.current.height).toBe(0);

        // Restore original values
        Object.defineProperties(window, {
            innerWidth: { value: originalInnerWidth, configurable: true },
            innerHeight: { value: originalInnerHeight, configurable: true },
            addEventListener: { value: originalAddEventListener, configurable: true },
            removeEventListener: { value: originalRemoveEventListener, configurable: true }
        });
    });
}); 