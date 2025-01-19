import { useCallback } from "react";

export type UseCopyToClipboard = {
    copy: (value: string) => void;
}

export type UseCopyToClipboardProps = {
    callback?: () => void;
}

export const useCopyToClipboard = ({ callback }: UseCopyToClipboardProps): UseCopyToClipboard => {
    const copy = useCallback((value: string) => {
        navigator.clipboard.writeText(value);
        callback?.();
    }, [callback]);

    return { copy };
}