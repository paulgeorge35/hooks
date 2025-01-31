// biome-ignore lint/style/useImportType: <explanation>
import React, { useState } from 'react';
import { useStack } from '../useStack';
import './index.css';

type StackItem = {
    id: number;
    value: string;
    timestamp: string;
};

export const UseStack: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [batchInput, setBatchInput] = useState('');
    const [popCount, setPopCount] = useState(1);

    const {
        stack,
        push,
        pushMany,
        pop,
        popMany,
        peek,
        clear,
        reset,
        size,
        isEmpty
    } = useStack<StackItem>({
        maxSize: 10,
        onPush: (items) => console.log('Pushed:', items),
        onPop: (items) => console.log('Popped:', items)
    });

    const handlePush = () => {
        if (!inputValue.trim()) return;
        
        push({
            id: Date.now(),
            value: inputValue,
            timestamp: new Date().toLocaleTimeString()
        });
        setInputValue('');
    };

    const handlePushMany = () => {
        if (!batchInput.trim()) return;
        
        const items = batchInput.split(',').map(value => ({
            id: Date.now() + Math.random(),
            value: value.trim(),
            timestamp: new Date().toLocaleTimeString()
        }));
        
        pushMany(items);
        setBatchInput('');
    };

    const handlePopMany = () => {
        popMany(popCount);
    };

    const topItem = peek();

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Stack Demo</h2>
            <div className="storybook-content-use-stack">
                <div className="storybook-stack-controls">
                    <div className="storybook-stack-input-group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter a value..."
                            className="storybook-stack-input"
                            data-testid="singleInput"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handlePush();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handlePush}
                            className="storybook-stack-button"
                            data-testid="pushButton"
                        >
                            Push
                        </button>
                    </div>

                    <div className="storybook-stack-input-group">
                        <input
                            type="text"
                            value={batchInput}
                            onChange={(e) => setBatchInput(e.target.value)}
                            placeholder="Enter comma-separated values..."
                            className="storybook-stack-input"
                            data-testid="batchInput"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handlePushMany();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handlePushMany}
                            className="storybook-stack-button"
                            data-testid="pushManyButton"
                        >
                            Push Many
                        </button>
                    </div>

                    <div className="storybook-stack-input-group">
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={popCount}
                            onChange={(e) => setPopCount(Number(e.target.value))}
                            className="storybook-stack-input storybook-stack-input-small"
                            data-testid="popCountInput"
                        />
                        <button
                            type="button"
                            onClick={handlePopMany}
                            className="storybook-stack-button"
                            data-testid="popManyButton"
                        >
                            Pop Many
                        </button>
                        <button
                            type="button"
                            onClick={() => pop()}
                            className="storybook-stack-button"
                            data-testid="popButton"
                        >
                            Pop
                        </button>
                    </div>

                    <div className="storybook-stack-button-group">
                        <button
                            type="button"
                            onClick={clear}
                            className="storybook-stack-button"
                            data-testid="clearButton"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="storybook-stack-button"
                            data-testid="resetButton"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="storybook-stack-status">
                    <div data-testid="stackSize">
                        Size: <span className="storybook-stack-value">{size}</span>
                    </div>
                    <div data-testid="stackEmpty">
                        Empty: <span className="storybook-stack-value">{isEmpty ? 'Yes' : 'No'}</span>
                    </div>
                    <div data-testid="stackTop">
                        Top Item: <span className="storybook-stack-value">{topItem ? topItem.value : 'None'}</span>
                    </div>
                </div>

                <div className="storybook-stack-items" data-testid="stackItems">
                    <h3>Stack Items (Top to Bottom):</h3>
                    {stack.length === 0 ? (
                        <div className="storybook-stack-empty">Stack is empty</div>
                    ) : (
                        <div className="storybook-stack-list">
                            {stack.map((item, index) => (
                                <div key={item.id} className="storybook-stack-item">
                                    <span className="storybook-stack-item-index">{index + 1}.</span>
                                    <span className="storybook-stack-item-value">{item.value}</span>
                                    <span className="storybook-stack-item-timestamp">{item.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 