import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import TransactionContainer from 'payment/containers/TransactionContainer';

const Checkout = (): JSX.Element => {
    return (
        <Layout paymentPage>
            <TransactionContainer />
        </Layout>
    );
};

export default withAuth(Checkout);
