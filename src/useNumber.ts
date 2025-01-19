import { useCallback, useState } from 'react';

export type UseNumberActions = {
    /** Function to set the number value directly */
    setValue: React.Dispatch<React.SetStateAction<number>>;
    /** Function to increase the number by a specified amount or the default step */
    increase: (amount?: number) => void;
    /** Function to decrease the number by a specified amount or the default step */
    decrease: (amount?: number) => void;
    /** Function to reset the number to its initial value */
    reset: () => void;
}

export type UseNumber = UseNumberActions & {
    /** The current number value */
    value: number;
}

export type UseNumberProps = {
    /** Minimum allowed value */
    min?: number;
    /** Maximum allowed value */
    max?: number;
    /** Step value for increase/decrease operations */
    step?: number;
    /** Whether to loop around when reaching min/max values */
    loop?: boolean;
}

/**
 * A hook that manages a numeric value with increment, decrement, and constraint capabilities.
 * Provides utilities for managing numeric state with boundaries and step values.
 * 
 * @param initialValue - The initial number value
 * @param props - Configuration options
 * @param props.min - Minimum allowed value
 * @param props.max - Maximum allowed value
 * @param props.step - Step value for increase/decrease operations (defaults to 1)
 * @param props.loop - Whether to loop around when reaching min/max values (defaults to false)
 * @returns An object containing the number value and functions to manipulate it
 * 
 * @example
 * ```tsx
 * // Basic counter
 * const counter = useNumber(0, { min: 0, max: 10 });
 * 
 * return (
 *   <div>
 *     <p>Count: {counter.value}</p>
 *     <button onClick={() => counter.increase()}>+1</button>
 *     <button onClick={() => counter.decrease()}>-1</button>
 *     <button onClick={counter.reset}>Reset</button>
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Custom step and loop behavior
 * const volume = useNumber(50, {
 *   min: 0,
 *   max: 100,
 *   step: 5,
 *   loop: true
 * });
 * 
 * return (
 *   <div>
 *     <p>Volume: {volume.value}%</p>
 *     <button onClick={() => volume.increase(10)}>+10%</button>
 *     <button onClick={() => volume.decrease(10)}>-10%</button>
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Form input with numeric constraints
 * const price = useNumber(0, {
 *   min: 0,
 *   max: 1000,
 *   step: 0.01
 * });
 * 
 * return (
 *   <input
 *     type="number"
 *     value={price.value}
 *     onChange={(e) => price.setValue(parseFloat(e.target.value))}
 *     min={0}
 *     max={1000}
 *     step={0.01}
 *   />
 * );
 * ```
 */
export const useNumber = (
    initialValue: number,
    { min, max, step = 1, loop = false }: UseNumberProps = {}
): UseNumber => {
    const [value, setValue] = useState<number>(() => {
        if (min !== undefined && initialValue < min) return min;
        if (max !== undefined && initialValue > max) return max;
        return initialValue;
    });

    const increase = useCallback((amount?: number) => {
        setValue(currentValue => {
            const newValue = currentValue + (amount ?? step);
            if (max === undefined) return newValue;
            if (!loop) return Math.min(newValue, max);
            return newValue > max ? min ?? newValue : newValue;
        });
    }, [max, min, step, loop]);

    const decrease = useCallback((amount?: number) => {
        setValue(currentValue => {
            const newValue = currentValue - (amount ?? step);
            if (min === undefined) return newValue;
            if (!loop) return Math.max(newValue, min);
            return newValue < min ? max ?? newValue : newValue;
        });
    }, [max, min, step, loop]);

    const reset = useCallback(() => {
        setValue(initialValue);
    }, [initialValue]);

    return {
        value,
        setValue,
        increase,
        decrease,
        reset,
    };
}; 
