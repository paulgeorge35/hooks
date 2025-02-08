import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useVisibility } from "../useVisibility";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useVisibility", () => {
    test("should initialize with default options", () => {
        const { result } = renderHook(() => useVisibility());
        
        expect(result.current.isVisible).toBe(false);
        expect(result.current.isTracking).toBe(true);
        expect(result.current.ref.current).toBeNull();
    });

    test("should initialize with custom initial visibility", () => {
        const { result } = renderHook(() => useVisibility({ initial: true }));
        
        expect(result.current.isVisible).toBe(true);
        expect(result.current.isTracking).toBe(true);
    });
}); 