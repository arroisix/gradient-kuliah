import { RefObject, useEffect, useRef, useState } from 'react';

const useElementSize = <T extends HTMLElement>(): {
    height: number;
    width: number;
    ref: RefObject<T>;
} => {
    const elementRef = useRef<T>(null);
    const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const getElementSize = (): void => {
            if (elementRef.current) {
                const width = elementRef.current.clientWidth;
                const height = elementRef.current.clientHeight;
                setSize({ width, height });
            }
        };

        // Call the function initially
        getElementSize();

        // Update the size when the window is resized
        const resizeObserver = new ResizeObserver(getElementSize);
        if (elementRef.current) {
            resizeObserver.observe(elementRef.current);
        }

        // Cleanup observer on unmount
        return () => {
            if (elementRef.current) {
                resizeObserver.unobserve(elementRef.current);
            }
        };
    }, []);

    return { height, width, ref: elementRef };
};

export default useElementSize;
