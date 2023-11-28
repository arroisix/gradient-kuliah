import { Tracker, TrackerProvider } from './tracker';
import mixpanel, { OverridedMixpanel } from 'mixpanel-browser';
import { PropsWithChildren } from 'react';

class MixpanelTracker implements Tracker {
    mixpanelInstance?: OverridedMixpanel;

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
                this.mixpanelInstance = mixpanel;
            }
        }
    }

    trackPageView(
        pageName: string,
        eventPayload?: Record<string, unknown>
    ): void {
        this.mixpanelInstance?.track_pageview(
            {
                Page: pageName,
                ...eventPayload
            },
            // This feature is undocumented, so the type is missing
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            { event_name: `Visit ${pageName} Page` }
        );
    }

    identify({
        email,
        isSubscribed,
        fullName,
        phoneNumber
    }: {
        email: string;
        fullName: string;
        phoneNumber: string;
        isSubscribed: boolean;
    }): void {
        this.mixpanelInstance?.identify(email);
        this.mixpanelInstance?.people.set({
            $email: email,
            $name: fullName,
            $phone: phoneNumber,
            Subscribed: isSubscribed
        });
    }

    reset(): void {
        this.mixpanelInstance?.reset();
    }

    genericTrack(
        eventName: string,
        payload?: Record<string, unknown> | undefined
    ): void {
        this.mixpanelInstance?.track(eventName, payload);
    }

    trackButtonClick(
        eventName: string,
        buttonTextContent: string,
        payload?: Record<string, unknown>
    ): void {
        this.genericTrack(`[BUTTON CLICK]: ${eventName}`, {
            ...(payload ?? {}),
            'Button Content': buttonTextContent
        });
    }

    trackAttemptFormSubmit(
        eventName: string,
        formPayload: Record<string, unknown>,
        payload: Record<string, unknown> = {}
    ): void {
        this.genericTrack(`[FORM SUBMIT ATTEMPT]: ${eventName}`, {
            'Form Data': formPayload,
            ...payload
        });
    }
}

const trackerInstance = new MixpanelTracker();

export function MixpanelProvider({
    children,
    pageComponentName
}: PropsWithChildren<{ pageComponentName: string }>): JSX.Element {
    return (
        <TrackerProvider
            initialTracker={trackerInstance}
            pageComponentName={pageComponentName}>
            {children}
        </TrackerProvider>
    );
}
