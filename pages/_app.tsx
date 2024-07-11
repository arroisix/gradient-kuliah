/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'styles/index.css';
import 'styles/videojs.css';
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css';

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css';

// style for video.js
import '@mux/videojs-kit/dist/index.css';
import 'video.js/dist/video-js.css';

// used for rendering equations (optional)
import 'katex/dist/katex.min.css';
import { ToastContainer } from 'react-toastify';

import { PersistGate } from 'redux-persist/integration/react';
import useStore, { wrapper } from 'redux/store';

import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from 'authentication/contexts/AuthProvider';
import { ThemeContextProvider } from 'commons/contexts/ThemeProvider';
import { growthbook, updateGrowthBookURL } from 'library/growthbook';
import { getCookieValue, getDisplayName } from 'commons/utils';
import 'moment/locale/id';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { MixpanelProvider } from 'tracker/MixpanelProvider';
import { HighlightInit } from '@highlight-run/next/client';
import { HIGHLIGHT_PROJECT_ID } from 'commons/constants';
import UpdateProfileNotification from 'profile/components/UpdateProfileNotification';

const store = useStore();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    const router = useRouter();

    const loadClientSideOnlyLibrary = async (): Promise<void> => {
        const TagManager = await import('react-gtm-module');
        // @ts-ignoreimport { HighlightInit } from '@highlight-run/next/client';

        TagManager.initialize({
            gtmId: 'GTM-T3KZ4FB'
        });
    };

    useEffect(() => {
        loadClientSideOnlyLibrary();
    }, []);

    useEffect(() => {
        // Load features from the GrowthBook API and keep them up-to-date
        growthbook.loadFeatures();
        growthbook.setAttributes({ id: getCookieValue('visitor_id') });

        // Subscribe to route change events and update GrowthBook
        router.events.on('routeChangeComplete', updateGrowthBookURL);
        return () =>
            router.events.off('routeChangeComplete', updateGrowthBookURL);
    }, []);

    return (
        <>
            <NextSeo
                defaultTitle="Platform Belajar Materi Kuliah Online #1 di Indonesia | Gradient"
                title={pageProps?.title}
                description={pageProps?.description}
                canonical={pageProps?.canonical}
                openGraph={pageProps?.openGraph}
            />
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0"
                />
                <link rel="icon" type="image/x-icon" href="/gradient.ico" />
                <link rel="apple-touch-icon" href="/gradient.ico" />
            </Head>
            <PersistGate
                /* @ts-ignore */
                persistor={store.__persistor}
                loading={
                    <GoogleOAuthProvider clientId="734268158155-omc5qdjjl5kdrbute446h18i5rvjauiv.apps.googleusercontent.com">
                        <ThemeContextProvider>
                            <Component {...pageProps} />
                        </ThemeContextProvider>
                    </GoogleOAuthProvider>
                }>
                <GrowthBookProvider growthbook={growthbook}>
                    <MixpanelProvider
                        pageComponentName={getDisplayName(Component)}>
                        <GoogleOAuthProvider clientId="734268158155-omc5qdjjl5kdrbute446h18i5rvjauiv.apps.googleusercontent.com">
                            <ThemeContextProvider>
                                <AuthProvider>
                                    <UpdateProfileNotification />
                                    <Component {...pageProps} />
                                </AuthProvider>
                            </ThemeContextProvider>
                        </GoogleOAuthProvider>
                    </MixpanelProvider>
                </GrowthBookProvider>
            </PersistGate>
            <ToastContainer />
            <HighlightInit
                projectId={HIGHLIGHT_PROJECT_ID}
                serviceName="gradient-web"
                tracingOrigins
                networkRecording={{
                    enabled: true,
                    recordHeadersAndBody: true,
                    urlBlocklist: []
                }}
            />
        </>
    );
}

export default wrapper.withRedux(MyApp);
