import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { useFocus } from "../useFocus";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useFocus", () => {
    let element: HTMLInputElement;
    let onFocus: ReturnType<typeof mock>;
    let onBlur: ReturnType<typeof mock>;

    beforeEach(() => {
        element = document.createElement('input');
        document.body.appendChild(element);
        onFocus = mock();
        onBlur = mock();
    });

    afterEach(() => {
        element.remove();
        onFocus.mockReset();
        onBlur.mockReset();
    });

    test("should initialize with unfocused state", () => {
        const { result } = renderHook(() => useFocus({ onFocus, onBlur }));
        const [ref, isFocused] = result.current;

        expect(ref.current).toBe(null);
        expect(isFocused).toBe(false);
    });

    test("should initialize with defined state", () => {
        const { result } = renderHook(() => useFocus({ onFocus, onBlur }));
        const [ref] = result.current;
        act(() => {
            ref.current = element;
        });
        expect(ref).toBeDefined();
    });
});