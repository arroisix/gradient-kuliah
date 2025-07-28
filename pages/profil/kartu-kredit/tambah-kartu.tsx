import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import AddCardForm from 'profile/components/kartu-kredit/AddCardForm';

const TambahKartu = (): JSX.Element => {
    return (
        <Layout isFullBlackBackground>
            <AddCardForm />
        </Layout>
    );
};

TambahKartu.displayName = 'Tambah Kartu';
export default withAuth(TambahKartu);
