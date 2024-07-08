import { IS_BOT } from 'commons/constants';
import { getBookBaseHref } from 'courses/utils';
import { getFeatures, growthbook } from 'library/growthbook';
import { NextRequest, NextResponse, userAgent } from 'next/server';
import apiConfig from 'redux/api/config';
import { validate as isUUID } from 'uuid';

const COOKIE = 'visitor_id';

// List of bank soal books slug that exist at the time of Perpustakaan URL restructuring (updated: July 02, 2024)
const BANK_SOAL_BOOKS_SLUG = [
    'bank-soal-kalkulus1',
    'bank-soal-kimdas2',
    'Simulasi-SNBT-2024',
    'bank-soal-fisdas1',
    'bank-soal-kimdas1',
    'bank-soal-kalkulus2',
    'bank-soal-fisdas2'
];

const LIST_UPDATED_COURSE_SLUG: { [key: string]: string } = {
    fisdas1: 'fisika-dasar-1',
    kimdas1: 'kimia-dasar-1',
    fisdas2: 'fisika-dasar-2',
    kimdas2: 'kimia-dasar-2',
    anum: 'analisis-numerik',
    ptsl: 'pengantar-teknik-sipil-dan-lingkungan',
    matdis: 'matematika-diskrit',
    ldh: 'logika-dan-himpunan',
    probstat: 'probabilitas-dan-statistika',
    kalkulus1: 'kalkulus-1',
    kalkulus2: 'kalkulus-2'
};

const LIST_UPDATED_BOOK_SLUG: { [key: string]: string } = {
    'astronotes-mekanika-fluida': 'rangkuman-mekanika-fluida',
    'astronotes-kimia-organik': 'rangkuman-kimia-organik',
    'astronotes-statika': 'rangkuman-statika',
    'astronotes-persamaan-diferensial': 'rangkuman-persamaan-diferensial',
    'fisdas1-astronotes': 'rangkuman-fisika-dasar-1',
    'kalkulus2-astronotes': 'rangkuman-kalkulus-2',
    'kimdas1-astronotes': 'rangkuman-kimia-dasar-1',
    'kimdas2-astronotes': 'rangkuman-kimia-dasar-2',
    'fisdas2-astronotes': 'rangkuman-fisika-dasar-2',
    'kalkulus1-astronotes': 'rangkuman-kalkulus-1',
    'bank-soal-kalkulus1': 'pembahasan-soal-kalkulus-1',
    'bank-soal-fisdas1': 'pembahasan-soal-fisika-dasar-1',
    'bank-soal-kimdas1': 'pembahasan-soal-kimia-dasar-1',
    'bank-soal-kalkulus2': 'pembahasan-soal-kalkulus-2',
    'bank-soal-kimdas2': 'pembahasan-soal-kimia-dasar-2',
    'bank-soal-fisdas2': 'pembahasan-soal-fisika-dasar-2'
};

export const config = {
    matcher: [
        '/',
        '/komunitas',
        '/astronotes/:slug*',
        '/perpustakaan/:kategori(textbook|astronotes|bank-soal)/:slug*',
        '/kelas/:id/belajar/video/:chapterId/:subchapterId*',
        '/kelas/:id(fisdas1|kimdas1|fisdas2|kimdas2|anum|ptsl|matdis|ldh|probstat|kalkulus1|kalkulus2)/:slug*'
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

                const bookSlug = pathname.split('/')[3];
                const textbookSolutionSlug = await getTextbookSolutionSlugFromId(pathname, bookSlug)
                if (textbookSolutionSlug) newPathname = textbookSolutionSlug
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

            const bookSlug = newPathname.split('/')[3];
            const bookNewSlug = LIST_UPDATED_BOOK_SLUG[bookSlug];
            if (bookNewSlug) {
                newPathname = newPathname.replace(
                    `/${bookSlug}`,
                    `/${bookNewSlug}`
                );
            }
        }

        url.pathname = newPathname;
        return NextResponse.redirect(url, 301);
    }

    if (pathname.startsWith('/perpustakaan/')) {
        const bookSlug = pathname.split('/')[3];
        const textbookSolutionSlug = await getTextbookSolutionSlugFromId(pathname, bookSlug)
        if (textbookSolutionSlug){
            url.pathname = textbookSolutionSlug
            return NextResponse.redirect(url, 301);
        }

        const bookNewSlug = LIST_UPDATED_BOOK_SLUG[bookSlug];
        if (bookNewSlug) {
            url.pathname = pathname.replace(`/${bookSlug}`, `/${bookNewSlug}`);
            return NextResponse.redirect(url, 301);
        } else {
            const { isBot } = userAgent(req);
            if (isBot) {
                res.cookies.set(IS_BOT, process.env.FRONTEND_ACCESS_TOKEN);
            }
            return res;
        }
    }

    if (pathname.startsWith('/kelas/')) {
        const splitedPathname = pathname.split('/');
        let courseSlug = splitedPathname[2];
        const courseNewSlug = LIST_UPDATED_COURSE_SLUG[courseSlug];
        if (courseNewSlug) {
            courseSlug = courseNewSlug;
        }

        if (pathname.includes('/belajar/video/')) {
            const subchapterId = splitedPathname[splitedPathname.length - 1];
            try {
                const getSubchapterSlug = await fetch(
                    `${apiConfig.API_BASE_URL}courses/public/subchapter/${subchapterId}/slug/`
                );
                const subchapterSlug = (await getSubchapterSlug.json())
                    .subchapter_slug;

                if (subchapterSlug) {
                    url.pathname = `/kelas/${courseSlug}/${subchapterSlug}`;
                } else {
                    url.pathname = `/kelas/${courseSlug}`;
                }
            } catch (error) {
                url.pathname = `/kelas/${courseSlug}`;
            }
        } else {
            const subchapterSlug = splitedPathname[splitedPathname.length - 1];
            url.pathname = `/kelas/${courseSlug}/${subchapterSlug}`;
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

async function getTextbookSolutionSlugFromId(oldPathname: string, bookSlug: string) {
    const textbookReaderRegex = /^\/perpustakaan\/textbook\/[^/]+\/[^/]+$/; 
    let newPathname = ''

    if (textbookReaderRegex.test(oldPathname)) {
        const splitedPathname = oldPathname.split('/');
        const problemSlug = splitedPathname[splitedPathname.length - 1]
            
        if (isUUID(problemSlug)){
            try {
                const getTextbookSolutionSlug = await fetch(
                    `${apiConfig.API_BASE_URL}books/textbook/public/${bookSlug}/problems/${problemSlug}/slug/`
                );
                const textbookSolutionSlug = (await getTextbookSolutionSlug.json())
                    .textbook_solution_slug;
                if (textbookSolutionSlug) {
                    newPathname = `/perpustakaan/textbook/${bookSlug}/${textbookSolutionSlug}`;
                } else {
                    newPathname = `/perpustakaan/textbook/${bookSlug}`;
                }
            } catch (error) {
                newPathname = `/perpustakaan/textbook/${bookSlug}`;
            }
        }
    }

    return newPathname
}