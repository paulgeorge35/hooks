import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type WindowSize = {
  /** Current window width in pixels */
  width: number;
  /** Current window height in pixels */
  height: number;
  /** Whether the window is in landscape orientation */
  isLandscape?: boolean;
  /** Whether the window is in portrait orientation */
  isPortrait?: boolean;
  /** Window aspect ratio (width / height) */
  aspectRatio?: number;
};

export type UseWindowSizeOptions = {
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
  /** Whether to include orientation and aspect ratio calculations */
  includeOrientation?: boolean;
  /** Initial size to use before window measurements are available */
  initialSize?: Partial<WindowSize>;
  /** Callback when window size changes */
  onChange?: (size: WindowSize) => void;
};

/**
 * A hook that returns the current window dimensions with additional features
 * like debouncing, orientation detection, and aspect ratio calculation.
 * 
 * @param options - Configuration options
 * @returns An object containing window dimensions and derived values
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { width, height } = useWindowSize();
 * 
 * return (
 *   <div>
 *     Window size: {width} x {height}
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Advanced usage with all features
 * const { 
 *   width, 
 *   height, 
 *   isLandscape, 
 *   isPortrait,
 *   aspectRatio 
 * } = useWindowSize({
 *   debounceDelay: 250,
 *   includeOrientation: true,
 *   onChange: (size) => console.log('Window resized:', size)
 * });
 * 
 * return (
 *   <div>
 *     <p>Dimensions: {width} x {height}</p>
 *     <p>Orientation: {isLandscape ? 'Landscape' : 'Portrait'}</p>
 *     <p>Aspect Ratio: {aspectRatio.toFixed(2)}</p>
 *   </div>
 * );
 * ```
 */
export function useWindowSize({
  debounceDelay = 250,
  includeOrientation = true,
  initialSize = {},
  onChange,
}: UseWindowSizeOptions = {}): WindowSize {
  // Initialize state with SSR-safe values merged with initialSize
  const [size, setSize] = useState<WindowSize>(() => {
    const width = typeof window === 'undefined' ? 0 : window.innerWidth;
    const height = typeof window === 'undefined' ? 0 : window.innerHeight;
    const aspectRatio = width / height;

    return {
      width,
      height,
      isLandscape: width > height,
      isPortrait: height > width,
      aspectRatio,
      ...initialSize,
    };
  });

  // Memoize the resize handler to prevent unnecessary re-renders
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    const newSize: WindowSize = {
      width,
      height,
      isLandscape: includeOrientation ? width  > height : undefined,
      isPortrait: includeOrientation ? height  > width : undefined,
      aspectRatio: includeOrientation ? aspectRatio : undefined,
    };

    setSize(newSize);
    onChange?.(newSize);
  }, [includeOrientation, onChange]);

  // Debounced resize handler
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedHandleResize = useCallback((_event: Event) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(handleResize, debounceDelay);
  }, [handleResize, debounceDelay]);

  // Set up resize listener with cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial size calculation
    handleResize();

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [handleResize, debouncedHandleResize]);

  // Memoize the size object to prevent unnecessary re-renders
  return useMemo(() => size, [size]);
} 