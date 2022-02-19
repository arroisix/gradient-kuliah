import { useRouter } from 'next/router';
import withAuth from 'src/commons/withAuth';
import Layout from 'src/commons/layout';
import SubscriptionContainer from 'src/payment/containers';
import { PaymentProvider } from 'src/payment/contexts/PaymentProvider';

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
