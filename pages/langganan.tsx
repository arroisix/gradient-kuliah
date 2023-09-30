import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import SubscribePacket from 'payment/containers/SubscribePacket';

const Subscribe = (): JSX.Element => {
    return (
        <Layout paymentPage>
            <SubscribePacket />
        </Layout>
    );
};

Subscribe.displayName = 'Subscribe';
export default withAuth(Subscribe);
