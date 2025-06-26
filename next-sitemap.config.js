// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://flagquizzer.vercel.app', // IMPORTANT: Use your actual Vercel URL
  generateRobotsTxt: true, 
};