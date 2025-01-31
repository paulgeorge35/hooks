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
        const { result } = renderHook(() => useStepper({ totalSteps: 5 }));
        
        expect(result.current.currentStep).toBe(0);
        expect(result.current.hasNext).toBe(true);
        expect(result.current.hasPrevious).toBe(false);
        expect(result.current.isFirst).toBe(true);
        expect(result.current.isLast).toBe(false);
        expect(result.current.isValidating).toBe(false);
        expect(result.current.error).toBeUndefined();
        expect(result.current.progress).toBe(0);
    });

    test("should initialize with custom initial step", () => {
        const { result } = renderHook(() => 
            useStepper({ totalSteps: 5, initialStep: 2 })
        );
        
        expect(result.current.currentStep).toBe(2);
        expect(result.current.hasNext).toBe(true);
        expect(result.current.hasPrevious).toBe(true);
        expect(result.current.progress).toBe(50);
    });

    test("should handle next/previous navigation", async () => {
        const { result } = renderHook(() => useStepper({ totalSteps: 3 }));
        
        await act(async () => {
            await result.current.next();
        });
        expect(result.current.currentStep).toBe(1);
        expect(result.current.progress).toBe(50);
        
        await act(async () => {
            await result.current.previous();
        });
        expect(result.current.currentStep).toBe(0);
        expect(result.current.progress).toBe(0);
    });

    test("should handle validation", async () => {
        const validateStep = async (current: number) => ({
            isValid: current !== 1,
            error: current === 1 ? "Cannot leave step 1" : undefined
        });
        
        const { result } = renderHook(() => 
            useStepper({ totalSteps: 3, validateStep })
        );
        
        await act(async () => {
            await result.current.next();
        });
        expect(result.current.currentStep).toBe(1);
        
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(false);
        });
        expect(result.current.currentStep).toBe(1);
        expect(result.current.error).toBe("Cannot leave step 1");
    });

    test("should handle URL persistence", async () => {
        const { result } = renderHook(() => 
            useStepper({ totalSteps: 3, persistInUrl: true, urlParam: 'step' })
        );
        
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(true);
        });
        
        const url = new URL(window.location.href);
        expect(url.searchParams.get('step')).toBe('1');
    });

    test("should handle direct navigation with allowJumps", async () => {
        const { result } = renderHook(() => 
            useStepper({ totalSteps: 5, allowJumps: true })
        );
        
        await act(async () => {
            const success = await result.current.goTo(3);
            expect(success).toBe(true);
        });
        expect(result.current.currentStep).toBe(3);
        expect(result.current.progress).toBe(75);
    });

    test("should prevent direct navigation without allowJumps", async () => {
        const { result } = renderHook(() => 
            useStepper({ totalSteps: 5, allowJumps: false })
        );
        
        await act(async () => {
            const success = await result.current.goTo(3);
            expect(success).toBe(false);
        });
        expect(result.current.currentStep).toBe(0);
    });

    test("should handle callbacks", async () => {
        let lastChange = { step: -1, prevStep: -1 };
        let validationFailCount = 0;
        
        const { result } = renderHook(() => useStepper({
            totalSteps: 3,
            validateStep: async () => ({ isValid: false, error: "Test error" }),
            onChange: (step, prevStep) => {
                lastChange = { step, prevStep };
            },
            onValidationFail: () => {
                validationFailCount++;
            }
        }));
        
        await act(async () => {
            await result.current.next();
        });
        
        expect(validationFailCount).toBe(1);
        expect(result.current.error).toBe("Test error");
    });

    test("should reset to initial step", async () => {
        const { result } = renderHook(() => 
            useStepper({ totalSteps: 5, initialStep: 2 })
        );
        
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(true);
        });
        expect(result.current.currentStep).toBe(3);
        
        await act(async () => {
            result.current.reset();
            // No need to await reset as it's synchronous
        });
        expect(result.current.currentStep).toBe(2);
        expect(result.current.error).toBeUndefined();
        expect(result.current.progress).toBe(50);
    });

    test("should handle boundary conditions", async () => {
        const { result } = renderHook(() => useStepper({ totalSteps: 3 }));
        
        // Test first step conditions
        expect(result.current.isFirst).toBe(true);
        expect(result.current.isLast).toBe(false);
        expect(result.current.progress).toBe(0);
        
        // Move to last step
        await act(async () => {
            const nextResult = await result.current.next();
            expect(nextResult).toBe(true);
        });
        
        await act(async () => {
            const nextResult = await result.current.next();
            expect(nextResult).toBe(true);
        });
        
        // Verify last step conditions
        expect(result.current.currentStep).toBe(2);
        expect(result.current.isFirst).toBe(false);
        expect(result.current.isLast).toBe(true);
        expect(result.current.progress).toBe(100);
        
        // Verify cannot go beyond last step
        await act(async () => {
            const success = await result.current.next();
            expect(success).toBe(false);
        });
        expect(result.current.currentStep).toBe(2);
        
        // Verify can go back from last step
        await act(async () => {
            const success = await result.current.previous();
            expect(success).toBe(true);
        });
        expect(result.current.currentStep).toBe(1);
        expect(result.current.isFirst).toBe(false);
        expect(result.current.isLast).toBe(false);
    });
}); 