import { useAuth } from 'authentication/contexts/AuthProvider';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useSelector } from 'react-redux';

const SubscribeButton = ({
    slug,
    packetId,
    className,
    label = 'Gabung Sekarang'
}: {
    slug?: string;
    packetId?: string;
    className?: string;
    label?: string;
}): JSX.Element => {
    const { is_subscribed } = useCourseSubscription(slug);
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <>
            {isAuthenticated && !is_subscribed && (
                <Button
                    className={`text-center my-2 z-[5] ${
                        className ?? 'md:w-fit min-w-[200px]'
                    }`}
                    variant="primary"
                    href={
                        packetId
                            ? `/pembayaran?packetId=${packetId}`
                            : `/langganan`
                    }>
                    Akses Sekarang
                </Button>
            )}
            {!isAuthenticated && !is_subscribed && (
                <Button
                    className={`text-center my-2 z-[5] ${
                        className ?? 'md:w-fit min-w-[200px]'
                    }`}
                    variant="primary"
                    onClick={() => setModalAuthOpen(1, false, `/langganan`)}>
                    {label}
                </Button>
            )}
        </>
    );
};

export default SubscribeButton;
