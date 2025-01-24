import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { useCopyToClipboard } from "../useCopyToClipboard";

let mockClipboard: { writeText: ReturnType<typeof mock> };

beforeEach(() => {
    GlobalRegistrator.register();
    // Mock clipboard API
    mockClipboard = {
        writeText: mock(() => Promise.resolve())
    };
    Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
    });
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useCopyToClipboard", () => {
    test("should call callback when provided", async () => {
        const onSuccess = mock(() => {});
        const { result } = renderHook(() => useCopyToClipboard({ onSuccess }));

        await act(async () => {
            await result.current.copy("test");
        });

        expect(onSuccess).toHaveBeenCalled();
        expect(mockClipboard.writeText).toHaveBeenCalledWith("test");
    });

    test("should work without callback", async () => {
        const { result } = renderHook(() => useCopyToClipboard());

        await act(async () => {
            await result.current.copy("test");
        });

        expect(mockClipboard.writeText).toHaveBeenCalledWith("test");
    });

    test("should handle clipboard errors", async () => {
        // Mock clipboard failure
        mockClipboard.writeText = mock(() => Promise.reject(new Error("Clipboard error")));
        const { result } = renderHook(() => useCopyToClipboard());

        await act(async () => {
            await result.current.copy("test");
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.error?.message).toBe("Clipboard error");
    });

    test("should clear error on successful copy", async () => {
        const { result } = renderHook(() => useCopyToClipboard());

        // First fail
        mockClipboard.writeText = mock(() => Promise.reject(new Error("Clipboard error")));
        await act(async () => {
            await result.current.copy("test");
        });
        expect(result.current.error).toBeDefined();

        // Then succeed
        mockClipboard.writeText = mock(() => Promise.resolve());
        await act(async () => {
            await result.current.copy("test");
        });
        expect(result.current.error).toBeNull();
    });

    test("should track loading state", async () => {
        const { result } = renderHook(() => useCopyToClipboard());
        
        // Mock a delayed clipboard operation
        mockClipboard.writeText = mock(() => new Promise(resolve => setTimeout(resolve, 100)));
        
        let copyPromise: Promise<void>;
        act(() => {
            copyPromise = result.current.copy("test");
        });
        
        // Wait for React to update state
        await act(async () => {
            await Promise.resolve();
        });
        expect(result.current.isLoading).toBe(true);
        
        // Wait for the copy operation to complete
        await act(async () => {
            await copyPromise;
        });
        expect(result.current.isLoading).toBe(false);
    });
});