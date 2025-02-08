import React from 'react';
import { useVisibility } from '../useVisibility';

export const UseVisibility = () => {
  const { ref, isVisible, isTracking } = useVisibility<HTMLDivElement>({
    delay: 100,
    once: false,
    threshold: 100,
  }, (state) => {
    console.log('Visibility changed:', state.isVisible);
  });

  return (
    <div className="storybook-article">
      <h2 className="storybook-header">Visibility Observer Demo</h2>
      <div className="storybook-content-use-visibility">
        <div className="storybook-visibility-section">
          <h3>Scroll to Test Visibility</h3>
          <div className="storybook-visibility-container">
            <div className="storybook-visibility-spacer">
              <p>👇 Scroll down to see the tracked element 👇</p>
            </div>

            <div
              ref={ref}
              data-testid="visibility-target"
              className={`storybook-visibility-target ${isVisible ? 'visible' : ''}`}
            >
              <div className="storybook-visibility-content">
                <h4>Tracked Element</h4>
                <div className="storybook-visibility-status">
                  <div className="storybook-visibility-item" data-testid="visibility-status">
                    <span className="label">Status:</span>
                    <span className={`value ${isVisible ? 'visible' : 'hidden'}`}>
                      {isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <div className="storybook-visibility-item" data-testid="tracking-status">
                    <span className="label">Tracking:</span>
                    <span className={`value ${isTracking ? 'active' : 'inactive'}`}>
                      {isTracking ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="storybook-visibility-spacer">
              <p>👆 Scroll up to hide the tracked element 👆</p>
            </div>
          </div>
        </div>

        <div className="storybook-visibility-note">
          <p>Note: The element visibility is checked with a 100ms delay and 50% visibility threshold.</p>
        </div>
      </div>
    </div>
  );
}; 