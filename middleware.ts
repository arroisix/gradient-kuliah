import { IS_BOT } from 'commons/constants';
import { getBookBaseHref } from 'courses/utils';
import { getFeatures, growthbook } from 'library/growthbook';
import { NextRequest, NextResponse, userAgent } from 'next/server';

const COOKIE = 'visitor_id';

export const config = {
    matcher: [
        '/',
        '/komunitas',
        '/astronotes',
        '/astronotes/:slug*',
        '/perpustakaan/:kategori(textbook|astronotes|bank-soal)/:slug*'
    ]
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
    const url = req.nextUrl.clone();
    const { pathname, searchParams } = url;
    const res = NextResponse.next();

    if (pathname.startsWith('/astronotes')) {
        const tab = searchParams.get('tab');
        searchParams.delete('tab');

        switch (tab) {
            case 'text-book':
                url.pathname = getBookBaseHref('textbook');
                break;
            case 'astronotes':
                url.pathname = getBookBaseHref('catatan');
                break;
            case 'bank-soal':
                url.pathname = getBookBaseHref('bank-soal');
                break;
            default:
                url.pathname = '/perpustakaan';
        }

        return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/perpustakaan/')) {
        const { isBot } = userAgent(req);
        if (isBot) {
            res.cookies.set(IS_BOT, process.env.FRONTEND_ACCESS_TOKEN);
        }
        return res;
    }

    // Get existing visitor cookie or create a new one
    const visitor_id = req.cookies.get(COOKIE) || crypto.randomUUID();

    // Setup GrowthBook instance
    growthbook.setFeatures((await getFeatures()) || {});
    growthbook.setAttributes({ id: visitor_id });

    // Store the visitor cookie if not already there
    if (!req.cookies.get(COOKIE)) {
        res.cookies.set(COOKIE, visitor_id);
    }

    return res;
}
