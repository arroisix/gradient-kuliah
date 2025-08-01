import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import { ProfileContainer } from 'profile/containers';

const KartuKredit = (): JSX.Element => {
    return (
        <Layout>
            <ProfileContainer />
        </Layout>
    );
};

KartuKredit.displayName = 'Kartu Kredit';
export default withAuth(KartuKredit);
