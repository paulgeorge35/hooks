import React from 'react';
import { useWindowSize } from '../useWindowSize';

export const UseWindowSize = () => {
  const { width, height, isLandscape, isPortrait, aspectRatio } = useWindowSize({
    debounceDelay: 250,
    includeOrientation: true,
  });

  return (
    <div className="storybook-article">
      <h2 className="storybook-header">Window Size Demo</h2>
      <div className="storybook-content-use-window-size">
        <div className="storybook-window-size-section">
          <h3>Dimensions</h3>
          <div className="storybook-window-size-list">
            <div className="storybook-window-size-item" data-testid="width">
              <span className="label">Width:</span>
              <span className="value">{width}px</span>
            </div>
            <div className="storybook-window-size-item" data-testid="height">
              <span className="label">Height:</span>
              <span className="value">{height}px</span>
            </div>
          </div>
        </div>

        <div className="storybook-window-size-section">
          <h3>Orientation</h3>
          <div className="storybook-window-size-list">
            <div className={`storybook-window-size-item ${isLandscape ? 'active' : ''}`} data-testid="landscape">
              <span className="label">Landscape Mode:</span>
              <span className="value">{isLandscape === undefined ? 'N/A' : isLandscape ? 'Yes' : 'No'}</span>
            </div>
            <div className={`storybook-window-size-item ${isPortrait ? 'active' : ''}`} data-testid="portrait">
              <span className="label">Portrait Mode:</span>
              <span className="value">{isPortrait === undefined ? 'N/A' : isPortrait ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="storybook-window-size-section">
          <h3>Aspect Ratio</h3>
          <div className="storybook-window-size-list">
            <div className="storybook-window-size-item" data-testid="aspectRatio">
              <span className="label">Aspect Ratio:</span>
              <span className="value">{aspectRatio ? aspectRatio.toFixed(2) : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="storybook-window-size-note">
          <p>Note: Resize the window to see the values update in real-time (with 250ms debounce).</p>
        </div>
      </div>
    </div>
  );
};