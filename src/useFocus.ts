import { useCallback, useEffect, useState } from "react";

export type UseFocus = {
    /** Whether the element is currently focused */
    isFocused: boolean;
    /** Function to set the focus state to true */
    setFocus: () => void;
    /** Function to set the focus state to false */
    setBlur: () => void;
}

export type UseFocusProps = {
    /** Reference to the DOM element to track focus state */
    ref: React.RefObject<HTMLDivElement | null>;
    /** Optional callback to be called when the element receives focus */
    onFocus?: () => void;
    /** Optional callback to be called when the element loses focus */
    onBlur?: () => void;
}

/**
 * A hook that tracks the focus state of a DOM element
 * 
 * @param props - The hook's configuration object
 * @param props.ref - Reference to the DOM element to track focus state
 * @param props.onFocus - Optional callback to be called when the element receives focus
 * @param props.onBlur - Optional callback to be called when the element loses focus
 * @returns An object containing the current focus state
 * 
 * @example
 * ```tsx
 * const elementRef = useRef<HTMLDivElement>(null);
 * const { isFocused } = useFocus({ 
 *   ref: elementRef,
 *   onFocus: () => console.log('Element focused'),
 *   onBlur: () => console.log('Element blurred')
 * });
 * 
 * return (
 *   <div ref={elementRef} tabIndex={0}>
 *     {isFocused ? 'Focused!' : 'Not focused'}
 *   </div>
 * );
 * ```
 */
export const useFocus = ({ ref, onFocus, onBlur }: UseFocusProps): UseFocus => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        onBlur?.();
    }, [onBlur]);

    const setFocus = useCallback(() => {
        if (ref.current) {
            ref.current.focus();
            handleFocus();
        }
    }, [ref, handleFocus]);

    const setBlur = useCallback(() => {
        if (ref.current) {
            ref.current.blur();
            handleBlur();
        }
    }, [ref, handleBlur]);

    useEffect(() => {
        const element = ref.current;
        const controller = new AbortController();

        if (element) {
            element.addEventListener('focus', handleFocus, { signal: controller.signal });
            element.addEventListener('blur', handleBlur, { signal: controller.signal });

            return () => {
                controller.abort();
            };
        }
    }, [handleFocus, handleBlur, ref]);

    return { isFocused, setFocus, setBlur };
}