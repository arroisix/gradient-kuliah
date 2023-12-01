import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import { ProfileContainer } from 'profile/containers';

const PerangkatTerhubung = (): JSX.Element => {
    return (
        <Layout>
            <ProfileContainer />
        </Layout>
    );
};

PerangkatTerhubung.displayName = 'Perangkat Terhubung';
export default withAuth(PerangkatTerhubung);
