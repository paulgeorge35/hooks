import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type StepValidationResult = {
    /** Whether the step transition is valid */
    isValid: boolean;
    /** Optional error message if validation fails */
    error?: string;
};

export type StepTransitionDirection = 'next' | 'previous' | 'jump';

export type UseStepperOptions = {
    /** Initial step index (0-based) */
    initialStep?: number;
    /** Total number of steps */
    totalSteps: number;
    /** Optional validation function for step transitions */
    validateStep?: (
        currentStep: number,
        targetStep: number,
        direction: StepTransitionDirection
    ) => StepValidationResult | Promise<StepValidationResult>;
    /** Whether to allow direct navigation to any step */
    allowJumps?: boolean;
    /** Whether to persist step state in URL */
    persistInUrl?: boolean;
    /** URL parameter name for persisted step */
    urlParam?: string;
    /** Callback when step changes */
    onChange?: (step: number, prevStep: number) => void;
    /** Callback when validation fails */
    onValidationFail?: (error: string) => void;
};

export type UseStepperState = {
    /** Current step index (0-based) */
    currentStep: number;
    /** Total number of steps */
    totalSteps: number;
    /** Whether there is a next step available */
    hasNext: boolean;
    /** Whether there is a previous step available */
    hasPrevious: boolean;
    /** Whether currently at the first step */
    isFirst: boolean;
    /** Whether currently at the last step */
    isLast: boolean;
    /** Whether currently validating a step transition */
    isValidating: boolean;
    /** Last validation error message */
    error?: string;
    /** Progress percentage (0-100) */
    progress: number;
};

export type UseStepperActions = {
    /** Move to the next step if validation passes */
    next: () => Promise<boolean>;
    /** Move to the previous step if validation passes */
    previous: () => Promise<boolean>;
    /** Reset to the initial step */
    reset: () => void;
    /** Go to a specific step index if validation passes */
    goTo: (step: number) => Promise<boolean>;
};

export type UseStepper = UseStepperState & UseStepperActions;

/**
 * A hook for managing multi-step forms or wizards with validation support
 * and enhanced features.
 * 
 * @param options - Configuration options
 * @returns An object containing the step state and navigation functions
 * 
 * @example
 * ```tsx
 * // Basic stepper with validation
 * const {
 *   currentStep,
 *   next,
 *   previous,
 *   isFirst,
 *   isLast,
 *   progress
 * } = useStepper({
 *   totalSteps: 3,
 *   validateStep: async (current) => ({
 *     isValid: await validateFormStep(current),
 *     error: 'Please fill in all required fields'
 *   })
 * });
 * 
 * return (
 *   <div>
 *     <ProgressBar value={progress} />
 *     <StepContent step={currentStep} />
 *     <div>
 *       {!isFirst && (
 *         <button onClick={previous}>Previous</button>
 *       )}
 *       {!isLast && (
 *         <button onClick={next}>Next</button>
 *       )}
 *     </div>
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Advanced stepper with URL persistence
 * const stepper = useStepper({
 *   totalSteps: 4,
 *   persistInUrl: true,
 *   urlParam: 'step',
 *   allowJumps: true,
 *   onChange: (step) => {
 *     analytics.track('Step Changed', { step });
 *   },
 *   onValidationFail: (error) => {
 *     toast.error(error);
 *   }
 * });
 * 
 * return (
 *   <div>
 *     <nav>
 *       {Array.from({ length: 4 }, (_, i) => (
 *         <StepButton
 *           key={i}
 *           isActive={i === stepper.currentStep}
 *           isComplete={i < stepper.currentStep}
 *           onClick={() => stepper.goTo(i)}
 *           disabled={stepper.isValidating}
 *         />
 *       ))}
 *     </nav>
 *     {stepper.error && (
 *       <ErrorMessage>{stepper.error}</ErrorMessage>
 *     )}
 *     <StepContent step={stepper.currentStep} />
 *   </div>
 * );
 * ```
 */
export const useStepper = ({
    initialStep = 0,
    totalSteps,
    validateStep,
    allowJumps = false,
    persistInUrl = false,
    urlParam = 'step',
    onChange,
    onValidationFail,
}: UseStepperOptions): UseStepper => {
    // Initialize step from URL if enabled
    const getInitialStep = useCallback(() => {
        if (persistInUrl && typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const urlStep = params.get(urlParam);
            if (urlStep) {
                const step = Number.parseInt(urlStep, 10);
                if (!Number.isNaN(step) && step >= 0 && step < totalSteps) {
                    return step;
                }
            }
        }
        return Math.max(0, Math.min(initialStep, totalSteps - 1));
    }, [initialStep, totalSteps, persistInUrl, urlParam]);

    const [currentStep, setCurrentStep] = useState(getInitialStep);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string>();
    const prevStepRef = useRef(currentStep);

    // Update URL when step changes
    useEffect(() => {
        if (persistInUrl && typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set(urlParam, currentStep.toString());
            window.history.replaceState({}, '', url.toString());
        }
    }, [currentStep, persistInUrl, urlParam]);

    // Validate step transition
    const validateTransition = useCallback(async (
        targetStep: number,
        direction: StepTransitionDirection
    ): Promise<boolean> => {
        if (targetStep < 0 || targetStep >= totalSteps) {
            return false;
        }

        if (!allowJumps && direction === 'jump') {
            return false;
        }

        if (validateStep) {
            setIsValidating(true);
            setError(undefined);

            try {
                const result = await validateStep(currentStep, targetStep, direction);
                if (!result.isValid) {
                    setError(result.error);
                    onValidationFail?.(result.error || 'Validation failed');
                    return false;
                }
            } catch (err) {
                setError('Validation failed');
                onValidationFail?.('Validation failed');
                return false;
            } finally {
                setIsValidating(false);
            }
        }

        return true;
    }, [currentStep, totalSteps, validateStep, allowJumps, onValidationFail]);

    // Navigation functions
    const navigate = useCallback(async (
        targetStep: number,
        direction: StepTransitionDirection
    ): Promise<boolean> => {
        const isValid = await validateTransition(targetStep, direction);
        if (isValid) {
            prevStepRef.current = currentStep;
            setCurrentStep(targetStep);
            onChange?.(targetStep, prevStepRef.current);
            return true;
        }
        return false;
    }, [currentStep, validateTransition, onChange]);

    const next = useCallback(async (): Promise<boolean> => {
        return navigate(currentStep + 1, 'next');
    }, [currentStep, navigate]);

    const previous = useCallback(async (): Promise<boolean> => {
        return navigate(currentStep - 1, 'previous');
    }, [currentStep, navigate]);

    const goTo = useCallback(async (step: number): Promise<boolean> => {
        return navigate(step, 'jump');
    }, [navigate]);

    const reset = useCallback((): void => {
        setCurrentStep(initialStep);
        setError(undefined);
    }, [initialStep]);

    // Compute derived state
    const state = useMemo((): UseStepperState => ({
        currentStep,
        totalSteps,
        hasNext: currentStep < totalSteps - 1,
        hasPrevious: currentStep > 0,
        isFirst: currentStep === 0,
        isLast: currentStep === totalSteps - 1,
        isValidating,
        error,
        progress: (currentStep / (totalSteps - 1)) * 100,
    }), [currentStep, totalSteps, isValidating, error]);

    return {
        ...state,
        next,
        previous,
        reset,
        goTo,
    };
};
