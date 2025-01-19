import { useCallback, useEffect, useRef } from "react";

export type UseClickOutside = React.RefObject<HTMLDivElement | null>;

export type UseClickOutsideProps = {
    callback?: () => void;
}

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