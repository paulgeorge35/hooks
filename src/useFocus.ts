import { useCallback, useEffect, useState } from "react";

export type UseFocus = {
    isFocused: boolean;
}

export type UseFocusProps = {
    ref: React.RefObject<HTMLDivElement | null>;
    onFocus?: () => void;
    onBlur?: () => void;
}

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

    useEffect(() => {
        const element = ref.current;
        if (element) {
            element.addEventListener('focus', handleFocus);
            element.addEventListener('blur', handleBlur);

            return () => {
                element.removeEventListener('focus', handleFocus);
                element.removeEventListener('blur', handleBlur);
            };
        }
    }, [handleFocus, handleBlur, ref]);

    return { isFocused };
}