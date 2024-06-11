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
                destination:
                    'https://www.notion.so/astronotes/Bertumbuh-Bersama-Gradient-f398f551b9f9455c88ff6e6d24d81338',
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
                source: '/kelas/ptsl/belajar/video/1aa041b7-6eb9-4519-8166-9ac58ee84599/20b70122-6f63-4e8e-bd5b-99050af49983',
                destination: '/kelas/ptsl/merekonstruksi-definisi-teknik-sipil',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl/belajar/video/1aa041b7-6eb9-4519-8166-9ac58ee84599/db165f53-8537-43fa-8f52-d8f380030735',
                destination: '/kelas/ptsl/tetsu-nakamura-dari-dokter-jadi-engineer',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl/belajar/video/1aa041b7-6eb9-4519-8166-9ac58ee84599/e9297977-3fab-4e85-86d7-6eea9c7a35f0',
                destination: '/kelas/ptsl/teknik-sipil-menyembuhkan-banyak-orang',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl/belajar/video/1aa041b7-6eb9-4519-8166-9ac58ee84599/2661330a-6495-4c88-b45e-7330670ef9f8',
                destination: '/kelas/ptsl/ilmu-yang-membangun-peradaban',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl/belajar/video/1aa041b7-6eb9-4519-8166-9ac58ee84599/1097bb41-e980-4b7e-be14-07fef4e31da4',
                destination: '/kelas/ptsl/surat-untuk-engineer-masa-depan',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl/belajar/video/040d7e4a-91af-4099-817a-de73dd247846/d9089fb9-cdcf-42a1-8f8b-e262cf7aec90',
                destination: '/kelas/ptsl/teknik-lingkungan-warisan-yang-berkelanjutan',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl/belajar/video/040d7e4a-91af-4099-817a-de73dd247846/ffb75949-93a4-4f0a-9462-48c86728bcff',
                destination: '/kelas/ptsl/bagaimana-manusia-mempengaruhi-lingkungan',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl/belajar/video/040d7e4a-91af-4099-817a-de73dd247846/55145911-67fb-4070-b1ea-3b43a481cc26',
                destination: '/kelas/ptsl/teknologi-pedang-bermata-dua-dalam-isu-keberlanjutan',
                permanent: true,
                basePath: false
            },
            {
                source: '/kelas/ptsl/belajar/video/040d7e4a-91af-4099-817a-de73dd247846/b30ab271-2fa2-417f-aa06-fd7030af9210',
                destination: '/kelas/ptsl/environmentally-benign-technology',
                permanent: true,
                basePath: false
            },
        ];
    }
};
