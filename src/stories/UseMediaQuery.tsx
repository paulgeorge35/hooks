import React from 'react';
import { useMediaQuery } from '../useMediaQuery';
import './index.css';

export const UseMediaQuery = () => {
    const {matches: isSmallScreen} = useMediaQuery('(max-width: 640px)');
    const {matches: isMediumScreen} = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
    const {matches: isLargeScreen} = useMediaQuery('(min-width: 1025px)');
    const {matches: prefersDark} = useMediaQuery('(prefers-color-scheme: dark)');
    const {matches: prefersLight} = useMediaQuery('(prefers-color-scheme: light)');
    const {matches: prefersReducedMotion} = useMediaQuery('(prefers-reduced-motion: reduce)');
    const {matches: isPortrait} = useMediaQuery('(orientation: portrait)');
    const {matches: isLandscape} = useMediaQuery('(orientation: landscape)');

    return (
        <div className="storybook-article">
            <h2 className="storybook-header">Media Query Demo</h2>
            <div className="storybook-content-use-media-query">
                <div className="storybook-media-query-section">
                    <h3>Screen Size</h3>
                    <div className="storybook-media-query-list">
                        <div className={`storybook-media-query-item ${isSmallScreen ? 'active' : ''}`} data-testid="smallScreen">
                            <span className="label">Small Screen (≤640px):</span>
                            <span className="value">{isSmallScreen ? 'Yes' : 'No'}</span>
                        </div>
                        <div className={`storybook-media-query-item ${isMediumScreen ? 'active' : ''}`} data-testid="mediumScreen">
                            <span className="label">Medium Screen (641px-1024px):</span>
                            <span className="value">{isMediumScreen ? 'Yes' : 'No'}</span>
                        </div>
                        <div className={`storybook-media-query-item ${isLargeScreen ? 'active' : ''}`} data-testid="largeScreen">
                            <span className="label">Large Screen (≥1025px):</span>
                            <span className="value">{isLargeScreen ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>

                <div className="storybook-media-query-section">
                    <h3>Color Scheme Preference</h3>
                    <div className="storybook-media-query-list">
                        <div className={`storybook-media-query-item ${prefersDark ? 'active' : ''}`} data-testid="darkMode">
                            <span className="label">Prefers Dark Mode:</span>
                            <span className="value">{prefersDark ? 'Yes' : 'No'}</span>
                        </div>
                        <div className={`storybook-media-query-item ${prefersLight ? 'active' : ''}`} data-testid="lightMode">
                            <span className="label">Prefers Light Mode:</span>
                            <span className="value">{prefersLight ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>

                <div className="storybook-media-query-section">
                    <h3>Accessibility</h3>
                    <div className="storybook-media-query-list">
                        <div className={`storybook-media-query-item ${prefersReducedMotion ? 'active' : ''}`} data-testid="reducedMotion">
                            <span className="label">Prefers Reduced Motion:</span>
                            <span className="value">{prefersReducedMotion ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>

                <div className="storybook-media-query-section">
                    <h3>Orientation</h3>
                    <div className="storybook-media-query-list">
                        <div className={`storybook-media-query-item ${isPortrait ? 'active' : ''}`} data-testid="portrait">
                            <span className="label">Portrait Mode:</span>
                            <span className="value">{isPortrait ? 'Yes' : 'No'}</span>
                        </div>
                        <div className={`storybook-media-query-item ${isLandscape ? 'active' : ''}`} data-testid="landscape">
                            <span className="label">Landscape Mode:</span>
                            <span className="value">{isLandscape ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>

                <div className="storybook-media-query-note">
                    <p>Note: Resize the window or change your system preferences to see the values update in real-time.</p>
                </div>
            </div>
        </div>
    );
}; 