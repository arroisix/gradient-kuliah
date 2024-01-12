/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    getIsProfileComplete,
    getToken
} from 'authentication/redux/selectors/userSelector';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { getDisplayName } from './utils';

const withAnon = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    const WithAnon = (
        props: JSX.IntrinsicAttributes & { children?: ReactNode }
    ) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const accessToken = useSelector(getToken);
            const isProfileComplete = useSelector(getIsProfileComplete);
            const { is_subscribed, isLoading: isLoadingSubscribed } =
                useCourseSubscription();
            const router = useRouter();

            if (!!accessToken) {
                if (!isLoadingSubscribed) {
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
                                const packetId =
                                    localStorage.getItem('packetId');
                                if (packetId) {
                                    router.replace(
                                        `/pembayaran?packetId=${packetId}`
                                    );
                                } else {
                                    router.replace('/');
                                }
                            }
                        }
                    } else if (
                        ['/', '/landing-revamp'].includes(router.pathname)
                    ) {
                        if (is_subscribed) router.replace('/dashboard');
                    }
                    return <WrappedComponent {...(props as P)} />;
                }
                return <WrappedComponent {...(props as P)} />;
            }
            return <WrappedComponent {...(props as P)} />;
        }

        // If we are on server, return null
        return <WrappedComponent {...(props as P)} />;
    };
    WithAnon.displayName = getDisplayName(WrappedComponent);
    return WithAnon;
};

export default withAnon;
