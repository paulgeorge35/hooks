// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';

import { useBoolean } from '../useBoolean';
import './index.css';

export const UseBoolean = () => {
    const {
        value: isEnabled,
        setValue: setEnabled,
        toggle,
        setTrue,
        setFalse
    } = useBoolean(false);

    const {
        value: isActive,
        toggle: toggleActive,
        setTrue: activate,
        setFalse: deactivate
    } = useBoolean(true);

    const {
        value: isVisible,
        toggle: toggleVisibility,
        setTrue: show,
        setFalse: hide
    } = useBoolean(false);

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Boolean State Demo</h2>
            <div className="storybook-content-use-boolean">
                <div className="storybook-boolean-section">
                    <h3>Basic Toggle</h3>
                    <div className="storybook-boolean-status">
                        <div className="storybook-boolean-indicator" data-testid="enabledStatus">
                            <span className="label">Status: </span>
                            <span className={`value ${isEnabled ? 'true' : 'false'}`}>
                                {isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                    <div className="storybook-boolean-controls">
                        <button
                            type="button"
                            onClick={toggle}
                            className="storybook-boolean-button toggle"
                            data-testid="toggleButton"
                        >
                            Toggle
                        </button>
                        <button
                            type="button"
                            onClick={setTrue}
                            className="storybook-boolean-button enable"
                            disabled={isEnabled}
                            data-testid="enableButton"
                        >
                            Enable
                        </button>
                        <button
                            type="button"
                            onClick={setFalse}
                            className="storybook-boolean-button disable"
                            disabled={!isEnabled}
                            data-testid="disableButton"
                        >
                            Disable
                        </button>
                        <button
                            type="button"
                            onClick={() => setEnabled(true)}
                            className="storybook-boolean-button set"
                            data-testid="setTrueButton"
                        >
                            Set True
                        </button>
                        <button
                            type="button"
                            onClick={() => setEnabled(false)}
                            className="storybook-boolean-button set"
                            data-testid="setFalseButton"
                        >
                            Set False
                        </button>
                    </div>
                </div>

                <div className="storybook-boolean-section">
                    <h3>Active State</h3>
                    <div className="storybook-boolean-status">
                        <div className="storybook-boolean-indicator" data-testid="activeStatus">
                            <span className="label">Status: </span>
                            <span className={`value ${isActive ? 'true' : 'false'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    <div className="storybook-boolean-controls">
                        <button
                            type="button"
                            onClick={toggleActive}
                            className="storybook-boolean-button toggle"
                            data-testid="toggleActiveButton"
                        >
                            Toggle Active
                        </button>
                        <button
                            type="button"
                            onClick={activate}
                            className="storybook-boolean-button enable"
                            disabled={isActive}
                            data-testid="activateButton"
                        >
                            Activate
                        </button>
                        <button
                            type="button"
                            onClick={deactivate}
                            className="storybook-boolean-button disable"
                            disabled={!isActive}
                            data-testid="deactivateButton"
                        >
                            Deactivate
                        </button>
                    </div>
                </div>

                <div className="storybook-boolean-section">
                    <h3>Visibility Control</h3>
                    <div className="storybook-boolean-status">
                        <div className="storybook-boolean-indicator" data-testid="visibilityStatus">
                            <span className="label">Status: </span>
                            <span className={`value ${isVisible ? 'true' : 'false'}`}>
                                {isVisible ? 'Visible' : 'Hidden'}
                            </span>
                        </div>
                    </div>
                    <div className="storybook-boolean-controls">
                        <button
                            type="button"
                            onClick={toggleVisibility}
                            className="storybook-boolean-button toggle"
                            data-testid="toggleVisibilityButton"
                        >
                            Toggle Visibility
                        </button>
                        <button
                            type="button"
                            onClick={show}
                            className="storybook-boolean-button enable"
                            disabled={isVisible}
                            data-testid="showButton"
                        >
                            Show
                        </button>
                        <button
                            type="button"
                            onClick={hide}
                            className="storybook-boolean-button disable"
                            disabled={!isVisible}
                            data-testid="hideButton"
                        >
                            Hide
                        </button>
                    </div>
                </div>

                <div className="storybook-boolean-note">
                    <p>Note: Each section demonstrates different use cases for boolean state management. Try the various controls to see how they affect the state.</p>
                </div>
            </div>
        </div>
    );
};
