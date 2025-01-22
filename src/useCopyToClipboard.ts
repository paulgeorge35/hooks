import { useCallback } from "react";

export type UseCopyToClipboard = {
    /** Function to copy text to the clipboard */
    copy: (value: string) => void;
}

export type UseCopyToClipboardProps = {
    /** Optional callback function to be called after successful copy */
    callback?: () => void;
}

/**
 * A hook that provides a function to copy text to the clipboard with an optional callback.
 * Uses the modern Clipboard API for better compatibility and security.
 * 
 * @param props - The hook's configuration object
 * @param props.callback - Optional callback function to be called after successful copy
 * @returns An object containing the copy function
 * 
 * @example
 * ```tsx
 * // Basic usage with toast notification
 * import { toast } from 'react-toastify';
 * 
 * function ShareButton() {
 *   const { copy } = useCopyToClipboard({
 *     callback: () => toast.success('Copied to clipboard!')
 *   });
 * 
 *   return (
 *     <button onClick={() => copy('Hello, World!')}>
 *       Share Link
 *     </button>
 *   );
 * }
 * ```
 */
export const useCopyToClipboard = ({ callback }: UseCopyToClipboardProps): UseCopyToClipboard => {
    const copy = useCallback((value: string) => {
        navigator.clipboard.writeText(value);
        callback?.();
    }, [callback]);

    return { copy };
}