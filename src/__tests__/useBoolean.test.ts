import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook, act } from '@testing-library/react';
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

        act(() => {
            result.current.toggle();
        });
        expect(result.current.value).toBe(true);

        act(() => {
            result.current.toggle();
        });
        expect(result.current.value).toBe(false);
    });

    test("should set to true/false explicitly", async () => {
        const { result } = renderHook(() => useBoolean(false));

        expect(result.current.value).toBe(false);

        act(() => {
            result.current.setTrue();
        });
        expect(result.current.value).toBe(true);

        act(() => {
            result.current.setFalse();
        });
        expect(result.current.value).toBe(false);

        act(() => {
            result.current.setFalse();
        });
        expect(result.current.value).toBe(false);
    });

    test("should handle setValue directly", async () => {
        const { result } = renderHook(() => useBoolean(false));

        expect(result.current.value).toBe(false);

        act(() => {
            result.current.setValue(true);
        });
        expect(result.current.value).toBe(true);

        act(() => {
            result.current.setValue(prev => !prev);
        });
        expect(result.current.value).toBe(false);
    });
});