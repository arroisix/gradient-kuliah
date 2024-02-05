import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
import { useSelector } from 'react-redux';


const ExpiryAnnouncement = ({
    slug
}: GradientBaseComponentWithSlug): JSX.Element => {
    const {
        expiryDay,
        subscription_id,
        packet_id,
        is_subscribed,
        everSubscribed,
        lastPacketId
    } = useCourseSubscription(slug);

    const isAuthenticated = useSelector(getIsAuthenticated);

    const subscriptionExpired = !is_subscribed && everSubscribed;
    if (isAuthenticated && (expiryDay <= 7 || subscriptionExpired)) {
        return (
            <div className="flex items-center justify-center my-16 mx-5">
                <div className="border rounded-lg border-accent-yellow p-4 flex flex-col md:flex-row items-center justify-center gap-2">
                    <span className="text-center md:text-left">
                        {subscriptionExpired
                            ? 'Waktu berlangganan kamu sudah habis. Beli lagi untuk terus mengakses layanan Gradient.'
                            : `Waktu berlanggangan kamu akan segera habis dalam ${expiryDay} hari. Perpanjang langganan untuk terus mengakses layanan Gradient.`}
                    </span>
                    <Link
                        href={{
                            pathname: '/pembayaran',
                            query: subscriptionExpired
                                ? { packetId: lastPacketId }
                                : {
                                      packetId: packet_id,
                                      subscriptionId: subscription_id
                                  }
                        }}
                        className="bg-accent-yellow text-black md:w-[250px] font-body text-center px-6 py-2 rounded-full font-semibold">
                        {subscriptionExpired ? 'Beli Lagi' : 'Perpanjang'}
                    </Link>
                </div>
            </div>
        );
    }

    return <></>;
};

export default ExpiryAnnouncement;
