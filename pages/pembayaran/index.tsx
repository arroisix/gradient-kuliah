import { useRouter } from 'next/router';
import withAuth from 'commons/withAuth';
import Layout from 'commons/layout';
import { PaymentProvider } from 'payment/contexts/PaymentProvider';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useEffect, useState } from 'react';
import { useGetDetailPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { useTracker } from 'tracker/tracker';
import PaketInfo from 'payment/components/PaketInfo';
import PaymentMethodList from 'payment/components/PaymentList/PaymentMethodList';
import CheckoutBottomSheet from 'payment/components/CheckoutBottomSheet';
import PromoCodeModal from 'payment/components/Promo/PromoCodeModal';

const Payment = (): JSX.Element => {
    const router = useRouter();
    const { packetId, subscriptionId } = router.query;
    const isSubscribeViaWhatsapp = useFeatureIsOn('subscribe-via-wa');
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: packet } = useGetDetailPacketOfferQuery(packetId as string, {
        skip: !packetId
    });
    const tracker = useTracker();
    const [isPromoModalOpen, setPromoModalOpen] = useState(false);

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

            tracker?.genericTrack('A/B Test: Redirect to WA');

            router.push(
                `https://api.whatsapp.com/send?phone=6285179880127&text=${message}`
            );
        }
    }, [isSubscribeViaWhatsapp, isAuthenticated, packet, subscriptionId]);

    useEffect(() => {
        if (packetId) {
            localStorage.setItem('packetId', packetId as string);
        }
    }, [packetId]);

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
                        <>
                            <PaketInfo />
                            <PaymentMethodList />
                            <CheckoutBottomSheet
                                onPromoClick={() => setPromoModalOpen(true)}
                            />
                            <PromoCodeModal
                                isOpen={isPromoModalOpen}
                                setOpen={setPromoModalOpen}
                            />
                        </>
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
