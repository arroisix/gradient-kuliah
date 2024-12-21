import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import { ProfileContainer } from 'profile/containers';

const EmailChange = (): JSX.Element => {
    return (
        <Layout>
            <ProfileContainer />
        </Layout>
    );
};

EmailChange.displayName = 'Ganti Email';
export default withAuth(EmailChange);
