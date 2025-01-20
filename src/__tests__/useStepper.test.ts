import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useStepper } from "../useStepper";

beforeEach(() => {
    GlobalRegistrator.register();
});

afterEach(() => {
    GlobalRegistrator.unregister();
});

describe("useStepper", () => {
    test("should initialize with default values", () => {
        const { result } = renderHook(() => useStepper({ totalSteps: 3 }));
        
        expect(result.current.currentStep).toBe(0);
        expect(result.current.hasNext).toBe(true);
        expect(result.current.hasPrevious).toBe(false);
        expect(result.current.isFirst).toBe(true);
        expect(result.current.isLast).toBe(false);
    });

    test("should initialize with custom initial step", () => {
        const { result } = renderHook(() => useStepper({ totalSteps: 3, initialStep: 1 }));
        
        expect(result.current.currentStep).toBe(1);
        expect(result.current.hasNext).toBe(true);
        expect(result.current.hasPrevious).toBe(true);
        expect(result.current.isFirst).toBe(false);
        expect(result.current.isLast).toBe(false);
    });

    test("should handle next and previous navigation", async () => {
        const { result } = renderHook(() => useStepper({ totalSteps: 3 }));

        // Go to next step
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(true);
        });
        expect(result.current.currentStep).toBe(1);

        // Go to previous step
        await act(async () => {
            const success = await result.current.previous();
            expect(success).toBe(true);
        });
        expect(result.current.currentStep).toBe(0);
    });

    test("should prevent navigation beyond bounds", async () => {
        const { result } = renderHook(() => useStepper({ totalSteps: 2 }));

        // Try to go previous from first step
        await act(async () => {
            const success = await result.current.previous();
            expect(success).toBe(false);
        });
        expect(result.current.currentStep).toBe(0);

        // Go to last step
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(true);
        });

        // Try to go next from last step
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(false);
        });
        expect(result.current.currentStep).toBe(1);
    });

    test("should handle step validation", async () => {
        const validateStep = (step: number, direction: 'next' | 'previous') => {
            // Only allow moving forward from step 0
            return !(step === 0 && direction === 'next');
        };

        const { result } = renderHook(() => 
            useStepper({ totalSteps: 3, validateStep })
        );

        // Try to move forward (should fail validation)
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(false);
        });
        expect(result.current.currentStep).toBe(0);
    });

    test("should handle async validation", async () => {
        const validateStep = async (step: number, direction: 'next' | 'previous') => {
            await new Promise(resolve => setTimeout(resolve, 10));
            return step !== 1 || direction === 'previous';
        };

        const { result } = renderHook(() => 
            useStepper({ totalSteps: 3, validateStep })
        );

        // Go to step 1
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(true);
        });

        // Try to go to step 2 (should fail validation)
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(false);
        });
        expect(result.current.currentStep).toBe(1);

        // Go back to step 0 (should pass validation)
        await act(async () => {
            const success = await result.current.previous();
            expect(success).toBe(true);
        });
        expect(result.current.currentStep).toBe(0);
    });

    test("should handle goTo navigation", async () => {
        const { result } = renderHook(() => useStepper({ totalSteps: 4 }));

        // Go to valid step
        await act(async () => {
            const success = await result.current.goTo(2);
            expect(success).toBe(true);
        });
        expect(result.current.currentStep).toBe(2);

        // Try to go to invalid step
        await act(async () => {
            const success = await result.current.goTo(5);
            expect(success).toBe(false);
        });
        expect(result.current.currentStep).toBe(2);
    });

    test("should reset to initial step", async () => {
        const { result } = renderHook(() => 
            useStepper({ totalSteps: 3, initialStep: 1 })
        );

        // Move to last step
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(true);
        });
        expect(result.current.currentStep).toBe(2);

        // Reset to initial step
        act(() => {
            result.current.reset();
        });
        expect(result.current.currentStep).toBe(1);
    });

    test("should handle boundary conditions", () => {
        // Test with minimum steps
        const { result: minResult } = renderHook(() => 
            useStepper({ totalSteps: 1 })
        );
        expect(minResult.current.hasNext).toBe(false);
        expect(minResult.current.hasPrevious).toBe(false);
        expect(minResult.current.isFirst).toBe(true);
        expect(minResult.current.isLast).toBe(true);

        // Test with large number of steps
        const { result: maxResult } = renderHook(() => 
            useStepper({ totalSteps: 1000, initialStep: 500 })
        );
        expect(maxResult.current.hasNext).toBe(true);
        expect(maxResult.current.hasPrevious).toBe(true);
        expect(maxResult.current.isFirst).toBe(false);
        expect(maxResult.current.isLast).toBe(false);
    });
}); 