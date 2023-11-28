import { useGrowthBook } from '@growthbook/growthbook-react';
import { getCookieValue } from 'commons/utils';
import { growthbook } from 'library/growthbook';
import { useRouter } from 'next/router';
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState
} from 'react';

const LANDING_PAGE_JUN_2023 = [
    '/',
    '/komunitas',
    '/komunitas/[id]',
    '/dashboard'
];
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
        payload?: Record<string, unknown> | unknown
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
    const growthbook = useGrowthBook<GrowthbookFeatures>();
    const isLandingPageRevampOn = growthbook?.isOn('landing-page-revamp');

    const eventPayloadBuilder = useMemo(
        () => (): Record<string, unknown> => {
            const eventPayload: Record<string, unknown> = {
                'Page Query': router.query
            };

            const isNov2023Revamp =
                LANDING_PAGE_REVAMP_NOV_2023.includes(router.pathname) &&
                isLandingPageRevampOn;
            const isJun2023Revamp =
                LANDING_PAGE_JUN_2023.includes(router.pathname) &&
                !isLandingPageRevampOn;

            if (isNov2023Revamp) {
                eventPayload['Variant'] = 'NOV 2023';
            } else if (isJun2023Revamp) {
                eventPayload['Variant'] = 'JUN 2023';
            }

            return eventPayload;
        },
        [router.query, router.pathname, isLandingPageRevampOn]
    );

    useLayoutEffect(() => {
        // track initial page visit
        if (
            !firstPageVisit &&
            router.isReady &&
            growthbook?.ready &&
            pageComponentName
        ) {
            tracker.trackPageView(pageComponentName, eventPayloadBuilder());
            setFirstPageVisit(true);
        }

        // track subsequent page visit
        const handleRouteChange = (): void => {
            if (router.isReady && pageComponentName) {
                tracker.trackPageView(pageComponentName, eventPayloadBuilder());
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
        growthbook?.ready,
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

    useEffect(() => {
        growthbook.loadFeatures();
        growthbook.setAttributes({ id: getCookieValue('visitor_id') });
    }, []);

    useTrackPageView(tracker, pageComponentName);

    return (
        <TrackerContext.Provider value={tracker}>
            {children}
        </TrackerContext.Provider>
    );
}
