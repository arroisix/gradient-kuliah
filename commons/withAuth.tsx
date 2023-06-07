/* eslint-disable react/display-name */
import { getToken } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import LoadingBackdrop from './components/elements/LoadingBackdrop';
import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: JSX.IntrinsicAttributes & { children?: JSX.Element }) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const { pathname } = useRouter();
            const accessToken = useSelector(getToken);
            const rawToken = window.localStorage.getItem('token');

            const { data: profile } = useGetProfileQuery({});

            // If there is no access token we redirect to "/" page.
            // Also clear token from cookie and localstorage
            if (pathname === '/onboarding' && profile?.is_profile_complete) {
                window.location.href = '/kelas';
                return;
            }

            if (!accessToken && !rawToken) {
                window.location.href = '/';
                return <LoadingBackdrop />;
            }

            // If this is an accessToken we just render the component that was passed with all its props

            return <WrappedComponent {...props} />;
        }
        return <LoadingBackdrop />;
    };
};

export default withAuth;
