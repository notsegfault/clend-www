const withImages = require("next-images");
const nextBuildId = require("next-build-id");

/** @type {import('next').NextConfig} */
module.exports = withImages({
  reactStrictMode: true,
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  trailingSlash: true,
  exportPathMap() {
    return {
      "/": { page: "/" },
      "/404": { page: "/404" },
    };
  },
});
