import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'commons/components/elements/Button';
import useCheckout from '../hooks/useCheckout';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { queryParamBuilder } from 'commons/utils';
import { sendGTMEvent } from '@next/third-parties/google';

const TopupButton = ({
    paymentMethod,
    promoCode,
    disabled,
    phoneNumber,
    userCardId
}: {
    paymentMethod: PaymentMethod;
    promoCode?: string | null;
    disabled?: boolean;
    phoneNumber?: string;
    userCardId?: string;
}): JSX.Element => {
    const { topup } = useCheckout();
    const { packet, setModalCheckoutOpen, tempCard, topupAmount } =
        usePayment();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { redirect } = router.query;

    const onClick = async (): Promise<void> => {
        setLoading(true);
        const data = (await topup({
            topup_price: topupAmount,
            payment_method: paymentMethod,
            promo_code:
                promoCode !== '' &&
                promoCode !== null &&
                promoCode !== undefined
                    ? promoCode
                    : null,
            phone_number: phoneNumber,
            user_card_id: userCardId === 'temp_card' ? undefined : userCardId
        })) as unknown as SingleResponseData<Transaction>;

        if (paymentMethod.startsWith('CARD_') && userCardId === 'temp_card') {
            localStorage.setItem('tempCard', JSON.stringify(tempCard));
        }

        if (!!data?.data) {
            const transaction = data.data;
            sendGTMEvent({
                event: 'begin_checkout',
                ecommerce: {
                    transaction_id: transaction.id,
                    currency: 'IDR',
                    value: parseInt(transaction.amount ?? '0'),
                    payment_type: transaction.payment_method,
                    items: [
                        {
                            item_id: packet?.packet_name,
                            price: packet?.price
                        }
                    ]
                }
            });

            if (transaction.payment_method === 'VOUCHER') {
                toast.success(`Redeem kode voucher berhasil!`, {
                    position: toast.POSITION.TOP_CENTER
                });
                router.push(`/checkout/sukses/${transaction.id}`);
            } else {
                toast.info(
                    `Silahkan lanjutkan proses pembayaran sesuai metode yang kamu pilih`,
                    { position: toast.POSITION.TOP_CENTER }
                );
                router.push(
                    `/checkout/${transaction.id}?${queryParamBuilder({
                        redirect: redirect as string
                    })}`
                );
            }
        }

        setModalCheckoutOpen(false);
        setLoading(false);
    };

    return (
        <Button
            variant="primary"
            onClick={onClick}
            className="w-full hover:scale-105"
            disabled={disabled}
            eventName="Process Topup Button"
            eventPayload={{ 'Method Name': paymentMethod }}>
            {loading ? 'Memproses...' : 'Bayar'}
        </Button>
    );
};

export default TopupButton;
