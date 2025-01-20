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
 * 
 * @example
 * ```tsx
 * // Usage with custom toast duration and content
 * import { toast } from 'react-toastify';
 * 
 * function CopyableCode({ code }: { code: string }) {
 *   const { copy } = useCopyToClipboard({
 *     callback: () => {
 *       toast.success('Code copied!', {
 *         position: 'bottom-right',
 *         autoClose: 2000,
 *         hideProgressBar: false,
 *       });
 *     }
 *   });
 * 
 *   return (
 *     <pre onClick={() => copy(code)}>
 *       <code>{code}</code>
 *     </pre>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Usage with different toast types based on conditions
 * import { toast } from 'react-toastify';
 * 
 * function ShareableContent({ content, maxLength = 1000 }) {
 *   const { copy } = useCopyToClipboard({
 *     callback: () => {
 *       if (content.length > maxLength) {
 *         toast.warning('Content truncated due to length', {
 *           description: 'Only first 1000 characters were copied'
 *         });
 *       } else {
 *         toast.success('Content copied successfully', {
 *           icon: '📋'
 *         });
 *       }
 *     }
 *   });
 * 
 *   const handleCopy = () => {
 *     copy(content.slice(0, maxLength));
 *   };
 * 
 *   return (
 *     <div>
 *       <p>{content}</p>
 *       <button onClick={handleCopy}>
 *         Copy {content.length > maxLength ? 'Partial' : 'Full'} Content
 *       </button>
 *     </div>
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