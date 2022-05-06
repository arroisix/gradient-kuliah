declare global {
    interface Window {
        gtag: any;
    }
}

// log the pageview with their URL
export const pageview = (url: string): void => {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url
    });
};

// log specific events happening.
export const trackGAEvent = (action: string): void => {
    window.gtag('event', action, {});
};
