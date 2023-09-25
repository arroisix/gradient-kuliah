import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useState
} from 'react';
import useTrackPageView from './useTrackPageView';

export interface Tracker {
    trackPageView(): void;
    identify(email: string, isSubscribed: boolean): void;
    reset(): void;
}

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
