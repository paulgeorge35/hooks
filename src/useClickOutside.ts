import { useCallback, useEffect, useRef } from "react";

/** A ref object for the element to detect clicks outside of */
export type UseClickOutside = React.RefObject<HTMLDivElement | HTMLDialogElement | null>;

export type UseClickOutsideProps = {
    /** Optional callback function to be called when a click outside is detected */
    callback?: () => void;
    /** Optional class name to exclude from the click detection */
    exceptionClassNames?: string[];
    /** Optional id to exclude from the click detection */
    exceptionIds?: string[];
}

/**
 * A hook that detects clicks outside of a specified element
 * @param {UseClickOutsideProps} props - The props object containing the callback function
 * @returns {UseClickOutside} A ref object to be attached to the element
 */
export const useClickOutside = ({ callback, exceptionClassNames, exceptionIds }: UseClickOutsideProps): UseClickOutside => {
    const ref = useRef<HTMLDivElement | HTMLDialogElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        console.log('handleClickOutside', event.target);
        const target = event.target as HTMLElement | HTMLDialogElement;
        if (ref.current && !ref.current.contains(target) && !exceptionClassNames?.includes(target.className) && !exceptionIds?.includes(target.id)) {
            callback?.();
        }
    }, [callback, exceptionClassNames, exceptionIds]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);

    return ref;
}