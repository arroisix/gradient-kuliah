import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import TransactionListContainer from 'payment/containers/TransactionListContainer';

const Transaction = (): JSX.Element => {
    return (
        <Layout>
            <TransactionListContainer />
        </Layout>
    );
};

export default withAuth(Transaction);
