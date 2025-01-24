// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';
import { useFocus } from '../useFocus';
import './index.css';

export const UseFocus = () => {
    const [inputRef, inputFocused] = useFocus<HTMLInputElement>({
        onFocus: () => console.log('Input focused'),
        onBlur: () => console.log('Input blurred'),
    });

    const [buttonRef, buttonFocused] = useFocus<HTMLButtonElement>({
        onFocus: () => console.log('Button focused'),
        onBlur: () => console.log('Button blurred'),
    });

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Focus Demo</h2>
            <div className="storybook-content-use-focus">
                <div className="storybook-focus-section">
                    <h3>Input Focus</h3>
                    <div className="storybook-focus-status">
                        <div data-testid="inputStatus">Status: {inputFocused ? 'Focused' : 'Not Focused'}</div>
                    </div>
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        placeholder="Type something..."
                        className={`storybook-focus-input ${inputFocused ? 'focused' : ''}`}
                        data-testid="focusableInput"
                    />
                    <div className="storybook-focus-controls">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.focus()}
                            className="storybook-focus-button"
                            data-testid="focusInputButton"
                            tabIndex={-1}
                        >
                            Focus Input
                        </button>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.blur()}
                            className="storybook-focus-button"
                            data-testid="blurInputButton"
                            tabIndex={-1}
                        >
                            Blur Input
                        </button>
                    </div>
                </div>

                <div className="storybook-focus-section">
                    <h3>Button Focus</h3>
                    <div className="storybook-focus-status">
                        <div data-testid="buttonStatus">Status: {buttonFocused ? 'Focused' : 'Not Focused'}</div>
                    </div>
                    <button
                        ref={buttonRef}
                        type="button"
                        className={`storybook-focus-element ${buttonFocused ? 'focused' : ''}`}
                        data-testid="focusableButton"
                    >
                        Focusable Button
                    </button>
                    <div className="storybook-focus-controls">
                        <button
                            type="button"
                            onClick={() => buttonRef.current?.focus()}
                            className="storybook-focus-button"
                            data-testid="focusButtonButton"
                            tabIndex={-1}
                        >
                            Focus Button
                        </button>
                        <button
                            type="button"
                            onClick={() => buttonRef.current?.blur()}
                            className="storybook-focus-button"
                            data-testid="blurButtonButton"
                            tabIndex={-1}
                        >
                            Blur Button
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 