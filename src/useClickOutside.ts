import { useCallback, useEffect, useRef } from "react";

/** A ref object for the element to detect clicks outside of */
export type UseClickOutside = React.RefObject<HTMLDivElement | null>;

export type UseClickOutsideProps = {
    /** Optional callback function to be called when a click outside is detected */
    callback?: () => void;
}

/**
 * A hook that detects clicks outside of a specified element
 * @param {UseClickOutsideProps} props - The props object containing the callback function
 * @returns {UseClickOutside} A ref object to be attached to the element
 */
export const useClickOutside = ({ callback }: UseClickOutsideProps): UseClickOutside => {
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            callback?.();
        }
    }, [callback]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);

    return ref;
}