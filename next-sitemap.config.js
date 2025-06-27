/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://flagquizzer.vercel.app/",
  addTrailingSlash: true,
  transform: async (config, url) => ({
    loc: url.endsWith("/") ? url : `${url}/`, // ✅ force trailing slash
    changefreq: "daily",
    priority: 0.7,
    lastmod: new Date().toISOString(),
    alternateRefs: [], // ✅ disables xmlns:xhtml
  }),
};
