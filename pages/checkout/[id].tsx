import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import TransactionContainer from 'payment/containers/TransactionContainer';
import { PaymentProvider } from 'payment/contexts/PaymentProvider';
import { useEffect, useState } from 'react';

const Checkout = (): JSX.Element => {
    const [packetId, setPacketId] = useState<string | null>(null);

    useEffect(() => {
        setPacketId(localStorage.getItem('packetId'));
    }, []);

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
