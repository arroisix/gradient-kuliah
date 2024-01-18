import { useRouter } from 'next/router';
import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import SubscriptionContainer from 'payment/containers';
import { PaymentProvider } from 'payment/contexts/PaymentProvider';

const Payment = (): JSX.Element => {
    const router = useRouter();
    const { packetId } = router.query;

    return (
        <Layout paymentPage isFullBlackBackground>
            {packetId ? (
                <PaymentProvider packetId={packetId as string}>
                    <SubscriptionContainer />
                </PaymentProvider>
            ) : (
                <div></div>
            )}
        </Layout>
    );
};

Payment.displayName = 'Payment';
export default withAuth(Payment);
