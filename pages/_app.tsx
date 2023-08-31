/* eslint-disable @typescript-eslint/ban-ts-comment */
import Head from 'next/head';
import { AppProps } from 'next/app';
import 'styles/index.css';
import 'styles/videojs.css';
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css';

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css';

// style for video.js
import 'video.js/dist/video-js.css';
import '@mux/videojs-kit/dist/index.css';

// used for rendering equations (optional)
import 'katex/dist/katex.min.css';
import { ToastContainer } from 'react-toastify';

import { PersistGate } from 'redux-persist/integration/react';
import useStore, { wrapper } from 'redux/store';

import 'react-toastify/dist/ReactToastify.css';
import 'moment/locale/id';
import { AuthProvider } from 'authentication/contexts/AuthProvider';
import { useEffect } from 'react';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import usePosthog from 'commons/hooks/usePosthog';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NextSeo } from 'next-seo';

const store = useStore();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    usePosthog('phc_QeqOZr67qAfgO3mWBQzRHUXbJeDIycKDu2a0NOuGYVj', {
        api_host: 'https://app.posthog.com'
    });
    const loadClientSideOnlyLibrary = async (): Promise<void> => {
        const TagManager = await import('react-gtm-module');
        // @ts-ignore
        TagManager.initialize({
            gtmId: 'GTM-T3KZ4FB'
        });
    };
    useEffect(() => {
        loadClientSideOnlyLibrary();
    }, []);

    return (
        <>
            <NextSeo
                defaultTitle="Gradient Academy"
                title={pageProps?.title}
                description={pageProps?.title}
                openGraph={pageProps?.openGraph}
            />
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="icon" type="image/x-icon" href="/gradient.ico" />
                <link rel="apple-touch-icon" href="/gradient.ico" />
            </Head>
            <PersistGate
                /* @ts-ignore */
                persistor={store.__persistor}
                loading={<LoadingBackdrop />}>
                <GoogleOAuthProvider clientId="3688986116-g7dlt8prm1gimh870k4h0trds8njq4rj.apps.googleusercontent.com">
                    <AuthProvider>
                        <Component {...pageProps} />
                    </AuthProvider>
                </GoogleOAuthProvider>
            </PersistGate>
            <ToastContainer />
        </>
    );
}

export default wrapper.withRedux(MyApp);
