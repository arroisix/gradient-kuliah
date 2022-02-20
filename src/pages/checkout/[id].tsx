import { useRouter } from 'next/router';
import withAuth from 'src/commons/withAuth';
import Layout from 'src/commons/layout';

import { TransactionProvider } from 'src/payment/contexts/TransactionProvider';
import TransactionContainer from 'src/payment/containers/TransactionContainer';

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
