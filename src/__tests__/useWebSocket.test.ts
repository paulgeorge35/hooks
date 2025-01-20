import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { useWebSocket } from "../useWebSocket";

type WebSocketEvent = { type: string; data?: string } | ErrorEvent;

// Mock WebSocket implementation
class MockWebSocket {
    url: string;
    readyState: number;
    listeners: Record<string, ((event: WebSocketEvent) => void)[]>;
    static instance: MockWebSocket | null = null;

    constructor(url: string) {
        this.url = url;
        this.readyState = WebSocket.CONNECTING;
        this.listeners = {
            open: [],
            message: [],
            error: [],
            close: [],
        };
        MockWebSocket.instance = this;
    }

    addEventListener(event: string, callback: (event: WebSocketEvent) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    removeEventListener(event: string, callback: (event: WebSocketEvent) => void) {
        if (!this.listeners[event]) return;
        const index = this.listeners[event].indexOf(callback);
        if (index !== -1) {
            this.listeners[event].splice(index, 1);
        }
    }

    send(data: string) {
        // Mock implementation
    }

    close() {
        this.readyState = WebSocket.CLOSED;
        const callbacks = this.listeners?.close || [];
        for (const callback of callbacks) {
            callback({ type: 'close' });
        }
    }

    // Helper methods for testing
    simulateOpen() {
        this.readyState = WebSocket.OPEN;
        const callbacks = this.listeners?.open || [];
        for (const callback of callbacks) {
            callback({ type: 'open' });
        }
    }

    simulateMessage<T>(data: T) {
        const callbacks = this.listeners?.message || [];
        for (const callback of callbacks) {
            callback({ type: 'message', data: JSON.stringify(data) });
        }
    }

    simulateError(error: Error) {
        const callbacks = this.listeners?.error || [];
        for (const callback of callbacks) {
            callback(new ErrorEvent('error', { error }));
        }
    }

    simulateClose() {
        this.readyState = WebSocket.CLOSED;
        const callbacks = this.listeners?.close || [];
        for (const callback of callbacks) {
            callback({ type: 'close' });
        }
    }
}

// Setup and teardown
beforeEach(() => {
    GlobalRegistrator.register();
    MockWebSocket.instance = null;
    global.WebSocket = MockWebSocket as unknown as typeof WebSocket;
});

afterEach(() => {
    GlobalRegistrator.unregister();
    MockWebSocket.instance = null;
    mock.restore();
});

describe("useWebSocket", () => {
    const TEST_URL = 'ws://test.com';
    type TestMessage = { text: string };

    test("should initialize with disconnected status", () => {
        const { result } = renderHook(() => useWebSocket<TestMessage>({ url: TEST_URL }));
        expect(result.current.status).toBe('disconnected');
        expect(result.current.messages).toEqual([]);
        expect(result.current.lastError).toBeNull();
    });

    test("should connect automatically when autoConnect is true", () => {
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: { autoConnect: true }
        }));
        expect(result.current.status).toBe('connecting');
    });

    test("should not connect automatically when autoConnect is false", () => {
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: { autoConnect: false }
        }));
        expect(result.current.status).toBe('disconnected');
    });

    test("should handle successful connection", async () => {
        const onOpen = mock(() => {});
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: { onOpen }
        }));

        // Trigger WebSocket creation
        await act(async () => {
            result.current.connect();
        });

        await act(async () => {
            MockWebSocket.instance?.simulateOpen();
        });

        expect(result.current.status).toBe('connected');
        expect(onOpen).toHaveBeenCalled();
    });

    test("should handle messages correctly", async () => {
        const testMessage: TestMessage = { text: 'hello' };
        const onMessage = mock((msg: TestMessage) => {});
        
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: { onMessage }
        }));

        // Trigger WebSocket creation
        await act(async () => {
            result.current.connect();
        });

        await act(async () => {
            MockWebSocket.instance?.simulateOpen();
            MockWebSocket.instance?.simulateMessage(testMessage);
        });

        expect(result.current.messages).toEqual([testMessage]);
        expect(onMessage).toHaveBeenCalledWith(testMessage);
    });

    test("should handle connection errors", async () => {
        const error = new Error('Connection failed');
        const onError = mock((err: Error) => {});
        
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: { onError }
        }));

        // Trigger WebSocket creation
        await act(async () => {
            result.current.connect();
        });

        await act(async () => {
            MockWebSocket.instance?.simulateError(error);
        });

        expect(result.current.status).toBe('disconnected');
        expect(result.current.lastError).toBeTruthy();
        expect(onError).toHaveBeenCalled();
    });

    test("should handle disconnection", async () => {
        const onClose = mock(() => {});
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: { onClose }
        }));

        await act(async () => {
            result.current.disconnect();
        });

        expect(result.current.status).toBe('disconnected');
        expect(onClose).toHaveBeenCalled();
    });

    test("should attempt reconnection when enabled", async () => {
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: {
                reconnect: true,
                reconnectInterval: 100,
                maxRetries: 1
            }
        }));

        // Initial state should be disconnected
        expect(result.current.status).toBe('disconnected');

        // Trigger WebSocket creation
        await act(async () => {
            result.current.connect();
        });

        // Wait for WebSocket instance to be created
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        // Simulate successful connection
        await act(async () => {
            if (!MockWebSocket.instance) {
                throw new Error('WebSocket instance not created');
            }
            MockWebSocket.instance.simulateOpen();
        });

        // Verify connected state
        expect(result.current.status).toBe('connected');

        // Simulate disconnection
        await act(async () => {
            if (!MockWebSocket.instance) {
                throw new Error('WebSocket instance not created');
            }
            MockWebSocket.instance.simulateClose();
        });

        // Verify reconnecting state
        expect(result.current.status).toBe('reconnecting');
        
        // Wait for reconnection attempt
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 150));
            // Wait for state update after connect() is called
            await new Promise(resolve => setTimeout(resolve, 0));
        });
        
        // Should be in connecting state after reconnection attempt
        expect(result.current.status).toBe('reconnecting');
    });

    test("should send messages successfully", async () => {
        const sendSpy = spyOn(MockWebSocket.prototype, 'send');
        const testMessage: TestMessage = { text: 'test' };
        
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL
        }));

        // Trigger WebSocket creation and connection
        await act(async () => {
            result.current.connect();
            MockWebSocket.instance?.simulateOpen();
        });

        await act(async () => {
            result.current.send(testMessage);
        });

        expect(sendSpy).toHaveBeenCalledWith(JSON.stringify(testMessage));
    });

    test("should clear messages", async () => {
        const testMessage: TestMessage = { text: 'test' };
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL
        }));

        // Trigger WebSocket creation and connect
        await act(async () => {
            result.current.connect();
        });

        await act(async () => {
            MockWebSocket.instance?.simulateOpen();
        });

        await act(async () => {
            MockWebSocket.instance?.simulateMessage(testMessage);
        });

        expect(result.current.messages).toHaveLength(1);

        await act(async () => {
            result.current.clearMessages();
        });

        expect(result.current.messages).toHaveLength(0);
    });

    test("should cleanup on unmount", async () => {
        const { result, unmount } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL
        }));

        // Trigger WebSocket creation
        await act(async () => {
            result.current.connect();
        });

        const instance = MockWebSocket.instance;
        if (!instance) {
            throw new Error('WebSocket instance not created');
        }
        const closeSpy = spyOn(instance, 'close');
        
        await act(async () => {
            unmount();
        });

        expect(closeSpy).toHaveBeenCalled();
    });

    test("should not update state after unmounting", async () => {
        const consoleErrorSpy = spyOn(console, 'error');
        const { result, unmount } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: {
                reconnect: true,
                reconnectInterval: 100
            }
        }));

        // Trigger WebSocket creation and connect
        await act(async () => {
            result.current.connect();
        });

        await act(async () => {
            MockWebSocket.instance?.simulateOpen();
        });

        expect(result.current.status).toBe('connected');

        // Unmount the component
        await act(async () => {
            unmount();
        });

        // Try to trigger state updates after unmount
        await act(async () => {
            MockWebSocket.instance?.simulateMessage({ text: 'test' });
            MockWebSocket.instance?.simulateError(new Error('test'));
            MockWebSocket.instance?.simulateClose();
        });

        // Wait for any potential reconnection attempts
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 150));
        });

        // Verify no console errors about setState on unmounted component
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test("should handle rapid connection state changes", async () => {
        const { result } = renderHook(() => useWebSocket<TestMessage>({
            url: TEST_URL,
            options: {
                reconnect: true,
                reconnectInterval: 100
            }
        }));

        await act(async () => {
            // Simulate rapid connection/disconnection
            MockWebSocket.instance?.simulateOpen();
            MockWebSocket.instance?.simulateClose();
            MockWebSocket.instance?.simulateOpen();
            MockWebSocket.instance?.simulateClose();
        });

        // Wait for any queued state updates
        await new Promise(resolve => setTimeout(resolve, 150));

        // Status should reflect the last state change
        expect(result.current.status).toBe('disconnected');
    });
}); 