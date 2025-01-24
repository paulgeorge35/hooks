import React, { useState } from 'react';
import { useCopyToClipboard } from '../useCopyToClipboard';
import './index.css';

export const UseCopyToClipboard = () => {
    const [text, setText] = useState('Hello, World!');
    const [isCopied, setIsCopied] = useState(false);
    
    const onSuccess = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };
    const onError = () => {
        setIsCopied(false);
    };
    const { copy, isLoading, error } = useCopyToClipboard({ onSuccess, onError });

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Copy to Clipboard Demo</h2>
            <div className="storybook-content-use-copy">
                <div className="storybook-copy-input-group">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to copy"
                        className="storybook-copy-input"
                        data-testid="input"
                    />
                    <button
                        type="button"
                        onClick={() => copy(text)}
                        className="storybook-copy-button"
                        disabled={isLoading}
                        data-testid="copyButton"
                    >
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                {error && (
                    <p className="storybook-copy-error" data-testid="error">{error.message}</p>
                )}
            </div>
        </div>
    );
}; 