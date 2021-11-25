const fs = require("fs");
const AppConfig = require("../../app.config");

fs.writeFileSync(
  "./public/manifest.json",
  JSON.stringify({
    short_name: AppConfig.appName,
    name: AppConfig.description,
    lang: "en",
    start_url: "/",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    dir: "ltr",
    display: "standalone",
    orientation: "portrait",
    prefer_related_applications: false,
  })
);
