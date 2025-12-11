/* eslint-disable react/display-name */
import {
    getIsAuthenticated,
    getIsProfileComplete,
    getToken
} from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import LoadingBackdrop from './components/elements/LoadingBackdrop';
import { useRouter } from 'next/router';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { getDisplayName, sanitizeUrl } from './utils';
import { useLocalStorage } from 'usehooks-ts';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const WithAuth = (
        props: JSX.IntrinsicAttributes & { children?: JSX.Element }
    ): JSX.Element | undefined => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const isAuthenticated = useSelector(getIsAuthenticated);
            const router = useRouter();
            const accessToken = useSelector(getToken);
            const rawToken = window.localStorage.getItem('token');

            const { is_subscribed, isDoneFetchingSubcription, isLoading } =
                useCourseSubscription();
            const isProfileComplete = useSelector(getIsProfileComplete);
            const [showEmailVerification] = useLocalStorage(
                'showEmailVerification',
                false
            );

            if (!!rawToken && !accessToken) {
                return <LoadingBackdrop />;
            } else if (isAuthenticated) {
                if (isLoading) {
                    return <LoadingBackdrop />;
                } else if (isDoneFetchingSubcription) {
                    if (
                        router.pathname === '/onboarding' &&
                        isProfileComplete &&
                        is_subscribed
                    ) {
                        router.push('/dashboard');
                        return;
                    }

                    if (
                        router.pathname === '/onboarding' &&
                        (!isProfileComplete || showEmailVerification)
                    ) {
                        return <WrappedComponent {...props} />;
                    }

                    if (
                        [
                            '/langganan',
                            '/profil',
                            '/transaksi',
                            '/pembayaran',
                            '/checkout',
                            '/referral',
                            '/latihan',
                            '/onboarding/jenis-akun'
                        ].some((value) => router.pathname.includes(value)) &&
                        !is_subscribed
                    ) {
                        return <WrappedComponent {...props} />;
                    }

                    if (router.pathname !== '/mulai' && !is_subscribed) {
                        if (router.pathname === '/komunitas')
                            router.push('/langganan');
                        else router.push('/');
                        return;
                    }

                    if (!accessToken && !rawToken) {
                        router.push('/');
                        return;
                    }

                    // If this is an accessToken we just render the component that was passed with all its props

                    return <WrappedComponent {...props} />;
                }
            } else {
                router.push(
                    `/masuk?redirect=${sanitizeUrl(window.location.href)}`
                );
                return;
            }
        }
        return <LoadingBackdrop />;
    };

    WithAuth.displayName = getDisplayName(WrappedComponent);
    return WithAuth;
};

export default withAuth;
