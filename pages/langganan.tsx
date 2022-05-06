import { useRouter } from 'next/router';
import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import SubscriptionContainer from 'payment/containers';
import { PaymentProvider } from 'payment/contexts/PaymentProvider';

const Subscribe = (): JSX.Element => {
    const router = useRouter();
    const { courseId } = router.query;

    return (
        <Layout paymentPage>
            {courseId ? (
                <PaymentProvider courseId={courseId as string}>
                    <SubscriptionContainer />
                </PaymentProvider>
            ) : (
                <div></div>
            )}
        </Layout>
    );
};

export default withAuth(Subscribe);
