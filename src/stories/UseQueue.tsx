// biome-ignore lint/style/useImportType: <explanation>
import React, { useState } from 'react';
import { useQueue } from '../useQueue';
import './index.css';

type QueueItem = {
    id: number;
    value: string;
    timestamp: string;
};

export const UseQueue: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [batchInput, setBatchInput] = useState('');
    const [dequeueCount, setDequeueCount] = useState(1);

    const {
        queue,
        enqueue,
        enqueueMany,
        dequeue,
        dequeueMany,
        clear,
        reset,
        size,
        isEmpty
    } = useQueue<QueueItem>({
        maxSize: 10,
        onEnqueue: (items) => console.log('Enqueued:', items),
        onDequeue: (items) => console.log('Dequeued:', items)
    });

    const handleEnqueue = () => {
        if (!inputValue.trim()) return;

        enqueue({
            id: Date.now(),
            value: inputValue,
            timestamp: new Date().toLocaleTimeString()
        });
        setInputValue('');
    };

    const handleEnqueueMany = () => {
        if (!batchInput.trim()) return;

        const items = batchInput.split(',').map(value => ({
            id: Date.now() + Math.random(),
            value: value.trim(),
            timestamp: new Date().toLocaleTimeString()
        }));

        enqueueMany(items);
        setBatchInput('');
    };

    const handleDequeueMany = () => {
        dequeueMany(dequeueCount);
    };

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Queue Demo</h2>
            <div className="storybook-content-use-queue">
                <div className="storybook-queue-controls">
                    <div className="storybook-queue-input-group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter a value..."
                            className="storybook-queue-input"
                            data-testid="singleInput"
                        />
                        <button
                            type="button"
                            onClick={handleEnqueue}
                            className="storybook-queue-button"
                            data-testid="enqueueButton"
                        >
                            Enqueue
                        </button>
                    </div>

                    <div className="storybook-queue-input-group">
                        <input
                            type="text"
                            value={batchInput}
                            onChange={(e) => setBatchInput(e.target.value)}
                            placeholder="Enter comma-separated values..."
                            className="storybook-queue-input"
                            data-testid="batchInput"
                        />
                        <button
                            type="button"
                            onClick={handleEnqueueMany}
                            className="storybook-queue-button"
                            data-testid="enqueueManyButton"
                        >
                            Enqueue Many
                        </button>
                    </div>

                    <div className="storybook-queue-input-group">
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={dequeueCount}
                            onChange={(e) => setDequeueCount(Number(e.target.value))}
                            className="storybook-queue-input storybook-queue-input-small"
                            data-testid="dequeueCountInput"
                        />
                        <button
                            type="button"
                            onClick={handleDequeueMany}
                            className="storybook-queue-button"
                            data-testid="dequeueManyButton"
                        >
                            Dequeue Many
                        </button>
                        <button
                            type="button"
                            onClick={() => dequeue()}
                            className="storybook-queue-button"
                            data-testid="dequeueButton"
                        >
                            Dequeue
                        </button>
                    </div>

                    <div className="storybook-queue-button-group">
                        <button
                            type="button"
                            onClick={clear}
                            className="storybook-queue-button"
                            data-testid="clearButton"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="storybook-queue-button"
                            data-testid="resetButton"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="storybook-queue-status">
                    <div data-testid="queueSize">
                        Size: <span className="storybook-queue-value">{size}</span>
                    </div>
                    <div data-testid="queueEmpty">
                        Empty: <span className="storybook-queue-value">{isEmpty ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                <div className="storybook-queue-items" data-testid="queueItems">
                    <h3>Queue Items:</h3>
                    {queue.length === 0 ? (
                        <div className="storybook-queue-empty">Queue is empty</div>
                    ) : (
                        <div className="storybook-queue-list">
                            {queue.map((item, index) => (
                                <div key={item.id} className="storybook-queue-item">
                                    <span className="storybook-queue-item-index">{index + 1}.</span>
                                    <span className="storybook-queue-item-value">{item.value}</span>
                                    <span className="storybook-queue-item-timestamp">{item.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 