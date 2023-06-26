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
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const withAnon = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    return (props: JSX.IntrinsicAttributes & { children?: ReactNode }) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const accessToken = useSelector(getToken);
            const isProfileComplete = useSelector(getIsProfileComplete);
            const { is_subscribed } = useCourseSubscription();
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
                        if (is_subscribed) {
                            router.replace('/dashboard');
                        } else {
                            router.replace('/onboarding');
                        }
                    }
                } else if (router.pathname === '/') {
                    if (is_subscribed) {
                        router.replace('/dashboard');
                    } else {
                        return <WrappedComponent {...(props as P)} />;
                    }
                }

                return <LoadingBackdrop />;
            }
            return <WrappedComponent {...(props as P)} />;
        }

        // If we are on server, return null
        return <LoadingBackdrop />;
    };
};

export default withAnon;
