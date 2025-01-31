import React from 'react';
import { useResizeObserver } from '../useResizeObserver';

export const UseResizeObserver = () => {
  const { ref, dimensions, isObserving } = useResizeObserver<HTMLDivElement>({
    immediate: true,
    useBorderBox: true,
    debounceDelay: 250,
  });

  return (
    <div className="storybook-article">
      <h2 className="storybook-header">Resize Observer Demo</h2>
      <div className="storybook-content-use-resize-observer">
        <div className="storybook-resize-observer-section">
          <h3>Resizable Element</h3>
          <div
            data-testid="resize-example"
            ref={ref}
            className="storybook-resize-observer-box"
          >
            <p>Resize me using the bottom-right corner!</p>
            <div className="storybook-resize-observer-dimensions">
              <div className="storybook-resize-observer-item" data-testid="width">
                <span className="label">Width:</span>
                <span className="value">{Math.round(dimensions.width)}px</span>
              </div>
              <div className="storybook-resize-observer-item" data-testid="height">
                <span className="label">Height:</span>
                <span className="value">{Math.round(dimensions.height)}px</span>
              </div>
            </div>
          </div>
        </div>

        <div className="storybook-resize-observer-section">
          <h3>Box Sizes</h3>
          <div className="storybook-resize-observer-list">
            <div className="storybook-resize-observer-item" data-testid="borderBox">
              <span className="label">Border Box:</span>
              <span className="value">
                {dimensions.borderBoxSize[0]?.inlineSize.toFixed(0)}px × {dimensions.borderBoxSize[0]?.blockSize.toFixed(0)}px
              </span>
            </div>
            <div className="storybook-resize-observer-item" data-testid="contentBox">
              <span className="label">Content Box:</span>
              <span className="value">
                {dimensions.contentBoxSize[0]?.inlineSize.toFixed(0)}px × {dimensions.contentBoxSize[0]?.blockSize.toFixed(0)}px
              </span>
            </div>
          </div>
        </div>

        <div className="storybook-resize-observer-section">
          <h3>Observer Status</h3>
          <div className="storybook-resize-observer-list">
            <div className={`storybook-resize-observer-item ${isObserving ? 'active' : ''}`} data-testid="observing">
              <span className="label">Observing:</span>
              <span className="value">{isObserving ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="storybook-resize-observer-note">
          <p>Note: Changes are debounced by 250ms for better performance.</p>
        </div>
      </div>
    </div>
  );
}; 