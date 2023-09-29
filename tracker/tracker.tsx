import { useRouter } from 'next/router';
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState
} from 'react';

export interface Tracker {
    trackPageView(query?: Record<string, any>): void;
    identify(info: {
        email: string;
        fullName: string;
        phoneNumber: string;
        isSubscribed: boolean;
    }): void;
    reset(): void;
    genericTrack(eventName: string, payload?: Record<string, any>): void;
    trackButtonClick(
        eventName: string,
        buttonTextContent: string,
        payload?: Record<string, any>
    ): void;
    trackAttemptFormSubmit(
        eventName: string,
        formPayload: Record<string, any>,
        payload?: Record<string, any>
    ): void;
}

const useTrackPageView = (tracker: Tracker): void => {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            tracker.trackPageView(router.query);
        }
    }, [tracker, router.isReady]);

    useEffect(() => {
        // track subsequent page visit
        const handleRouteChange = () => {
            if (router.isReady) {
                tracker.trackPageView(router.query);
            }
        };
        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [tracker, router.events, router.isReady]);
};

const TrackerContext = createContext<Tracker | null>(null);

export function useTracker(): Tracker | null {
    return useContext(TrackerContext);
}

export function TrackerProvider({
    children,
    initialTracker
}: PropsWithChildren<{
    initialTracker: Tracker;
}>): JSX.Element {
    const [tracker] = useState(initialTracker);

    useTrackPageView(tracker);

    return (
        <TrackerContext.Provider value={tracker}>
            {children}
        </TrackerContext.Provider>
    );
}
