import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Tracker } from './tracker';

export const useTrackPageView = (tracker: Tracker) => {
    const router = useRouter();

    // Track first page visit
    useEffect(() => {
        tracker.trackPageView();
    }, []);

    // Track consecutive page visit
    useEffect(() => {
        const handleRouteChange = () => {
            tracker.trackPageView();
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);
};

export default useTrackPageView;
