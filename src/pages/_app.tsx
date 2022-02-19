import Head from 'next/head';
import { AppProps } from 'next/app';
import 'src/styles/index.css';
import client from 'src/commons/apolloClient';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from 'src/authentication/contexts/AuthProvider';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <Head>
                <title>Gradient Academy</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <ApolloProvider client={client}>
                <AuthProvider>
                    <Component {...pageProps} />
                </AuthProvider>
                <ToastContainer />
            </ApolloProvider>
        </>
    );
}

export default MyApp;
