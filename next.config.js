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
                source: '/astronotes',
                destination: '/perpustakaan',
                permanent: true,
                basePath: false
            }
        ];
    }
};
