import { useCallback, useEffect, useRef, useState } from "react";

export type WebSocketStatus = 'connected' | 'disconnected' | 'connecting' | 'reconnecting';

export type WebSocketError = {
    type: 'connection' | 'message' | 'send';
    message: string;
    originalError: unknown;
    timestamp: number;
};

/**
 * Return type for the useWebSocket hook
 * @template T The type of messages being sent/received through the WebSocket
 */
export type UseWebSocket<T> = {
    /** Send a message through the WebSocket */
    send: (message: T) => void;
    /** Array of messages received through the WebSocket */
    messages: ReadonlyArray<T>;
    /** Current connection status of the WebSocket */
    status: WebSocketStatus;
    /** Manually initiate a connection */
    connect: () => void;
    /** Manually disconnect the WebSocket */
    disconnect: () => void;
    /** Clear the message history */
    clearMessages: () => void;
    /** Most recent error that occurred, if any */
    lastError: WebSocketError | null;
    /** Whether the WebSocket is currently attempting to reconnect */
    isReconnecting: boolean;
    /** Number of reconnection attempts made */
    reconnectAttempts: number;
};

/**
 * Configuration options for the useWebSocket hook
 * @template T The type of messages being sent/received
 */
export type UseWebSocketProps<T> = {
    /** The WebSocket endpoint URL */
    url: string;
    /** Optional configuration options */
    options?: {
        /** Whether to automatically attempt reconnection on disconnect */
        reconnect?: boolean;
        /** Interval in milliseconds between reconnection attempts */
        reconnectInterval?: number;
        /** Maximum number of reconnection attempts */
        maxRetries?: number;
        /** Callback fired when the connection is established */
        onOpen?: () => void;
        /** Callback fired when a message is received */
        onMessage?: (message: T) => void;
        /** Callback fired when an error occurs */
        onError?: (error: WebSocketError) => void;
        /** Callback fired when the connection is closed */
        onClose?: () => void;
        /** Whether to automatically connect when the hook is initialized */
        autoConnect?: boolean;
        /** Custom message parser */
        parseMessage?: (data: string) => T;
    };
};

/**
 * A React hook for managing WebSocket connections with automatic reconnection and error handling
 * 
 * @template T The type of messages being sent/received through the WebSocket
 * @param {UseWebSocketProps<T>} props The hook configuration
 * @returns {UseWebSocket<T>} WebSocket controls and state
 * 
 * @example
 * ```typescript
 * const {
 *   send,
 *   messages,
 *   status,
 *   connect,
 *   disconnect,
 *   clearMessages,
 *   lastError,
 *   isReconnecting,
 *   reconnectAttempts
 * } = useWebSocket<MessageType>({
 *   url: 'ws://example.com',
 *   options: {
 *     autoConnect: true,
 *     reconnect: true,
 *     onMessage: (msg) => console.log('New message:', msg),
 *     parseMessage: (data) => JSON.parse(data) as MessageType
 *   }
 * });
 * ```
 */
