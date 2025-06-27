/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://flagquizzer.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/sitemap.xml'], // Prevent self-reference
}
