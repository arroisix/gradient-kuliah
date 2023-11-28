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
            const { pathname, query } = useRouter();
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
                    pathname === '/onboarding' &&
                    isProfileComplete &&
                    !(isLastOnboardingStep === 'true') &&
                    is_subscribed
                ) {
                    window.location.href = '/dashboard';
                    return;
                }

                if (pathname === '/onboarding' && !isProfileComplete) {
                    return <WrappedComponent {...props} />;
                }

                if (
                    pathname === '/onboarding' &&
                    isProfileComplete &&
                    isLastOnboardingStep === 'true' &&
                    !is_subscribed
                ) {
                    const packetId = localStorage.getItem('packetId');
                    if (packetId) {
                        window.location.href = `/pembayaran?packetId=${packetId}`;
                    } else if (query.redirect) {
                        window.location.href = query.redirect as string;
                    } else {
                        window.location.href = '/';
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
                    ].some((value) => pathname.includes(value)) &&
                    !is_subscribed
                ) {
                    return <WrappedComponent {...props} />;
                }

                if (pathname !== '/mulai' && !is_subscribed) {
                    if (pathname === '/komunitas')
                        window.location.href = '/langganan';
                    else window.location.href = '/';
                    return;
                }

                if (!accessToken && !rawToken) {
                    window.location.href = '/';
                    return;
                }

                // If this is an accessToken we just render the component that was passed with all its props

                return <WrappedComponent {...props} />;
            }
        }
        return <LoadingBackdrop />;
    };

    WithAuth.displayName = getDisplayName(WrappedComponent);
    return WithAuth;
};

export default withAuth;
