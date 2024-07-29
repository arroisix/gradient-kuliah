import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import TransactionContainer from 'payment/containers/TransactionContainer';
import { PaymentProvider } from 'payment/contexts/PaymentProvider';
import { useLocalStorage } from 'usehooks-ts';

const Checkout = (): JSX.Element => {
    const [packetId] = useLocalStorage('packetId', null);
    return (
        <Layout paymentPage>
            {packetId ? (
                <PaymentProvider packetId={packetId}>
                    <TransactionContainer />
                </PaymentProvider>
            ) : (
                <></>
            )}
        </Layout>
    );
};

Checkout.displayName = 'Checkout';
export default withAuth(Checkout);
