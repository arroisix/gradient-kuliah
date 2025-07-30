import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'commons/components/elements/Button';
import useCheckout from '../hooks/useCheckout';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { queryParamBuilder } from 'commons/utils';
import { sendGTMEvent } from '@next/third-parties/google';

const CheckoutButton = ({
    packetId,
    paymentMethod,
    isFree,
    promoCode,
    disabled,
    phoneNumber
}: {
    packetId: string;
    paymentMethod: PaymentMethod;
    isFree?: boolean;
    promoCode?: string | null;
    disabled?: boolean;
    phoneNumber?: string;
}): JSX.Element => {
    const { checkout, freeCheckout, extendCheckout } = useCheckout();
    const { packet, setModalCheckoutOpen } = usePayment();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { subscriptionId, redirect } = router.query;

    const onClick = async (): Promise<void> => {
        setLoading(true);

        if (subscriptionId) {
            const data = (await extendCheckout({
                inputData: {
                    packet_id: packetId,
                    payment_method: paymentMethod,
                    promo_code:
                        promoCode !== '' &&
                        promoCode !== null &&
                        promoCode !== undefined
                            ? promoCode
                            : null
                },
                subscriptionId: subscriptionId as string
            })) as unknown as SingleResponseData<Transaction>;

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
        } else {
            const data = (await checkout({
                packet_id: packetId,
                payment_method: paymentMethod,
                promo_code:
                    promoCode !== '' &&
                    promoCode !== null &&
                    promoCode !== undefined
                        ? promoCode
                        : null,
                phone_number: phoneNumber
            })) as unknown as SingleResponseData<Transaction>;

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
                    router.push('/checkout/sukses');
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
            router.push(
                `/checkout/sukses${queryParamBuilder({
                    redirect: router.query.redirect as string
                })}`
            );
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
            disabled={disabled}
            eventName="Process Payment Button"
            eventPayload={{ 'Method Name': paymentMethod }}>
            {loading ? 'Memproses Pembayaran...' : 'Proses Pembayaran'}
        </Button>
    );
};

export default CheckoutButton;
