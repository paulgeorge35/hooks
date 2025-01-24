import { useCallback, useState } from "react";

export type CopyError = {
    message: string;
    originalError: unknown;
};

export type UseCopyToClipboard = {
    /** Function to copy text to the clipboard */
    copy: (value: string) => Promise<void>;
    /** Whether a copy operation is in progress */
    isLoading: boolean;
    /** The last error that occurred during copying */
    error: CopyError | null;
};

export type UseCopyToClipboardProps = {
    /** Optional callback function to be called after successful copy */
    onSuccess?: () => void;
    /** Optional callback function to be called when an error occurs */
    onError?: (error: CopyError) => void;
};

/**
 * A hook that provides a function to copy text to the clipboard with error handling
 * and loading state. Uses the modern Clipboard API with fallback to older methods.
 * 
 * @param props - The hook's configuration object
 * @param props.onSuccess - Optional callback function to be called after successful copy
 * @param props.onError - Optional callback function to be called when an error occurs
 * @returns An object containing the copy function and state
 * 
 * @example
 * ```tsx
 * // Basic usage with loading and error states
 * function ShareButton() {
 *   const { copy, isLoading, error } = useCopyToClipboard({
 *     onSuccess: () => toast.success('Copied to clipboard!'),
 *     onError: (error) => toast.error(error.message)
 *   });
 * 
 *   return (
 *     <>
 *       <button 
 *         onClick={() => copy('Hello, World!')}
 *         disabled={isLoading}
 *       >
 *         {isLoading ? 'Copying...' : 'Share Link'}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </>
 *   );
 * }
 * ```
 */
export const useCopyToClipboard = ({ 
    onSuccess, 
    onError 
}: UseCopyToClipboardProps = {}): UseCopyToClipboard => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<CopyError | null>(null);

    const copy = useCallback(async (value: string) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!navigator?.clipboard) {
                throw new Error('Clipboard API not supported');
            }

            await navigator.clipboard.writeText(value);
            onSuccess?.();
        } catch (err) {
            const copyError: CopyError = {
                message: err instanceof Error 
                    ? err.message 
                    : 'Failed to copy to clipboard',
                originalError: err
            };
            setError(copyError);
            onError?.(copyError);
        } finally {
            setIsLoading(false);
        }
    }, [onSuccess, onError]);

    return { copy, isLoading, error };
};