export const useWebSocket = <T>({
    url,
    options = {},
}: UseWebSocketProps<T>): UseWebSocket<T> => {
    // Extract options with defaults
    const {
        reconnect = true,
        reconnectInterval = 5000,
        maxRetries = 5,
        onOpen,
        onMessage,
        onError,
        onClose,
        autoConnect = false,
        parseMessage = (data: string) => JSON.parse(data) as T,
    } = options;

    // State management
    const [messages, setMessages] = useState<ReadonlyArray<T>>([]);
    const [status, setStatus] = useState<WebSocketStatus>(
        autoConnect ? 'connecting' : 'disconnected'
    );
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [lastError, setLastError] = useState<WebSocketError | null>(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    
    // Refs for managing reconnection without causing re-renders
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = useRef(true);
    const statusRef = useRef(status);

    // Update status ref when status changes
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    // Utility function to clear message history
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    // Create error object helper
    const createError = useCallback((type: WebSocketError['type'], message: string, originalError: unknown): WebSocketError => ({
        type,
        message,
        originalError,
        timestamp: Date.now(),
    }), []);

    // Cleanup function to reset connection state
    const cleanup = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (socket) {
            socket.close();
            setSocket(null);
        }
        setReconnectAttempts(0);
        setStatus('disconnected');
        onClose?.();
    }, [socket, onClose]);

    // Initialize a new WebSocket connection
    const connect = useCallback(() => {
        if (statusRef.current === 'connecting' || statusRef.current === 'reconnecting') {
            return;
        }

        cleanup();
        setStatus('connecting');
        
        try {
            const newSocket = new WebSocket(url);
            setSocket(newSocket);
        } catch (error) {
            const wsError = createError(
                'connection',
                `Failed to create WebSocket connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error
            );
            setLastError(wsError);
            setStatus('disconnected');
            onError?.(wsError);
        }
    }, [url, onError, cleanup, createError]);

    // Handle successful connection
    const handleOpen = useCallback(() => {
        if (!mountedRef.current) return;
        
        setReconnectAttempts(0);
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        setStatus('connected');
        setLastError(null);
        onOpen?.();
    }, [onOpen]);

    // Handle incoming messages
    const handleMessage = useCallback((event: MessageEvent) => {
        if (!mountedRef.current) return;

        try {
            const message = parseMessage(event.data);
            setMessages(prev => [...prev, message]);
            onMessage?.(message);
        } catch (error) {
            const wsError = createError(
                'message',
                `Failed to parse message: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error
            );
            setLastError(wsError);
            onError?.(wsError);
        }
    }, [onMessage, onError, parseMessage, createError]);

    // Handle WebSocket errors
    const handleError = useCallback((event: Event) => {
        if (!mountedRef.current) return;

        const error = createError(
            'connection',
            event instanceof ErrorEvent ? event.message : 'WebSocket error occurred',
            event
        );

        if (statusRef.current !== 'reconnecting') {
            setStatus('disconnected');
            setLastError(error);
            onError?.(error);
        }
    }, [onError, createError]);

    // Handle connection closure and reconnection
    const handleClose = useCallback(() => {
        if (!mountedRef.current) return;

        // Only update status if we're not already reconnecting
        if (statusRef.current !== 'reconnecting') {
            setStatus('disconnected');
            onClose?.();
        }

        // Attempt reconnection if enabled and within retry limits
        if (reconnect && reconnectAttempts < maxRetries) {
            // Don't set status to reconnecting if we're already in that state
            if (statusRef.current !== 'reconnecting') {
                setStatus('reconnecting');
            }
            
            reconnectTimerRef.current = setTimeout(() => {
                if (mountedRef.current) {
                    setReconnectAttempts(prev => prev + 1);
                    connect();
                }
            }, reconnectInterval);
        }
    }, [reconnect, maxRetries, reconnectInterval, connect, onClose, reconnectAttempts]);

    // Set up initial connection
    useEffect(() => {
        mountedRef.current = true;
        
        if (autoConnect) {
            connect();
        }

        return () => {
            mountedRef.current = false;
            cleanup();
        };
    }, [autoConnect, connect, cleanup]);

    // Set up WebSocket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.addEventListener('open', handleOpen);
        socket.addEventListener('message', handleMessage);
        socket.addEventListener('error', handleError);
        socket.addEventListener('close', handleClose);

        return () => {
            socket.removeEventListener('open', handleOpen);
            socket.removeEventListener('message', handleMessage);
            socket.removeEventListener('error', handleError);
            socket.removeEventListener('close', handleClose);
        };
    }, [socket, handleOpen, handleMessage, handleError, handleClose]);

    const send = useCallback((message: T) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            const error = createError(
                'send',
                'WebSocket is not connected',
                new Error('Socket not ready')
            );
            setLastError(error);
            onError?.(error);
            return;
        }

        try {
            socket.send(JSON.stringify(message));
        } catch (error) {
            const wsError = createError(
                'send',
                `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error
            );
            setLastError(wsError);
            onError?.(wsError);
        }
    }, [socket, onError, createError]);

    return {
        send,
        messages,
        status,
        connect,
        disconnect: cleanup,
        clearMessages,
        lastError,
        isReconnecting: status === 'reconnecting',
        reconnectAttempts,
    };
};