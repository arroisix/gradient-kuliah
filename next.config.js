const env = process.env.ENVIRONMENT;

module.exports = {
    images: {
        domains: [
            'd2uqn6ndx4ow3t.cloudfront.net',
            'assets.gradient.academy',
            'cdn.discordapp.com',
            'gradient-qna-dev.s3.ap-southeast-1.amazonaws.com',
            'gradient-qna-prod.s3.ap-southeast-1.amazonaws.com',
            's3.ap-southeast-1.amazonaws.com',
            'storage.googleapis.com',
            'gradient-asset.storage.googleapis.com',
            'gradient-asset-dev.storage.googleapis.com',
            'notion.so',
            'gradient-sitemap.s3.ap-southeast-1.amazonaws.com',
            'gradient-sitemap.s3.ap-southeast-1.amazonaws.com',
            'gradient-public-student-dev.s3.ap-southeast-1.amazonaws.com',
            'gradient-public-student-prod.s3.ap-southeast-1.amazonaws.com',
            'gradient-editor-dev.s3.ap-southeast-1.amazonaws.com',
            'gradient-editor-prod.s3.ap-southeast-1.amazonaws.com'
        ]
    },
    experimental: {
        newNextLinkBehavior: true
    },
    crossOrigin: 'anonymous',
    redirects() {
        return [
            {
                source: '/beasiswa',
                destination:
                    'https://docs.google.com/forms/d/e/1FAIpQLSd5DjQIJMwwpxhIf8O4-auzAWyyBhFmL685dksUNxT7JDDFQA/viewform?pli=1',
                permanent: true,
                basePath: false
            },
            {
                source: '/karir',
                destination: 'https://career.gradient.academy/',
                permanent: true,
                basePath: false
            },
            {
                source: '/utbk/free-liveclass-pk-28-jan',
                destination: 'https://forms.gle/6d98JRCpWWsAwqpo6',
                permanent: true,
                basePath: false
            },
            {
                source: '/utbk/survey-free-liveclass',
                destination: 'https://forms.gle/68yxrJrtkKHHJSiG9',
                permanent: true,
                basePath: false
            },
            {
                source: '/utbk/early-bird-marathon-liveclass',
                destination: '/utbk/langganan',
                permanent: true,
                basePath: false
            },
            {
                source: '/utbk/free-live-class-pk3',
                destination: 'https://forms.gle/EzTtAajLbRZKijjZA',
                permanent: true,
                basePath: false
            },
            {
                source: '/sitemaps/:file(.+-sitemap(?:-\\d{1,3})?\\.xml)',
                destination: `https://gradient-sitemap.s3.ap-southeast-1.amazonaws.com/${env}/:file`,
                permanent: false,
                basePath: false
            },
            {
                source: '/sitemaps/:file(.+-sitemap(?:-\\d{1,3})?\\.xml)',
                destination: `https://gradient-sitemap.s3.ap-southeast-1.amazonaws.com/${env}/:file`,
                permanent: false,
                basePath: false
            },
            {
                source: '/kelas/fisdas1',
                destination: '/kelas/fisika-dasar-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/kimdas1',
                destination: '/kelas/kimia-dasar-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/fisdas2',
                destination: '/kelas/fisika-dasar-2',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/kimdas2',
                destination: '/kelas/kimia-dasar-2',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/anum',
                destination: '/kelas/analisis-numerik',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl',
                destination: '/kelas/pengantar-teknik-sipil-dan-lingkungan',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/matdis',
                destination: '/kelas/matematika-diskrit',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ldh',
                destination: '/kelas/logika-dan-himpunan',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/probstat',
                destination: '/kelas/probabilitas-dan-statistika',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/kalkulus1',
                destination: '/kelas/kalkulus-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/kalkulus2',
                destination: '/kelas/kalkulus-2',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/astronotes-mekanika-fluida',
                destination:
                    '/perpustakaan/astronotes/rangkuman-mekanika-fluida',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/astronotes-kimia-organik',
                destination: '/perpustakaan/astronotes/rangkuman-kimia-organik',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/astronotes-statika',
                destination: '/perpustakaan/astronotes/rangkuman-statika',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/astronotes-persamaan-diferensial',
                destination:
                    '/perpustakaan/astronotes/rangkuman-persamaan-diferensial',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/fisdas1-astronotes',
                destination:
                    '/perpustakaan/astronotes/rangkuman-fisika-dasar-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/kalkulus2-astronotes',
                destination: '/perpustakaan/astronotes/rangkuman-kalkulus-2',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/kimdas1-astronotes',
                destination: '/perpustakaan/astronotes/rangkuman-kimia-dasar-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/kimdas2-astronotes',
                destination: '/perpustakaan/astronotes/rangkuman-kimia-dasar-2',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/fisdas2-astronotes',
                destination:
                    '/perpustakaan/astronotes/rangkuman-fisika-dasar-2',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/astronotes/kalkulus1-astronotes',
                destination: '/perpustakaan/astronotes/rangkuman-kalkulus-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/bank-soal/bank-soal-kalkulus1',
                destination:
                    '/perpustakaan/bank-soal/pembahasan-soal-kalkulus-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/bank-soal/bank-soal-fisdas1',
                destination:
                    '/perpustakaan/bank-soal/pembahasan-soal-fisika-dasar-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/bank-soal/bank-soal-kimdas1',
                destination:
                    '/perpustakaan/bank-soal/pembahasan-soal-kimia-dasar-1',
                permanent: true,
                basePath: false
            },
            {
                source: '/perpustakaan/bank-soal/bank-soal-kalkulus2',
                destination:
                    '/perpustakaan/bank-soal/pembahasan-soal-kalkulus-2',
                permanent: true,
                basePath: false
            }
        ];
    }
};
