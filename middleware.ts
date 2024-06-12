import { IS_BOT } from 'commons/constants';
import { getBookBaseHref } from 'courses/utils';
import { getFeatures, growthbook } from 'library/growthbook';
import { NextRequest, NextResponse, userAgent } from 'next/server';
import apiConfig from 'redux/api/config';

const COOKIE = 'visitor_id';

// List of bank soal books slug that exist at the time of Perpustakaan URL restructuring (updated: June 6, 2024)
const BANK_SOAL_BOOKS_SLUG = [
    'bank-soal-kalkulus1',
    'bank-soal-kimdas2',
    'Simulasi-SNBT-2024',
    'bank-soal-fisdas1',
    'bank-soal-kimdas1',
    'bank-soal-kalkulus2',
    'bank-soal-fisdas2'
];

export const config = {
    matcher: [
        '/',
        '/komunitas',
        '/astronotes/:slug*',
        '/perpustakaan/:kategori(textbook|astronotes|bank-soal)/:slug*',
        '/kelas/:id/belajar/video/:chapterId/:subchapterId*'
    ]
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
    const url = req.nextUrl.clone();
    const { pathname, searchParams } = url;
    let res = NextResponse.next();

    if (pathname.startsWith('/astronotes')) {
        const tab = searchParams.get('tab');
        searchParams.delete('tab');
        let newPathname = '/perpustakaan';

        switch (tab) {
            case 'text-book':
                newPathname = getBookBaseHref('textbook');
                break;
            case 'astronotes':
                newPathname = getBookBaseHref('catatan');
                break;
            case 'bank-soal':
                newPathname = getBookBaseHref('bank-soal');
                break;
        }

        if (pathname.startsWith('/astronotes/')) {
            if (pathname.startsWith('/astronotes/textbook/')) {
                newPathname = pathname.replace(
                    '/astronotes/',
                    '/perpustakaan/'
                );
            } else if (pathname.includes('calculus-9th-edition')) {
                newPathname = pathname.replace(
                    '/astronotes/',
                    `${getBookBaseHref('textbook')}/`
                );
            } else if (
                BANK_SOAL_BOOKS_SLUG.some((slug) => pathname.includes(slug))
            ) {
                newPathname = pathname.replace(
                    '/astronotes/',
                    `${getBookBaseHref('bank-soal')}/`
                );
            } else {
                newPathname = pathname.replace(
                    '/astronotes/',
                    `${getBookBaseHref('astronotes')}/`
                );
            }
        }

        url.pathname = newPathname;
        return NextResponse.redirect(url, 301);
    }

    if (pathname.startsWith('/perpustakaan/')) {
        const { isBot } = userAgent(req);
        if (isBot) {
            res.cookies.set(IS_BOT, process.env.FRONTEND_ACCESS_TOKEN);
        }
        return res;
    }

    if (
        pathname.startsWith('/kelas/') &&
        !pathname.startsWith('/kelas/ptsl/')
    ) {
        const splitedPathname = pathname.split('/');
        const subchapterId = splitedPathname[splitedPathname.length - 1];
        const courseSlug = splitedPathname[2];

        try {
            const getSubchapterSlug = await fetch(
                `${apiConfig.API_BASE_URL}courses/public/subchapter/${subchapterId}/slug/`
            );
            const subchapterSlug = (await getSubchapterSlug.json())
                .subchapter_slug;
            url.pathname = `/kelas/${courseSlug}/${subchapterSlug}`;
        } catch (error) {
            url.pathname = `/kelas/${courseSlug}`;
        }

        return NextResponse.redirect(url, 301);
    }

    // Get existing visitor cookie or create a new one
    const visitor_id = req.cookies.get(COOKIE) || crypto.randomUUID();

    // Setup GrowthBook instance
    growthbook.setFeatures((await getFeatures()) || {});
    growthbook.setAttributes({ id: visitor_id });

    // Pick which page to render depending on a feature flag
    if (growthbook.isOn('landing-page-revamp')) {
        switch (pathname) {
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
