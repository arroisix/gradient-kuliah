import { Context, GrowthBook } from '@growthbook/growthbook-react';

export const growthbook = new GrowthBook<GrowthbookFeatures>({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
    decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
    enableDevMode: process.env.NEXT_PUBLIC_ENV !== 'prod',
    subscribeToChanges: true
});

export function updateGrowthBookURL(): void {
    growthbook.setURL(window.location.href);
}

// Fetch features from GrowthBook API and cache in memory
const FEATURES_ENDPOINT = process.env
    .NEXT_PUBLIC_GROWTHBOOK_API_ENDPOINT as string;
let features: Context['features'];
let lastFetch = 0;
export async function getFeatures(): Promise<Context['features']> {
    if (Date.now() - lastFetch > 100) {
        lastFetch = Date.now();
        const latest = fetch(FEATURES_ENDPOINT)
            .then((res) => res.json())
            .then((json) => (features = json.features || features))
            .catch((e) => console.error('Error fetching features', e));
        // If this is the first time, wait for the initial fetch
        if (!features) await latest;
    }
    return features;
}
