/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getToken } from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import LoadingBackdrop from './components/elements/LoadingBackdrop';
import { useGetProfileQuery } from 'authentication/redux/api/authApi';

const withAnon = (WrappedComponent: React.ComponentType) => {
    return (props: JSX.IntrinsicAttributes & { children?: ReactNode }) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const accessToken = useSelector(getToken);

            const { data: profile } = useGetProfileQuery(
                {},
                { skip: !accessToken }
            );

            const router = useRouter();
            if (!!profile) {
                if (
                    ['/masuk', '/registrasi', '/onboarding'].includes(
                        router.pathname
                    )
                ) {
                    if (!profile.username) {
                        router.replace('/onboarding');
                    } else {
                        router.replace('/kelas');
                    }
                } else if (router.pathname === '/') {
                    router.replace('/kelas');
                }

                return <LoadingBackdrop />;
            }
            return <WrappedComponent {...props} />;
        }

        // If we are on server, return null
        return <LoadingBackdrop />;
    };
};

export default withAnon;
