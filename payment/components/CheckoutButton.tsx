import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'commons/components/elements/Button';
import useCheckout from '../hooks/useCheckout';

const CheckoutButton = ({
    packetId,
    paymentMethod
}: {
    packetId: string;
    paymentMethod: PaymentMethod;
}): JSX.Element => {
    const { checkout } = useCheckout();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onClick = async (): Promise<void> => {
        setLoading(true);
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
        setLoading(false);
    };

    return (
        <Button variant="primary" onClick={onClick} className="w-full">
            {loading ? 'Memproses Pembayaran...' : 'Proses Pembayaran'}
        </Button>
    );
};

export default CheckoutButton;
