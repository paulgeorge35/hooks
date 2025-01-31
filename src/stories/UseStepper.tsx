// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';
import { useStepper } from '../useStepper';
import './index.css';

type UseStepperProps = {
    steps: {
        id: number;
        title: string;
    }[];
}

export const UseStepper: React.FC<UseStepperProps> = ({ steps }) => {
    const {
        currentStep,
        totalSteps,
        isFirst,
        isLast,
        hasNext,
        hasPrevious,
        next,
        previous,
        goTo,
        reset
    } = useStepper({
        totalSteps: steps.length,
        initialStep: 0,
        allowJumps: true
    });

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Stepper Demo</h2>
            <div className="storybook-content-use-stepper">
                <div className="storybook-stepper-progress">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`storybook-stepper-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'complete' : ''}`}
                            data-testid={`step-${index}`}
                        >
                            <span className="storybook-stepper-step-content">
                                <div className="storybook-stepper-step-number">
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                <div className="storybook-stepper-step-title">
                                    {step.title}
                                </div>
                            </span>
                            {index < steps.length - 1 && (
                                <div className="storybook-stepper-step-line" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="storybook-stepper-content">
                    <div className="storybook-stepper-info" data-testid="stepperInfo">
                        <div>
                            Current Step: <span className="storybook-stepper-value">{steps[currentStep].title}</span>
                        </div>
                        <div>
                            Step Number: <span className="storybook-stepper-value">{currentStep}</span>
                        </div>
                        <div>
                            First Step: <span className="storybook-stepper-value">{isFirst ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                            Last Step: <span className="storybook-stepper-value">{isLast ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    <div className="storybook-stepper-controls">
                        <button
                            type="button"
                            onClick={() => previous()}
                            disabled={!hasPrevious}
                            className="storybook-stepper-button"
                            data-testid="prevButton"
                        >
                            Previous
                        </button>

                        <div className="storybook-stepper-jump">
                            {Array.from({ length: totalSteps }).map((_, index) => (
                                <button
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    key={index}
                                    type="button"
                                    onClick={() => goTo(index)}
                                    className={`storybook-stepper-jump-button ${index === currentStep ? 'active' : ''}`}
                                    data-testid={`jumpButton-${index}`}
                                >
                                    {index}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => next()}
                            disabled={!hasNext}
                            className="storybook-stepper-button"
                            data-testid="nextButton"
                        >
                            Next
                        </button>
                    </div>

                    <div className="storybook-stepper-reset">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="storybook-stepper-button"
                            data-testid="resetButton"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 