import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'commons/components/elements/Button';
import useCheckout from '../hooks/useCheckout';

const CheckoutButton = ({
    packetId,
    paymentMethod,
    isFree
}: {
    packetId: string;
    paymentMethod: PaymentMethod;
    isFree?: boolean;
}): JSX.Element => {
    const { checkout, freeCheckout, extendCheckout } = useCheckout();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { subscriptionId } = router.query;

    const onClick = async (): Promise<void> => {
        setLoading(true);

        if (subscriptionId) {
            const data = (await extendCheckout({
                inputData: {
                    packet_id: packetId,
                    payment_method: paymentMethod
                },
                subscriptionId: subscriptionId as string
            })) as unknown as SingleResponseData<Transaction>;

            if (data) {
                const transaction = data.data;

                toast.info(
                    `Silahkan lanjutkan proses pembayaran sesuai metode yang kamu pilih`,
                    {
                        position: toast.POSITION.TOP_CENTER
                    }
                );

                router.push(`/checkout/${transaction.id}`);
            }
        } else {
            const data = (await checkout({
                packet_id: packetId,
                payment_method: paymentMethod
            })) as unknown as SingleResponseData<Transaction>;

            if (data) {
                const transaction = data.data;

                toast.info(
                    `Silahkan lanjutkan proses pembayaran sesuai metode yang kamu pilih`,
                    {
                        position: toast.POSITION.TOP_CENTER
                    }
                );

                router.push(`/checkout/${transaction.id}`);
            }
        }

        setLoading(false);
    };

    const onClickFree = async (): Promise<void> => {
        setLoading(true);
        try {
            await freeCheckout({ packet_id: packetId });

            toast.success(`Pembayaran Sukses!`, {
                position: toast.POSITION.TOP_CENTER
            });
            router.push('/checkout/sukses');
        } catch {
            toast.error(`Pembayaran Gagal!`, {
                position: toast.POSITION.TOP_CENTER
            });
        }
        setLoading(false);
    };

    return (
        <Button
            variant="primary"
            onClick={isFree ? onClickFree : onClick}
            className="w-full">
            {loading ? 'Memproses Pembayaran...' : 'Proses Pembayaran'}
        </Button>
    );
};

export default CheckoutButton;
