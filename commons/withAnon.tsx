/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    getIsProfileComplete,
    getToken
} from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import LoadingBackdrop from './components/elements/LoadingBackdrop';

const withAnon = (WrappedComponent: React.ComponentType) => {
    return (props: JSX.IntrinsicAttributes & { children?: ReactNode }) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const accessToken = useSelector(getToken);
            const isProfileComplete = useSelector(getIsProfileComplete);

            const router = useRouter();

            if (!!accessToken) {
                if (['/masuk', '/daftar'].includes(router.pathname)) {
                    if (!isProfileComplete) {
                        router.replace(
                            `/onboarding${
                                !!router.query.redirect
                                    ? `?redirect=${router.query.redirect}`
                                    : ''
                            }`
                        );
                    } else if (!!router.query.redirect) {
                        router.replace(`${router.query.redirect}`);
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
