import React, { useRef, useState } from 'react';
import { usePrevious } from '../usePrevious';
import './index.css';

export const UsePrevious = () => {
    const [value, setValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const timestampsRef = useRef<number[]>([]);
    const { previous, history, clearHistory } = usePrevious(value, {
        maxHistory: 5,
        onChange: () => {
            timestampsRef.current = [Date.now(), ...timestampsRef.current.slice(0, 4)];
        }
    });

    const handleClearHistory = () => {
        timestampsRef.current = [];
        clearHistory();
    };

    const submit = () => {
        if (inputRef.current) {
            setValue(inputRef.current?.value || '');
            inputRef.current.value = '';
            inputRef.current.focus();
        }
    };

    const parseValue = (value?: string): string => {
        if (value === undefined) {
            return '(none)';
        }
        if (value === '') {
            return '(empty)';
        }
        return value;
    }

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Previous Value Tracker</h2>
            <div className="storybook-content-use-previous">
                <div className="storybook-previous-input-group">
                    <input
                        type="text"
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submit();
                            }
                        }}
                        placeholder="Type something..."
                        className="storybook-previous-input"
                        data-testid="input"
                    />
                    <button
                        type="button"
                        onClick={submit}
                        className="storybook-previous-submit-button"
                        data-testid="submitButton"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={handleClearHistory}
                        className="storybook-previous-button"
                        data-testid="clearButton"
                    >
                        Clear History
                    </button>
                </div>

                <div className="storybook-previous-status">
                    <div data-testid="currentValue">
                        Current Value: <span className="storybook-previous-value">{parseValue(value)}</span>
                    </div>
                    <div data-testid="previousValue">
                        Previous Value: <span className="storybook-previous-value">{parseValue(previous)}</span>
                    </div>
                </div>

                <div className="storybook-previous-history" data-testid="history">
                    <h3>Value History</h3>
                    {history.length > 0 ? (
                        <div className="storybook-previous-history-list">
                            {history.map((item, index) => (
                                <div
                                    key={timestampsRef.current[index] || index}
                                    className="storybook-previous-history-item"
                                >
                                    {parseValue(item)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="storybook-previous-history-empty">
                            No history available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 