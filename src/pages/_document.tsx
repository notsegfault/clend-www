/* eslint-disable react/jsx-props-no-spreading */

import Document, { Html, Head, Main, NextScript } from "next/document";

import AppConfig from "../../app.config";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" key="charset" />
          <meta name="application-name" content={AppConfig.appName} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={AppConfig.appName} />
          <meta name="description" content={AppConfig.description} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
            key="icon32"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
            key="icon16"
          />
          <link rel="shortcut icon" href="/icon-180x180.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
