import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useNumber } from "../useNumber";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useNumber", () => {
    test("should initialize with default values", () => {
        const { result } = renderHook(() => useNumber(5));
        
        expect(result.current.value).toBe(5);
        expect(result.current.isAtMin).toBe(false);
        expect(result.current.isAtMax).toBe(false);
        expect(result.current.delta).toBe(0);
        expect(result.current.isChanging).toBe(false);
    });

    test("should handle min/max constraints", () => {
        const { result } = renderHook(() => useNumber(5, { min: 0, max: 10 }));
        
        act(() => {
            result.current.decrease(10);
        });
        expect(result.current.value).toBe(0);
        expect(result.current.isAtMin).toBe(true);
        
        act(() => {
            result.current.increase(20);
        });
        expect(result.current.value).toBe(10);
        expect(result.current.isAtMax).toBe(true);
    });

    test("should handle loop behavior", () => {
        const { result } = renderHook(() => 
            useNumber(5, { min: 0, max: 10, loop: true })
        );
        
        act(() => {
            result.current.increase(10);
        });
        expect(result.current.value).toBe(0);
        
        act(() => {
            result.current.decrease(5);
        });
        expect(result.current.value).toBe(10);
    });

    test("should handle floating point numbers", () => {
        const { result } = renderHook(() => 
            useNumber(5.5, { float: true, precision: 1 })
        );
        
        expect(result.current.value).toBe(5.5);
        
        act(() => {
            result.current.increase(0.1);
        });
        expect(result.current.value).toBe(5.6);
        
        act(() => {
            result.current.setValue(5.67);
        });
        expect(result.current.value).toBe(5.7);
    });

    test("should track delta from initial value", () => {
        const { result } = renderHook(() => useNumber(5));
        
        act(() => {
            result.current.increase(3);
        });
        expect(result.current.delta).toBe(3);
        
        act(() => {
            result.current.decrease(1);
        });
        expect(result.current.delta).toBe(2);
        
        act(() => {
            result.current.reset();
        });
        expect(result.current.delta).toBe(0);
    });

    test("should handle keyboard controls", () => {
        const { result } = renderHook(() => 
            useNumber(5, { enableKeyboardControls: true })
        );
        
        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        });
        expect(result.current.value).toBe(6);
        
        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        });
        expect(result.current.value).toBe(5);
    });

    test("should ignore keyboard controls when disabled", () => {
        const { result } = renderHook(() => 
            useNumber(5, { enableKeyboardControls: false })
        );
        
        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        });
        expect(result.current.value).toBe(5);
    });

    test("should handle callbacks", () => {
        let limitCount = 0;
        let lastChange = { value: 0, prev: 0 };
        
        const { result } = renderHook(() => useNumber(5, {
            min: 0,
            max: 10,
            onChange: (value, prev) => {
                lastChange = { value, prev };
            },
            onLimit: () => {
                limitCount++;
            }
        }));
        
        act(() => {
            result.current.increase(3);
        });
        expect(lastChange).toEqual({ value: 8, prev: 5 });
        
        act(() => {
            result.current.increase(5);
        });
        expect(result.current.value).toBe(10);
        expect(limitCount).toBe(1);
    });

    test("should handle custom step values", () => {
        const { result } = renderHook(() => useNumber(10, { step: 5 }));
        
        act(() => {
            result.current.increase();
        });
        expect(result.current.value).toBe(15);
        
        act(() => {
            result.current.decrease();
        });
        expect(result.current.value).toBe(10);
        
        act(() => {
            result.current.increase(2);
        });
        expect(result.current.value).toBe(12);
    });

    test("should handle isChanging state", async () => {
        const { result } = renderHook(() => useNumber(5));
        
        act(() => {
            result.current.increase();
        });
        expect(result.current.isChanging).toBe(true);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        expect(result.current.isChanging).toBe(false);
    });

    test("should cleanup timeouts on unmount", () => {
        const { result, unmount } = renderHook(() => useNumber(5));
        
        act(() => {
            result.current.increase();
        });
        
        unmount();
        // Should not throw errors when unmounting with active timeout
    });
}); 