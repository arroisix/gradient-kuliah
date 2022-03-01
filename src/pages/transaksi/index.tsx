import withAuth from 'src/commons/withAuth';
import Layout from 'src/commons/layout';
import TransactionListContainer from 'src/payment/containers/TransactionListContainer';

const Transaction = (): JSX.Element => {
    return (
        <Layout>
            <TransactionListContainer />
        </Layout>
    );
};

export default withAuth(Transaction);
