import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import { getCSChatRoom } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { addZeroBefore } from 'courses/utils';
import { useGetDetailPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { useSelector } from 'react-redux';

const SubscribeButton = ({
    slug,
    packetId,
    className,
    label = 'Gabung Sekarang',
    eventName,
    eventPayload
}: {
    slug?: string;
    packetId?: string;
    className?: string;
    label?: string;
    eventName?: string;
    eventPayload?: Record<string, unknown>;
}): JSX.Element => {
    const { is_subscribed } = useCourseSubscription(slug);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: packet } = useGetDetailPacketOfferQuery(packetId as string, {
        skip: packetId === null || packetId === undefined
    });
    const currentDate = new Date();

    return (
        <>
            {isAuthenticated && !is_subscribed && (
                <Button
                    className={`text-center my-2 z-[5] ${
                        className ?? 'md:w-fit min-w-[200px]'
                    }`}
                    variant="primary"
                    target={packetId ? '__blank' : undefined}
                    eventName={eventName}
                    eventPayload={eventPayload}
                    href={
                        packetId
                            ? getCSChatRoom(
                                  'IG',
                                  encodeURIComponent(
                                      `Halo,saya tertarik untuk berlangganan ${
                                          packet?.packet_name
                                      }\n\n[ID:${currentDate.getDate()}${addZeroBefore(
                                          currentDate.getMonth() + 1
                                      )}${currentDate.getFullYear()}]`
                                  )
                              )
                            : `/langganan`
                    }>
                    Akses Sekarang
                </Button>
            )}
            {!isAuthenticated && !is_subscribed && (
                <Button
                    href={`${AUTHENTICATION_ROUTE}?redirect=/langganan`}
                    className={`text-center my-2 z-[5] ${
                        className ?? 'md:w-fit min-w-[200px]'
                    }`}
                    eventName={eventName}
                    eventPayload={eventPayload}
                    variant="primary">
                    {label}
                </Button>
            )}
        </>
    );
};

export default SubscribeButton;
