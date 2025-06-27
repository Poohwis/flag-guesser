// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://flagquizzer.vercel.app', // Make sure this is your correct site URL
  generateRobotsTxt: true, // This ensures robots.txt is generated
  robotsTxtOptions: {
    // This policy ensures all user agents are allowed to crawl everything by default
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    // This function allows you to transform the generated robots.txt content
    transformRobotsTxt: async (config, robotsTxt) => {
      // Remove the Host directive and the initial comment
      let cleanedRobotsTxt = robotsTxt.replace(/^# \*\n/, ''); // Remove '# *' and the following newline
      cleanedRobotsTxt = cleanedRobotsTxt.replace(/# Host\nHost: .*\n\n/, ''); // Remove '# Host', 'Host: ...', and following newlines

      // Ensure the Sitemap directive is present and correct (next-sitemap usually handles this)
      if (!cleanedRobotsTxt.includes('Sitemap:')) {
        cleanedRobotsTxt += `\nSitemap: ${config.siteUrl}/sitemap.xml\n`;
      }

      return cleanedRobotsTxt;
    },
    // Ensure the sitemap is explicitly added, though it often is by default if generateRobotsTxt is true
    additionalSitemaps: [
      'https://flagquizzer.vercel.app/sitemap.xml',
    ],
  },
  // You might have other options here like sitemapSize, exclude, etc.
};