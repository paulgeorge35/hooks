import { useCallback, useEffect, useRef } from "react";

export type ElementType = HTMLElement | HTMLDialogElement;

/** A ref object for the element to detect clicks outside of */
export type UseClickOutside<T extends ElementType = HTMLDivElement, S extends ElementType = HTMLButtonElement> = {
    ref: React.RefObject<T | null>;
    triggerRef: React.RefObject<S | null>;
}
const eventTypes = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchmove', 'touchend'] as const;

// Create a type from the `const` array
export type EventType = typeof eventTypes[number];

/** The callback function to be called when a click outside is detected */
export type UseClickOutsideCallback = (event: MouseEvent | TouchEvent) => void;

export type UseClickOutsideProps = {
    /** Optional class names to exclude from the click detection */
    exceptionClassNames?: ReadonlyArray<string>;
    /** Optional ids to exclude from the click detection */
    exceptionIds?: ReadonlyArray<string>;
    /** Optional element types to exclude from the click detection */
    exceptionElements?: ReadonlyArray<string>;
    /** Whether to listen for touch events in addition to mouse events
     * 
     * Defaults to true
     */
    listenToTouchEvents?: boolean;
    /** Optional event types to listen for 
     * 
     * Defaults to ['click'] if listenToTouchEvents is false,
     * or ['click', 'touchend'] if listenToTouchEvents is true
    */
    eventTypes?: EventType[];
};

/**
 * A hook that detects clicks outside of a specified element with improved event handling
 * and TypeScript support.
 * 
 * @template T - The type of HTML element to attach the ref to
 * @param {UseClickOutsideProps} props - The props object containing configuration options
 * @returns {UseClickOutside<T>} A ref object to be attached to the element
 * 
 * @example
 * ```tsx
 * // Basic usage with a div
 * const modalRef = useClickOutside<HTMLDivElement>({
 *   callback: (event) => setIsOpen(false)
 * });
 * 
 * return (
 *   <div ref={modalRef}>
 *     Modal Content
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Advanced usage with exceptions and touch events
 * const dropdownRef = useClickOutside<HTMLDivElement>({
 *   callback: () => closeDropdown(),
 *   exceptionClassNames: ['ignore-click'],
 *   exceptionIds: ['menu-button'],
 *   exceptionElements: ['button'],
 *   listenToTouchEvents: true,
 * });
 * ```
 */
export const useClickOutside = <T extends ElementType = HTMLDivElement, S extends ElementType = HTMLButtonElement>(
    callback: UseClickOutsideCallback,
    {
        exceptionClassNames = [],
        exceptionIds = [],
        exceptionElements = [],
        listenToTouchEvents = true,
        eventTypes = listenToTouchEvents ? ['click', 'touchend'] : ['click'],
    }: UseClickOutsideProps = {}): UseClickOutside<T, S> => {
    const ref = useRef<T>(null);
    const triggerRef = useRef<S>(null);

    const isExceptionTarget = useCallback((target: Element): boolean => {
        // Check if the target matches any exception criteria
        return (
            exceptionClassNames.some(className => target.classList.contains(className)) ||
            exceptionIds.some(id => target.id === id) ||
            exceptionElements.some(element => target.tagName.toLowerCase() === element.toLowerCase())
        );
    }, [exceptionClassNames, exceptionIds, exceptionElements]);

    const handleEvent = useCallback((event: MouseEvent | TouchEvent) => {
        const target = event.target as Element;

        if (!ref.current || !triggerRef.current) return;

        if (triggerRef.current === target) return;

        // Handle click inside
        if (ref.current?.contains(target)) {
            return;
        }

        // Check exceptions
        if (isExceptionTarget(target)) {
            return;
        }

        callback?.(event);
    }, [callback, isExceptionTarget]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const abortController = new AbortController();

        // Add mouse event listeners
        for (const type of eventTypes) {
            document.addEventListener(type, handleEvent, { signal: abortController.signal });
        }

        return () => {
            abortController.abort();
        };
    }, [handleEvent, eventTypes]);

    return { ref, triggerRef };
};