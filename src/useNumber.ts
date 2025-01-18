import { useCallback, useMemo, useState } from 'react';

export interface UseNumberOptions {
    min?: number;
    max?: number;
    loop?: boolean;
    step?: number;
}

export interface UseNumberActions {
    increase: (value?: number) => void;
    decrease: (value?: number) => void;
    reset: () => void;
}

export type UseNumber = UseNumberActions & {
    value: number;
}

export function useNumber(
    initialValue: number,
    options: UseNumberOptions = {}
): UseNumber {
    const {
        min = Number.MIN_SAFE_INTEGER,
        max = Number.MAX_SAFE_INTEGER,
        loop = false,
        step = 1
    } = options;

    const [value, setValue] = useState<number>(
        Math.min(Math.max(initialValue, min), max)
    );

    const increase = useCallback((amount?: number) => {
        setValue((currentValue) => {
            const nextValue = currentValue + (amount ?? step);

            if (nextValue > max) {
                return loop ? min : max;
            }

            return nextValue;
        });
    }, [max, min, loop, step]);

    const decrease = useCallback((amount?: number) => {
        setValue((currentValue) => {
            const nextValue = currentValue - (amount ?? step);

            if (nextValue < min) {
                return loop ? max : min;
            }

            return nextValue;
        });
    }, [max, min, loop, step]);

    const reset = useCallback(() => {
        setValue(initialValue);
    }, [initialValue]);

    return useMemo(() => ({
        value,
        increase,
        decrease,
        reset,
    }), [value, increase, decrease, reset]);
} 
