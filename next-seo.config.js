import AppConfig from "./app.config";

/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: AppConfig.title,
  defaultTitle: AppConfig.title,
  description: AppConfig.description,
  canonical: AppConfig.url,
  openGraph: {
    url: AppConfig.url,
    title: AppConfig.title,
    description: AppConfig.description,
    images: [
      {
        url: AppConfig.ogImageUrl,
        alt: `${AppConfig.title} og-image`,
      },
    ],
    site_name: AppConfig.title,
  },
  twitter: {
    handle: AppConfig.twitterHandle,
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
