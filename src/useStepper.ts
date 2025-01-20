import { useCallback, useState } from 'react';

export type UseStepperOptions = {
    /** Initial step index (0-based) */
    initialStep?: number;
    /** Total number of steps */
    totalSteps: number;
    /** Optional validation function for step transitions */
    validateStep?: (currentStep: number, direction: 'next' | 'previous') => boolean | Promise<boolean>;
}

export type UseStepperActions = {
    /** Move to the next step if validation passes */
    next: () => Promise<boolean>;
    /** Move to the previous step if validation passes */
    previous: () => Promise<boolean>;
    /** Reset to the initial step */
    reset: () => void;
    /** Go to a specific step index if validation passes */
    goTo: (step: number) => Promise<boolean>;
}

export type UseStepper = UseStepperActions & {
    /** Current step index (0-based) */
    currentStep: number;
    /** Whether there is a next step available */
    hasNext: boolean;
    /** Whether there is a previous step available */
    hasPrevious: boolean;
    /** Whether currently at the first step */
    isFirst: boolean;
    /** Whether currently at the last step */
    isLast: boolean;
}

/**
 * A hook for managing multi-step forms or wizards with validation support.
 * Provides utilities for step navigation, validation, and state management.
 * 
 * @param options - Configuration options
 * @param options.initialStep - Initial step index (0-based, defaults to 0)
 * @param options.totalSteps - Total number of steps
 * @param options.validateStep - Optional validation function for step transitions
 * @returns An object containing the current step state and navigation functions
 * 
 * @example
 * ```tsx
 * // Basic stepper
 * const stepper = useStepper({ totalSteps: 3 });
 * 
 * return (
 *   <div>
 *     <p>Step {stepper.currentStep + 1} of 3</p>
 *     <button onClick={stepper.previous} disabled={!stepper.hasPrevious}>
 *       Previous
 *     </button>
 *     <button onClick={stepper.next} disabled={!stepper.hasNext}>
 *       Next
 *     </button>
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Stepper with validation
 * const validateStep = async (step: number, direction: 'next' | 'previous') => {
 *   if (direction === 'next') {
 *     const isValid = await validateFormData(step);
 *     return isValid;
 *   }
 *   return true; // Always allow going back
 * };
 * 
 * const stepper = useStepper({
 *   totalSteps: 3,
 *   validateStep
 * });
 * 
 * const handleNext = async () => {
 *   const success = await stepper.next();
 *   if (!success) {
 *     showError('Please fill in all required fields');
 *   }
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Multi-step form with custom navigation
 * const stepper = useStepper({
 *   totalSteps: 4,
 *   initialStep: 1
 * });
 * 
 * return (
 *   <div>
 *     <nav>
 *       {Array.from({ length: 4 }, (_, i) => (
 *         <button
 *           key={i}
 *           onClick={() => stepper.goTo(i)}
 *           disabled={i === stepper.currentStep}
 *         >
 *           Step {i + 1}
 *         </button>
 *       ))}
 *     </nav>
 *     {stepper.currentStep === 0 && <PersonalInfo />}
 *     {stepper.currentStep === 1 && <AddressInfo />}
 *     {stepper.currentStep === 2 && <PaymentInfo />}
 *     {stepper.currentStep === 3 && <Confirmation />}
 *   </div>
 * );
 * ```
 */
export const useStepper = ({
    initialStep = 0,
    totalSteps,
    validateStep
}: UseStepperOptions): UseStepper => {
    const [currentStep, setCurrentStep] = useState<number>(() => {
        // Ensure initial step is within bounds
        return Math.max(0, Math.min(initialStep, totalSteps - 1));
    });

    const navigate = useCallback(async (targetStep: number): Promise<boolean> => {
        // Ensure target step is within bounds
        if (targetStep < 0 || targetStep >= totalSteps) {
            return false;
        }

        // If validation function exists, check if transition is allowed
        if (validateStep) {
            const direction = targetStep > currentStep ? 'next' : 'previous';
            const isValid = await validateStep(currentStep, direction);
            if (!isValid) {
                return false;
            }
        }

        setCurrentStep(targetStep);
        return true;
    }, [currentStep, totalSteps, validateStep]);

    const next = useCallback(async (): Promise<boolean> => {
        return navigate(currentStep + 1);
    }, [currentStep, navigate]);

    const previous = useCallback(async (): Promise<boolean> => {
        return navigate(currentStep - 1);
    }, [currentStep, navigate]);

    const reset = useCallback((): void => {
        setCurrentStep(initialStep);
    }, [initialStep]);

    const goTo = useCallback(async (step: number): Promise<boolean> => {
        return navigate(step);
    }, [navigate]);

    return {
        currentStep,
        hasNext: currentStep < totalSteps - 1,
        hasPrevious: currentStep > 0,
        isFirst: currentStep === 0,
        isLast: currentStep === totalSteps - 1,
        next,
        previous,
        reset,
        goTo
    };
};
