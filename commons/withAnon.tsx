/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getToken } from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import Layout from './layout';
const withAnon = (WrappedComponent: React.ComponentType) => {
    return (props: JSX.IntrinsicAttributes & { children?: ReactNode }) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const accessToken = useSelector(getToken);
            const router = useRouter();

            if (accessToken) {
                if (router.pathname === '/') {
                    router.replace('/kelas');
                }

                return (
                    <Layout>
                        <div>Loading...</div>
                    </Layout>
                );
            }
            return <WrappedComponent {...props} />;
        }

        // If we are on server, return null
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        );
    };
};

export default withAnon;
