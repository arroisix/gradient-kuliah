import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link
                        rel="preconnect"
                        href="https://fonts.googleapis.com"
                    />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;400;800&display=swap"
                        rel="stylesheet"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap"
                        rel="stylesheet"
                    />
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=G-33QKLYJL4W`}
                    />
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-33QKLYJL4W', {
              page_path: window.location.pathname,
            });
          `
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
