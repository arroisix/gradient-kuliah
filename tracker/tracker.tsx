import { useRouter } from 'next/router';
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useLayoutEffect,
    useState
} from 'react';

const LANDING_PAGE_REVAMP_NOV_2023 = [
    '/landing-revamp',
    '/komunitas/public',
    '/komunitas/[id]',
    '/dashboard'
];

export interface Tracker {
    trackPageView(pageName: string, query?: Record<string, unknown>): void;
    identify(info: {
        email: string;
        fullName: string;
        phoneNumber: string;
        isSubscribed: boolean;
    }): void;
    reset(): void;
    genericTrack(eventName: string, payload?: Record<string, unknown>): void;
    trackButtonClick(
        eventName: string,
        buttonTextContent: string,
        payload?: Record<string, unknown>
    ): void;
    trackAttemptFormSubmit(
        eventName: string,
        formPayload: Record<string, unknown>,
        payload?: Record<string, unknown>
    ): void;
}

const useTrackPageView = (
    tracker: Tracker,
    pageComponentName: string
): void => {
    const [firstPageVisit, setFirstPageVisit] = useState(false);
    const router = useRouter();

    useLayoutEffect(() => {
        let eventPayload = router.query;
        if (LANDING_PAGE_REVAMP_NOV_2023.includes(router.pathname))
            eventPayload = { ...eventPayload, Variant: 'NOV 2023' };

        // track initial page visit
        if (!firstPageVisit && router.isReady && pageComponentName) {
            tracker.trackPageView(pageComponentName, eventPayload);
            setFirstPageVisit(true);
        }

        // track subsequent page visit
        const handleRouteChange = (): void => {
            if (router.isReady && pageComponentName) {
                tracker.trackPageView(pageComponentName, eventPayload);
            }
        };
        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [
        tracker,
        router.events,
        router.isReady,
        pageComponentName,
        router.query
    ]);
};

const TrackerContext = createContext<Tracker | null>(null);

export function useTracker(): Tracker | null {
    return useContext(TrackerContext);
}

export function TrackerProvider({
    children,
    initialTracker,
    pageComponentName
}: PropsWithChildren<{
    initialTracker: Tracker;
    pageComponentName: string;
}>): JSX.Element {
    const [tracker] = useState(initialTracker);

    useTrackPageView(tracker, pageComponentName);

    return (
        <TrackerContext.Provider value={tracker}>
            {children}
        </TrackerContext.Provider>
    );
}
