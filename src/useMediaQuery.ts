import { useEffect, useState } from 'react';

/**
 * A hook that tracks whether a CSS media query matches the current window state.
 * Useful for implementing responsive behavior in components.
 * 
 * @param query - The media query string to match against (e.g., '(max-width: 768px)')
 * @returns A boolean indicating whether the media query matches
 * 
 * @example
 * ```tsx
 * // Basic responsive layout
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * return (
 *   <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *     {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Multiple breakpoints
 * const isSmall = useMediaQuery('(max-width: 640px)');
 * const isMedium = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
 * const isLarge = useMediaQuery('(min-width: 1025px)');
 * 
 * // Complex responsive behavior
 * const isPortrait = useMediaQuery('(orientation: portrait)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 * 
 * return (
 *   <div>
 *     {isSmall && <SmallScreenContent />}
 *     {isMedium && <MediumScreenContent />}
 *     {isLarge && <LargeScreenContent />}
 *     {isPortrait && <PortraitWarning />}
 *     {prefersReducedMotion && <StaticVersion />}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
} 