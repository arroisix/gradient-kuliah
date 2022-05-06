/* eslint-disable react/display-name */
import { getToken } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import Layout from './layout';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: JSX.IntrinsicAttributes & { children?: JSX.Element }) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const accessToken = useSelector(getToken);
            const rawToken = window.localStorage.getItem('token');

            // If there is no access token we redirect to "/" page.
            // Also clear token from cookie and localstorage
            if (!accessToken && !rawToken) {
                window.location.href = '/';
                return (
                    <Layout>
                        <div>Loading...</div>
                    </Layout>
                );
            }

            // If this is an accessToken we just render the component that was passed with all its props

            return <WrappedComponent {...props} />;
        }
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        );
    };
};

export default withAuth;
