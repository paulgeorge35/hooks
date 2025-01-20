import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Return type for the useWebSocket hook
 * @template T The type of messages being sent/received through the WebSocket
 */
export type UseWebSocket<T> = {
    /** Send a message through the WebSocket */
    send: (message: T) => void;
    /** Array of messages received through the WebSocket */
    messages: T[];
    /** Current connection status of the WebSocket */
    status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
    /** Manually initiate a connection */
    connect: () => void;
    /** Manually disconnect the WebSocket */
    disconnect: () => void;
    /** Clear the message history */
    clearMessages: () => void;
    /** Most recent error that occurred, if any */
    lastError: Error | null;
}

/**
 * Configuration options for the useWebSocket hook
 * @template T The type of messages being sent/received
 */
export type UseWebSocketsOptions<T> = {
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
    onError?: (error: Error) => void;
    /** Callback fired when the connection is closed */
    onClose?: () => void;
    /** Whether to automatically connect when the hook is initialized */
    autoConnect?: boolean;
}

/**
 * Props for the useWebSocket hook
 * @template T The type of messages being sent/received
 */
export type UseWebSocketProps<T> = {
    /** WebSocket endpoint URL */
    url: string;
    /** Configuration options */
    options?: UseWebSocketsOptions<T>;
}

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
 *   lastError
 * } = useWebSocket<MessageType>({
 *   url: 'ws://example.com',
 *   options: {
 *     autoConnect: true,
 *     reconnect: true,
 *     onMessage: (msg) => console.log('New message:', msg)
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
    } = options;

    // State management
    const [messages, setMessages] = useState<T[]>([]);
    const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'reconnecting'>(
        autoConnect ? 'connecting' : 'disconnected'
    );
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [lastError, setLastError] = useState<Error | null>(null);
    
    // Refs for managing reconnection without causing re-renders
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectCountRef = useRef(0);
    const mountedRef = useRef(true);
    const statusRef = useRef(status);
    const isInitialMount = useRef(true);

    // Update status ref when status changes
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    // Utility function to clear message history
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

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
        reconnectCountRef.current = 0;
        setStatus('disconnected');
        onClose?.();
    }, [socket, onClose]);

    // Initialize a new WebSocket connection
    const connect = useCallback(() => {
        // Don't attempt to connect if we're already connecting or reconnecting
        if (statusRef.current === 'connecting' || statusRef.current === 'reconnecting') {
            return;
        }

        cleanup();
        setStatus('connecting');
        
        try {
            const newSocket = new WebSocket(url);
            setSocket(newSocket);
        } catch (error) {
            const wsError = new Error(`Failed to create WebSocket connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setLastError(wsError);
            setStatus('disconnected');
            onError?.(wsError);
        }
    }, [url, onError, cleanup]);

    // Handle successful connection
    const handleOpen = useCallback(() => {
        if (!mountedRef.current) return;
        
        reconnectCountRef.current = 0;
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
            const message = JSON.parse(event.data) as T;
            setMessages(prev => [...prev, message]);
            onMessage?.(message);
        } catch (error) {
            const wsError = new Error(`Failed to parse message: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setLastError(wsError);
            onError?.(wsError);
        }
    }, [onMessage, onError]);

    // Handle WebSocket errors
    const handleError = useCallback((event: Event) => {
        if (!mountedRef.current) return;

        const error = event instanceof ErrorEvent ? event.error : new Error('WebSocket error occurred');
        if (statusRef.current !== 'reconnecting') {
            setStatus('disconnected');
            setLastError(error);
            onError?.(error);
        }
    }, [onError]);

    // Handle connection closure and reconnection
    const handleClose = useCallback(() => {
        if (!mountedRef.current) return;

        // Only update status if we're not already reconnecting
        if (statusRef.current !== 'reconnecting') {
            setStatus('disconnected');
            onClose?.();
        }

        // Attempt reconnection if enabled and within retry limits
        if (reconnect && reconnectCountRef.current < maxRetries) {
            // Don't set status to reconnecting if we're already in that state
            if (statusRef.current !== 'reconnecting') {
                setStatus('reconnecting');
            }
            
            reconnectTimerRef.current = setTimeout(() => {
                if (mountedRef.current) {
                    reconnectCountRef.current += 1;
                    connect();
                }
            }, reconnectInterval);
        }
    }, [reconnect, maxRetries, reconnectInterval, connect, onClose]);

    // Set up initial connection
    useEffect(() => {
        mountedRef.current = true;
        
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (autoConnect) {
                connect();
            }
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
            const error = new Error('WebSocket is not connected');
            setLastError(error);
            onError?.(error);
            return;
        }

        try {
            socket.send(JSON.stringify(message));
        } catch (error) {
            const wsError = new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setLastError(wsError);
            onError?.(wsError);
        }
    }, [socket, onError]);

    return {
        send,
        messages,
        status,
        connect,
        disconnect: cleanup,
        clearMessages,
        lastError,
    };
}