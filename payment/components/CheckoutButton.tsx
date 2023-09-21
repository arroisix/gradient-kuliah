import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'commons/components/elements/Button';
import useCheckout from '../hooks/useCheckout';
import { usePayment } from 'payment/contexts/PaymentProvider';

const CheckoutButton = ({
    packetId,
    paymentMethod,
    isFree,
    promoCode,
    disabled
}: {
    packetId: string;
    paymentMethod: PaymentMethod;
    isFree?: boolean;
    promoCode?: string;
    disabled?: boolean;
}): JSX.Element => {
    const { checkout, freeCheckout, extendCheckout } = useCheckout();
    const { setModalCheckoutOpen } = usePayment();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { subscriptionId } = router.query;

    const onClick = async (): Promise<void> => {
        setLoading(true);

        if (subscriptionId) {
            const data = (await extendCheckout({
                inputData: {
                    packet_id: packetId,
                    payment_method: paymentMethod,
                    promo_code: promoCode !== '' ? promoCode : null
                },
                subscriptionId: subscriptionId as string
            })) as unknown as SingleResponseData<Transaction>;

            if (!!data?.data) {
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
                payment_method: paymentMethod,
                promo_code: promoCode !== '' ? promoCode : null
            })) as unknown as SingleResponseData<Transaction>;

            if (!!data?.data) {
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

        setModalCheckoutOpen(false);
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
            className="w-full"
            disabled={disabled}>
            {loading ? 'Memproses Pembayaran...' : 'Proses Pembayaran'}
        </Button>
    );
};

export default CheckoutButton;
