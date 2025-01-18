import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useNumber } from "../useNumber";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useNumber", () => {
    test("should initialize with provided value", async () => {
        const { result } = renderHook(() => useNumber(10));
        expect(result.current.value).toBe(10);
    });

    test("should respect min/max constraints on initialization", async () => {
        const { result: resultMin } = renderHook(() => useNumber(5, { min: 10 }));
        expect(resultMin.current.value).toBe(10);

        const { result: resultMax } = renderHook(() => useNumber(15, { max: 10 }));
        expect(resultMax.current.value).toBe(10);
    });

    test("should increase/decrease with default step", async () => {
        const { result } = renderHook(() => useNumber(10));

        result.current.increase();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(11);

        result.current.decrease();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(10);
    });

    test("should increase/decrease with custom step", async () => {
        const { result } = renderHook(() => useNumber(10, { step: 5 }));

        result.current.increase();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(15);

        result.current.decrease();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(10);
    });

    test("should increase/decrease with custom amount", async () => {
        const { result } = renderHook(() => useNumber(10));

        result.current.increase(3);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(13);

        result.current.decrease(2);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(11);
    });

    test("should respect min/max constraints when increasing/decreasing", async () => {
        const { result } = renderHook(() => useNumber(8, { min: 5, max: 10 }));

        result.current.increase(5);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(10);

        result.current.decrease(10);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(5);
    });

    test("should handle loop behavior", async () => {
        const { result } = renderHook(() => 
            useNumber(8, { min: 5, max: 10, loop: true })
        );

        result.current.increase(5);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(5);

        result.current.decrease(5);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(10);
    });

    test("should not loop when loop option is false", async () => {
        const { result } = renderHook(() => 
            useNumber(8, { min: 5, max: 10, loop: false })
        );

        result.current.increase(5);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(10);

        result.current.decrease(10);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(5);
    });

    test("should reset to initial value", async () => {
        const { result } = renderHook(() => useNumber(10));

        result.current.increase(5);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(15);

        result.current.reset();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(10);
    });

    test("should handle extreme values with min/max safe integers", async () => {
        const { result } = renderHook(() => useNumber(0));

        const hugeNumber = Number.MAX_SAFE_INTEGER - 1;
        result.current.increase(hugeNumber);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(hugeNumber);

        const hugeNegativeNumber = -Number.MAX_SAFE_INTEGER + 1;
        result.current.decrease(2 * hugeNumber);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(hugeNegativeNumber);
    });
}); 