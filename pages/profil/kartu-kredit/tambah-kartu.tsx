import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import { ProfileContainer } from 'profile/containers';

const TambahKartu = (): JSX.Element => {
    return (
        <Layout>
            <ProfileContainer />
        </Layout>
    );
};

TambahKartu.displayName = 'Tambah Kartu Baru';
export default withAuth(TambahKartu);
