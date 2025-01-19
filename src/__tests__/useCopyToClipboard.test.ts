import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { useCopyToClipboard } from "../useCopyToClipboard";

let mockWriteText: ReturnType<typeof mock>;

beforeEach(() => {
    GlobalRegistrator.register();
    mockWriteText = mock(() => Promise.resolve());
    
    // Mock clipboard API
    Object.defineProperty(window.navigator, 'clipboard', {
        value: {
            writeText: mockWriteText,
            readText: () => Promise.resolve(""),
        },
        configurable: true,
    });
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useCopyToClipboard", () => {
    test("should initialize with copy function", async () => {
        const { result } = renderHook(() => useCopyToClipboard({}));
        expect(typeof result.current.copy).toBe('function');
    });

    test("should call clipboard API when copying", async () => {
        const { result } = renderHook(() => useCopyToClipboard({}));
        const testText = "test text";
        
        result.current.copy(testText);
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(mockWriteText).toHaveBeenCalledWith(testText);
    });

    test("should call callback when provided", async () => {
        const callback = mock(() => {});
        const { result } = renderHook(() => useCopyToClipboard({ callback }));
        
        result.current.copy("test");
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(callback).toHaveBeenCalled();
    });

    test("should work without callback", async () => {
        const { result } = renderHook(() => useCopyToClipboard({}));
        
        expect(() => {
            result.current.copy("test");
        }).not.toThrow();
    });
});