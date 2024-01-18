import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import PilihPaketContainer from 'payment/containers/PilihPaket';

const PilihPaket = (): JSX.Element => {
    return (
        <Layout paymentPage isFullBlackBackground>
            <PilihPaketContainer />
        </Layout>
    );
};

PilihPaket.displayName = 'Pilih Paket';
export default withAuth(PilihPaket);
