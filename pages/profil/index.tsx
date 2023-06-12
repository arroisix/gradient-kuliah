import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import { ProfileContainer } from 'profile/containers';

const Profile = (): JSX.Element => {
    return (
        <Layout>
            <ProfileContainer />
        </Layout>
    );
};

export default withAuth(Profile);
