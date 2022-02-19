/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize(): void {
            // Set window width/height to state
            setWindowSize({
                // @ts-ignore
                width: window.innerWidth,
                // @ts-ignore
                height: window.innerHeight
            });
        }
        // Add event listener
        window.addEventListener('resize', handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
};

export default useWindowSize;
