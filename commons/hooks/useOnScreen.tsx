import { useState, useEffect } from 'react';

export default function useOnScreen(ref: { current: Element }): boolean {
    if (typeof window !== 'undefined') {
        const [isIntersecting, setIntersecting] = useState(false);

        const observer = new IntersectionObserver(([entry]) =>
            setIntersecting(entry.isIntersecting)
        );

        useEffect(() => {
            observer?.observe(ref?.current);
            // Remove the observer as soon as the component is unmounted
            return () => {
                observer?.disconnect();
            };
        }, []);

        return isIntersecting;
    }

    return false;
}
