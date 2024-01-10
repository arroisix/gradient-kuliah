import { getFeatures, growthbook } from 'library/growthbook';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'visitor_id';
const ACTIVE_AB_TESTING_PAGES = ['/', '/komunitas']; // Add as needed

export const config = {
    matcher: ['/komunitas']
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
    // We only want to run the A/B test on the homepage
    const pathname = req.nextUrl.pathname;
    if (!ACTIVE_AB_TESTING_PAGES.includes(pathname)) {
        return NextResponse.next();
    }

    // Get existing visitor cookie or create a new one
    const visitor_id = req.cookies.get(COOKIE) || crypto.randomUUID();

    // Setup GrowthBook instance
    growthbook.setFeatures((await getFeatures()) || {});
    growthbook.setAttributes({ id: visitor_id });

    // Pick which page to render depending on a feature flag
    let res = NextResponse.next();
    if (growthbook.isOn('landing-page-revamp')) {
        const url = req.nextUrl.clone();
        // Replace response with revamped variant
        switch (url.pathname) {
            // case '/':
            //     url.pathname = '/landing-revamp';
            //     break;
            case '/komunitas':
                url.pathname = '/komunitas/public';
                break;
        }
        res = NextResponse.rewrite(url);
    }

    // Store the visitor cookie if not already there
    if (!req.cookies.get(COOKIE)) {
        res.cookies.set(COOKIE, visitor_id);
    }

    return res;
}
