import { useCallback, useMemo, useState } from 'react';

export type UseBoolean = UseBooleanActions & { value: boolean };

export type UseBooleanActions = {
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
}

/**
 * A hook that manages boolean state with convenient toggle, on, and off functions
 * @param {boolean} [initialValue=false] - The initial boolean value (defaults to false)
 * @returns An object containing the boolean value and functions to manipulate it
 * @example
 * ```tsx
 * const { value, toggle, setTrue, setFalse } = useBoolean(false);
 * ```
 */
export const useBoolean = (initialValue = false): UseBoolean => {
    const [value, setValue] = useState<boolean>(initialValue);

    const toggle = useCallback(() => setValue((v: boolean) => !v), []);
    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);

    const actions = useMemo(() => ({ setValue, toggle, setTrue, setFalse }), [toggle, setTrue, setFalse]);

    return useMemo(() => ({ value, ...actions }) as UseBoolean, [actions, value]);
}; 
