import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const ExpiryAnnouncement = ({
    slug
}: GradientBaseComponentWithSlug): JSX.Element => {
    const { expiryDay, subscription_id, packet_id } =
        useCourseSubscription(slug);

    if (expiryDay <= 7)
        return (
            <div className="w-full flex items-center justify-center my-16">
                <div className="border rounded-lg border-accent-yellow p-4 flex flex-col md:flex-row items-center justify-center gap-2">
                    <span>
                        Waktu berlanggangan Anda akan segera habis dalam{' '}
                        {expiryDay} hari. Perpanjang langganan untuk terus
                        mengakses layanan Gradient.
                    </span>
                    <Button
                        href={`/pembayaran?packetId=${packet_id}&subscriptionId=${subscription_id}`}
                        variant="custom"
                        className="bg-accent-yellow text-black w-full md:w-[250px] font-body text-center">
                        Perpanjang
                    </Button>
                </div>
            </div>
        );

    return <></>;
};

export default ExpiryAnnouncement;
