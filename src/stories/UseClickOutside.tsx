import React, { useCallback, useState } from 'react';
import { useBoolean } from '../useBoolean';
import { type UseClickOutsideProps, useClickOutside } from '../useClickOutside';
import './index.css';

export const UseClickOutside = ({
    exceptionElements,
    exceptionClassNames = [],
    exceptionIds = [],
    listenToTouchEvents = true,
}: UseClickOutsideProps) => {
    const modal = useBoolean(false);
    const [clickCount, setClickCount] = useState(0);
    const [lastClickType, setLastClickType] = useState<string>('');

    const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
        modal.setFalse();
        setClickCount(prev => prev + 1);
        setLastClickType(event.type);
    }, [modal]);

    const { ref, triggerRef } = useClickOutside(handleClickOutside, {
        exceptionElements,
        exceptionClassNames,
        exceptionIds,
        listenToTouchEvents,
    });

    return (
        <div className="storybook-content-use-click-outside">
            <div className="storybook-click-outside-status">
                <div data-testid="status">Status: {modal.value ? 'Open' : 'Closed'}</div>
                <div data-testid="clickCount">Outside Clicks: {clickCount}</div>
                <div data-testid="lastClickType">Last Click Type: {lastClickType}</div>
            </div>

            <button
                id="openButton"
                type="button"
                ref={triggerRef}
                onClick={() => modal.setTrue()}
                className="storybook-click-outside-button storybook-click-outside-button-open"
                data-testid="openButton"
            >
                Open Modal
            </button>

            {modal.value && (
                <div
                    ref={ref}
                    className="storybook-click-outside-modal"
                    data-testid="modal"
                >
                    <h2 className="storybook-click-outside-modal-title">Modal Content</h2>
                    <p className="storybook-click-outside-modal-content">Click outside to close</p>
                    <button
                        type="button"
                        onClick={() => modal.setFalse()}
                        className="storybook-click-outside-button storybook-click-outside-button-close"
                        data-testid="closeButton"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}; 