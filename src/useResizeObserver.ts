import { useEffect, useRef, useState } from "react";

export type UseResizeObserver<T extends HTMLElement = HTMLElement> = {
    ref: React.RefObject<T | null>;
    dimensions: { width: number; height: number };
}

export const useResizeObserver = <T extends HTMLElement = HTMLElement>(): UseResizeObserver<T> => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const ref = useRef<T>(null);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect) {
                    setDimensions({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height
                    });
                }
            }
        });

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
            observer.disconnect();
        };
    }, []);

    return { ref, dimensions };
};
