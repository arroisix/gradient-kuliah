/* eslint-disable react/display-name */
import {
    getIsProfileComplete,
    getToken
} from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import LoadingBackdrop from './components/elements/LoadingBackdrop';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: JSX.IntrinsicAttributes & { children?: JSX.Element }) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const { pathname } = useRouter();
            const accessToken = useSelector(getToken);
            const rawToken = window.localStorage.getItem('token');

            const isProfileComplete = useSelector(getIsProfileComplete);
            const isLastOnboardingStep = localStorage.getItem(
                'isLastOnboardingStep'
            );
            // If there is no access token we redirect to "/" page.
            // Also clear token from cookie and localstorage
            if (
                pathname === '/onboarding' &&
                isProfileComplete &&
                !(isLastOnboardingStep === 'true')
            ) {
                window.location.href = '/dashboard';
                return;
            }

            if (!accessToken && !rawToken) {
                window.location.href = '/';
                return;
            }

            // If this is an accessToken we just render the component that was passed with all its props

            return <WrappedComponent {...props} />;
        }
        return <LoadingBackdrop />;
    };
};

export default withAuth;
