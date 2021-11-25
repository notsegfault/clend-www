const fs = require("fs");

const AppConfig = require("../app.config");

fs.writeFileSync(
  "./public/manifest.json",
  JSON.stringify(
    {
      short_name: AppConfig.name,
      name: AppConfig.description,
      lang: "en",
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },

        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      start_url: "/",
      background_color: "#FFFFFF",
      theme_color: "#FFFFFF",
      dir: "ltr",
      display: "standalone",
      orientation: "portrait",
      prefer_related_applications: false,
    },
    null,
    4
  )
);
