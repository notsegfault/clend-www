const AppConfig = require("./app.config");

/** @type {import('next-sitemap').IConfig} */
const NextSitemapConfig = {
  siteUrl: AppConfig.url,
  generateRobotsTxt: true,
};

module.exports = NextSitemapConfig;
