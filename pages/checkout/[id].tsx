import { useRouter } from 'next/router';
import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';

import { TransactionProvider } from 'payment/contexts/TransactionProvider';
import TransactionContainer from 'payment/containers/TransactionContainer';

const Checkout = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout paymentPage>
            {id ? (
                <TransactionProvider transactionId={id as string}>
                    <TransactionContainer />
                </TransactionProvider>
            ) : (
                <div></div>
            )}
        </Layout>
    );
};

export default withAuth(Checkout);
