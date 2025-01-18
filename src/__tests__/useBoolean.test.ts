import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useBoolean } from "../useBoolean";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useBoolean", () => {
    test("should initialize with default value (false)", async () => {
        const { result } = renderHook(() => useBoolean());
        expect(result.current.value).toBe(false);
    });

    test("should initialize with provided value", async () => {
        const { result: resultTrue } = renderHook(() => useBoolean(true));
        expect(resultTrue.current.value).toBe(true);
    });

    test("should toggle value correctly", async () => {
        const { result } = renderHook(() => useBoolean(false));

        expect(result.current.value).toBe(false);

        result.current.toggle();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(true);

        result.current.toggle();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(false);
    });

    test("should set to true/false explicitly", async () => {
        const { result } = renderHook(() => useBoolean(false));

        expect(result.current.value).toBe(false);

        result.current.setTrue();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(true);

        result.current.setFalse();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(false);

        result.current.setFalse();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(false);
    });

    test("should handle setValue directly", async () => {
        const { result } = renderHook(() => useBoolean(false));

        expect(result.current.value).toBe(false);

        result.current.setValue(true);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(true);

        result.current.setValue(prev => !prev);
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(result.current.value).toBe(false);
    });
});