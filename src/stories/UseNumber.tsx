import React from 'react';
import { useNumber } from '../useNumber';
import './index.css';

export const UseNumber = () => {
    const {
        value,
        setValue,
        increase,
        decrease,
        isAtMin,
        isAtMax,
        isChanging,
        delta,
    } = useNumber(0, {
        min: -10,
        max: 10,
        step: 1,
        precision: 0,
    });

    const {
        value: floatValue,
        setValue: setFloatValue,
        increase: increaseFloat,
        decrease: decreaseFloat,
        isAtMin: isFloatAtMin,
        isAtMax: isFloatAtMax,
    } = useNumber(0, {
        min: -5.5,
        max: 5.5,
        step: 0.5,
        precision: 1,
        float: true,
    });

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Number Control Demo</h2>
            <div className="storybook-content-use-number">
                <div className="storybook-number-section">
                    <h3>Integer Number Control</h3>
                    <div className="storybook-number-display">
                        <div className="storybook-number-value" data-testid="integerValue">
                            Current Value: {value}
                        </div>
                        <div className="storybook-number-status">
                            <span className={isAtMin ? 'active' : ''}>At Minimum</span>
                            <span className={isAtMax ? 'active' : ''}>At Maximum</span>
                            <span className={isChanging ? 'active' : ''}>Changing</span>
                            {delta !== 0 && <span className="delta">Delta: {delta}</span>}
                        </div>
                    </div>
                    <div className="storybook-number-controls">
                        <button 
                            type="button"
                            onClick={() => decrease()}
                            disabled={isAtMin}
                            className="storybook-number-button"
                            data-testid="integerDecrement"
                        >
                            -1
                        </button>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                            min={-10}
                            max={10}
                            className="storybook-number-input"
                            data-testid="integerInput"
                        />
                        <button 
                            type="button"
                            onClick={() => increase()}
                            disabled={isAtMax}
                            className="storybook-number-button"
                            data-testid="integerIncrement"
                        >
                            +1
                        </button>
                    </div>
                </div>

                <div className="storybook-number-section">
                    <h3>Float Number Control</h3>
                    <div className="storybook-number-display">
                        <div className="storybook-number-value" data-testid="floatValue">
                            Current Value: {floatValue}
                        </div>
                        <div className="storybook-number-status">
                            <span className={isFloatAtMin ? 'active' : ''}>At Minimum</span>
                            <span className={isFloatAtMax ? 'active' : ''}>At Maximum</span>
                        </div>
                    </div>
                    <div className="storybook-number-controls">
                        <button 
                            type="button"
                            onClick={() => decreaseFloat()}
                            disabled={isFloatAtMin}
                            className="storybook-number-button"
                            data-testid="floatDecrement"
                        >
                            -0.5
                        </button>
                        <input
                            type="number"
                            value={floatValue}
                            onChange={(e) => setFloatValue(Number(e.target.value))}
                            min={-5.5}
                            max={5.5}
                            step={0.5}
                            className="storybook-number-input"
                            data-testid="floatInput"
                        />
                        <button 
                            type="button"
                            onClick={() => increaseFloat()}
                            disabled={isFloatAtMax}
                            className="storybook-number-button"
                            data-testid="floatIncrement"
                        >
                            +0.5
                        </button>
                    </div>
                </div>

                <div className="storybook-number-note">
                    <p>Note: Use the buttons or input field to change values. The controls respect min/max bounds and step sizes.</p>
                </div>
            </div>
        </div>
    );
}; 