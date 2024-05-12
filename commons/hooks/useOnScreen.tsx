import { useState, useEffect } from 'react';

export default function useOnScreen(
    ref: { current: unknown } | null,
    rootMargin = '0px'
): boolean {
    if (typeof window !== 'undefined') {
        const [isIntersecting, setIntersecting] = useState(false);

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update our state when observer callback fires
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin
            }
        );

        if (!ref) return false;

        useEffect(() => {
            observer?.observe(ref?.current as Element);
            // Remove the observer as soon as the component is unmounted
            return () => {
                observer?.disconnect();
            };
        }, []);

        return isIntersecting;
    }

    return false;
}
