import { useRouter } from 'next/router';
import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import SubscriptionContainer from 'payment/containers';
import { PaymentProvider } from 'payment/contexts/PaymentProvider';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useEffect } from 'react';
import { useGetDetailPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';

const Payment = (): JSX.Element => {
    const router = useRouter();
    const { packetId, subscriptionId } = router.query;
    const isSubscribeViaWhatsapp = useFeatureIsOn('subscribe-via-wa');
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: packet } = useGetDetailPacketOfferQuery(packetId as string);

    useEffect(() => {
        if (
            isSubscribeViaWhatsapp &&
            isAuthenticated &&
            packet &&
            !subscriptionId
        ) {
            // redirect to WhatsApp
            const message = `Halo, saya tertarik untuk berlangganan ${
                packet?.packet_name ?? ''
            }`;

            router.push(
                `https://api.whatsapp.com/send?phone=6285173430127&text=${message}`
            );
        }
    }, [isSubscribeViaWhatsapp, isAuthenticated, packet, subscriptionId]);

    return (
        <Layout paymentPage isFullBlackBackground>
            {packetId ? (
                <PaymentProvider packetId={packetId as string}>
                    {isSubscribeViaWhatsapp &&
                    isAuthenticated &&
                    !subscriptionId ? (
                        <section className="flex flex-col items-center justify-center h-screen gap-6 text-center">
                            <Image
                                src={`${CDN_URL}/assets/redirect_asset.png`}
                                width={197}
                                height={118}
                            />
                            <p className="text-lg font-bold">
                                Kamu akan diarahkan ke admin gradient...
                            </p>
                        </section>
                    ) : (
                        <SubscriptionContainer />
                    )}
                </PaymentProvider>
            ) : (
                <div></div>
            )}
        </Layout>
    );
};

Payment.displayName = 'Payment';
export default withAuth(Payment);
