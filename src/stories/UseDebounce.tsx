import React, { useState } from 'react';
import { useDebounce } from '../useDebounce';
import './index.css';

type Update = {
    id: number;
    text: string;
};

export const UseDebounce = () => {
    const [inputValue, setInputValue] = useState('');
    const [updates, setUpdates] = useState<Update[]>([]);

    const onUpdate = (value: string) => {
        setUpdates(prev => [...prev, {
            id: Date.now(),
            text: `Updated to: ${value}`
        }].slice(-3).reverse());
    };

    const {
        value: debouncedValue,
        status,
        flush,
        cancel
    } = useDebounce<string>(inputValue, {
        delay: 1000,
        onUpdate,
    });

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Debounce Demo</h2>
            <div className="storybook-content-use-debounce">
                <div className="storybook-debounce-input-group">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type something..."
                        className="storybook-debounce-input"
                        data-testid="input"
                    />
                    <div className="storybook-debounce-button-group">
                        <button
                            type="button"
                            onClick={flush}
                            className="storybook-debounce-button"
                            data-testid="flushButton"
                        >
                            Update Now
                        </button>
                        <button
                            type="button"
                            onClick={cancel}
                            className="storybook-debounce-button"
                            data-testid="cancelButton"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                <div className="storybook-debounce-status">
                    <div data-testid="currentValue">
                        Current Value: <span className="storybook-debounce-value">{inputValue}</span>
                    </div>
                    <div data-testid="debouncedValue">
                        Debounced Value: <span className={debouncedValue ? 'storybook-debounce-value' : 'storybook-debounce-value-empty'}>{debouncedValue}</span>
                    </div>
                    <div data-testid="pendingStatus">
                        Status: <span className="storybook-debounce-status-text">{status}</span>
                    </div>
                    <div className="storybook-debounce-updates" data-testid="updates">
                        <h3>Recent Updates:</h3>
                        {updates.map(update => (
                            <div key={update.id} className="storybook-debounce-update">
                                {update.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}; 