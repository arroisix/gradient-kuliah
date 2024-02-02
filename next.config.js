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
            'gradient-public-student-dev.s3.ap-southeast-1.amazonaws.com',
            'gradient-public-student-prod.s3.ap-southeast-1.amazonaws.com'
        ]
    },
    experimental: {
        newNextLinkBehavior: true
    },
    redirects() {
        return [
            {
                source: '/beasiswa',
                destination:
                    'https://docs.google.com/forms/d/e/1FAIpQLSd5DjQIJMwwpxhIf8O4-auzAWyyBhFmL685dksUNxT7JDDFQA/viewform?pli=1',
                permanent: true,
                basePath: false
            }
        ];
    }
};
