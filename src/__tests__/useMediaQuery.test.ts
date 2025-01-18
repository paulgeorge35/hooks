import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useMediaQuery } from "../useMediaQuery";

beforeEach(async () => {
    GlobalRegistrator.register();
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for happy-dom to initialize
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useMediaQuery", () => {
    test("should initialize with correct match state", async () => {
        // Mock window.matchMedia
        const matchMediaMock = (query: string) => ({
            matches: query === "(min-width: 768px)",
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true
        } as MediaQueryList);
        window.matchMedia = matchMediaMock;

        // Test matching query
        const { result: matchResult } = renderHook(() => 
            useMediaQuery("(min-width: 768px)")
        );
        expect(matchResult.current).toBe(true);

        // Test non-matching query
        const { result: noMatchResult } = renderHook(() => 
            useMediaQuery("(min-width: 1200px)")
        );
        expect(noMatchResult.current).toBe(false);
    });

    test("should update when media query changes", async () => {
        const currentMatches = false;
        let eventCallback: ((event: MediaQueryListEvent) => void) | null = null;

        // Create a MediaQueryList mock
        const mediaQueryList = {
            matches: currentMatches,
            media: "(min-width: 768px)",
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener(type: string, callback: (event: MediaQueryListEvent) => void) {
                eventCallback = callback;
            },
            removeEventListener: () => {},
            dispatchEvent: () => true
        } as MediaQueryList;

        window.matchMedia = () => mediaQueryList;

        const { result, rerender } = renderHook(() => useMediaQuery("(min-width: 768px)"));
        expect(result.current).toBe(false);

        // Simulate media query match changes
        if (eventCallback) {
            // Update the mediaQueryList.matches value
            Object.defineProperty(mediaQueryList, 'matches', {
                get: () => true
            });

            // Trigger the event
            // @ts-ignore
            eventCallback({
                matches: true,
                media: "(min-width: 768px)",
                type: 'change'
            } as MediaQueryListEvent);

            // Force a rerender to see the changes
            rerender();
            expect(result.current).toBe(true);

            // Test non-matching state
            Object.defineProperty(mediaQueryList, 'matches', {
                get: () => false
            });

            // @ts-ignore
            eventCallback({
                matches: false,
                media: "(min-width: 768px)",
                type: 'change'
            } as MediaQueryListEvent);

            rerender();
            expect(result.current).toBe(false);
        }
    });

    test("should handle multiple queries", async () => {
        const queries: Record<string, boolean> = {
            "(min-width: 768px)": true,
            "(max-width: 1200px)": false,
            "(orientation: portrait)": true
        };

        // Mock window.matchMedia
        const matchMediaMock = (query: string) => ({
            matches: queries[query] || false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true
        } as MediaQueryList);
        window.matchMedia = matchMediaMock;

        // Test multiple queries simultaneously
        const { result: result1 } = renderHook(() => 
            useMediaQuery("(min-width: 768px)")
        );
        const { result: result2 } = renderHook(() => 
            useMediaQuery("(max-width: 1200px)")
        );
        const { result: result3 } = renderHook(() => 
            useMediaQuery("(orientation: portrait)")
        );

        expect(result1.current).toBe(true);
        expect(result2.current).toBe(false);
        expect(result3.current).toBe(true);
    });

    test("should cleanup event listeners on unmount", async () => {
        let removeEventListenerCalled = false;
        
        // Mock window.matchMedia with event handling tracking
        const matchMediaMock = (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {
                removeEventListenerCalled = true;
            },
            dispatchEvent: () => true
        } as MediaQueryList);
        window.matchMedia = matchMediaMock;

        const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));
        
        // Unmount the hook
        unmount();
        
        // Verify cleanup
        expect(removeEventListenerCalled).toBe(true);
    });

    test("should handle invalid queries gracefully", async () => {
        // Mock console.warn to prevent test output noise
        const originalWarn = console.warn;
        console.warn = () => {};

        // Mock window.matchMedia to throw for invalid queries
        const matchMediaMock = (query: string) => {
            if (query === "invalid-query") {
                return {
                    matches: false,
                    media: query,
                    onchange: null,
                    addListener: () => {},
                    removeListener: () => {},
                    addEventListener: () => {},
                    removeEventListener: () => {},
                    dispatchEvent: () => true
                } as MediaQueryList;
            }
            return {
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => true
            } as MediaQueryList;
        };
        window.matchMedia = matchMediaMock;

        // Should handle invalid query gracefully
        const { result } = renderHook(() => useMediaQuery("invalid-query"));
        expect(result.current).toBe(false);

        // Restore console.warn
        console.warn = originalWarn;
    });

    test("should handle common media query patterns", async () => {
        const mediaQueries: Record<string, boolean> = {
            // Breakpoints
            "(min-width: 640px)": true,  // Small
            "(min-width: 768px)": true,  // Medium
            "(min-width: 1024px)": false, // Large
            "(min-width: 1280px)": false, // XL

            // Orientation
            "(orientation: portrait)": true,
            "(orientation: landscape)": false,

            // Display features
            "(display-mode: fullscreen)": false,
            "(prefers-color-scheme: dark)": true,
            "(prefers-reduced-motion: reduce)": false,

            // Device characteristics
            "(hover: hover)": true,
            "(pointer: fine)": true
        };

        // Mock window.matchMedia
        const matchMediaMock = (query: string) => ({
            matches: mediaQueries[query] ?? false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true
        } as MediaQueryList);
        window.matchMedia = matchMediaMock;

        // Test each media query
        for (const [query, expectedMatch] of Object.entries(mediaQueries)) {
            const { result } = renderHook(() => useMediaQuery(query));
            expect(result.current).toBe(expectedMatch);
        }
    });
}); 