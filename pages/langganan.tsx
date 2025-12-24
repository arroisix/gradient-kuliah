import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import SubscribePacket from 'payment/containers/SubscribePacket';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { Langganan } from './utbk';

const Subscribe = (): JSX.Element => {
    const { profile } = useAuth();

    if (profile?.current_role === 'K12') {
        return (
            <Layout paymentPage>
                <section className="py-4 lg:py-24 px-[18px] m-auto max-w-[1064px] w-full">
                    <Langganan removeFree />
                </section>
            </Layout>
        );
    }

    return (
        <Layout paymentPage>
            <SubscribePacket />
        </Layout>
    );
};

Subscribe.displayName = 'Subscribe';
export default withAuth(Subscribe);
