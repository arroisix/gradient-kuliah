/* eslint-disable react/display-name */
import {
    getIsProfileComplete,
    getToken
} from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import LoadingBackdrop from './components/elements/LoadingBackdrop';
import { useRouter } from 'next/router';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { getDisplayName } from './utils';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const WithAuth = (
        props: JSX.IntrinsicAttributes & { children?: JSX.Element }
    ): JSX.Element | undefined => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const router = useRouter();
            const accessToken = useSelector(getToken);
            const rawToken = window.localStorage.getItem('token');

            const { is_subscribed, isDoneFetchingSubcription } =
                useCourseSubscription();
            const isProfileComplete = useSelector(getIsProfileComplete);
            const isLastOnboardingStep = localStorage.getItem(
                'isLastOnboardingStep'
            );
            // If there is no access token we redirect to "/" page.
            // Also clear token from cookie and localstorage
            if (isDoneFetchingSubcription) {
                if (
                    router.pathname === '/onboarding' &&
                    isProfileComplete &&
                    !(isLastOnboardingStep === 'true') &&
                    is_subscribed
                ) {
                    router.push('/dashboard');
                    return;
                }

                if (router.pathname === '/onboarding' && !isProfileComplete) {
                    return <WrappedComponent {...props} />;
                }

                if (
                    router.pathname === '/onboarding' &&
                    isProfileComplete &&
                    isLastOnboardingStep === 'true' &&
                    !is_subscribed
                ) {
                    const packetId = localStorage.getItem('packetId');
                    if (packetId) {
                        router.push(`/pembayaran?packetId=${packetId}`);
                    } else if (router.query.redirect) {
                        router.push(router.query.redirect as string);
                    } else {
                        router.push('/');
                    }
                    return;
                }

                if (
                    [
                        '/langganan',
                        '/profil',
                        '/transaksi',
                        '/pembayaran',
                        '/checkout',
                        '/referral'
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
            } else {
                router.push(`/masuk?redirect=${window.location.href}`);
                return;
            }
        }
        return <LoadingBackdrop />;
    };

    WithAuth.displayName = getDisplayName(WrappedComponent);
    return WithAuth;
};

export default withAuth;
