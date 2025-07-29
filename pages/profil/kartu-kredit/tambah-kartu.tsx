import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import AddCardForm from 'profile/components/kartu-kredit/AddCardForm';
import { CreditCardProvider } from 'profile/components/kartu-kredit/CreditCardProvider';

const TambahKartu = (): JSX.Element => {
    return (
        <Layout>
            <CreditCardProvider>
                <AddCardForm />
            </CreditCardProvider>
        </Layout>
    );
};

TambahKartu.displayName = 'Tambah Kartu';
export default withAuth(TambahKartu);
