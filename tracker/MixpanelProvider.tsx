import { Tracker, TrackerProvider } from './tracker';
import mixpanel, { OverridedMixpanel } from 'mixpanel-browser';
import { PropsWithChildren } from 'react';

class MixpanelTracker implements Tracker {
    mixpanelInstance: OverridedMixpanel;

    constructor() {
        if (typeof window !== 'undefined') {
            if (
                process.env.NEXT_PUBLIC_MIXPANEL_KEY &&
                process.env.NEXT_PUBLIC_NODE_ENV !== 'local'
            ) {
                mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY, {
                    persistence: 'localStorage',
                    track_pageview: false,
                    debug: process.env.NEXT_PUBLIC_ENV !== 'prod'
                });
            }
        }

        this.mixpanelInstance = mixpanel;
    }

    trackPageView(): void {
        this.mixpanelInstance.track_pageview();
    }

    identify(email: string, isSubscribed: boolean): void {
        this.mixpanelInstance.identify(email);
        this.mixpanelInstance.people.set({ Subscribed: isSubscribed });
    }

    reset(): void {
        this.mixpanelInstance.reset();
    }
}

const trackerInstance = new MixpanelTracker();

export function MixpanelProvider({ children }: PropsWithChildren): JSX.Element {
    return (
        <TrackerProvider initialTracker={trackerInstance}>
            {children}
        </TrackerProvider>
    );
}
