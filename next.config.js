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
            'notion.so'
        ]
    },
    redirects() {
        return [
            process.env.MAINTENANCE_MODE === '1'
                ? {
                      source: '/((?!maintenance).*)',
                      destination: '/maintenance.html',
                      permanent: false
                  }
                : null
        ].filter(Boolean);
    }
};
