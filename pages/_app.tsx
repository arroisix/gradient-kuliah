/* eslint-disable @typescript-eslint/ban-ts-comment */
import Head from 'next/head';
import { AppProps } from 'next/app';
import 'styles/index.css';
import { ToastContainer } from 'react-toastify';

import { PersistGate } from 'redux-persist/integration/react';
import useStore, { wrapper } from 'redux/store';

import 'react-toastify/dist/ReactToastify.css';
import 'moment/locale/id';
import { AuthProvider } from 'authentication/contexts/AuthProvider';
import { useEffect } from 'react';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';

const store = useStore();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
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
            <Head>
                <title>Gradient Academy</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <PersistGate
                /* @ts-ignore */
                persistor={store.__persistor}
                loading={<LoadingBackdrop />}>
                <AuthProvider>
                    <Component {...pageProps} />
                </AuthProvider>
            </PersistGate>
            <ToastContainer />
        </>
    );
}

export default wrapper.withRedux(MyApp);
