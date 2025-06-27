/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://flagquizzer.vercel.app/', // ✅ include trailing slash
  generateRobotsTxt: true,
  exclude: ['/sitemap.xml'], // ✅ prevent circular reference
  outDir: './public',
  addTrailingSlash: true, // ✅ ensures trailing slash in URLs
  transform: async (config, url) => {
    return {
      loc: url.endsWith('/') ? url : `${url}/`, // ✅ enforce trailing slash
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
