const URL = process.env.SITE_URL || 'https://gradient.academy';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: URL,
    generateRobotsTxt: true,
    exclude: [
        '/dashboard',
        '/old',
        '/profil*',
        '/referral*',
        '/kelas/*',
        '/komunitas/*',
        '/astronotes/*',
        '/sitemaps/*'
    ],
    robotsTxtOptions: {
        additionalSitemaps: [
            `${URL}/sitemaps/courses-sitemap.xml`,
            `${URL}/sitemaps/astronotes-sitemap.xml`,
            `${URL}/sitemaps/videos-sitemap.xml`
        ]
    }
};
