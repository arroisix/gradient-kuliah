import { useRouter } from 'next/router';
import { useGetTransactionQuery } from 'payment/redux/api/transactionApi';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import TransactionCard from '../components/TransactionCard';
import TransactionGuide from '../components/TransactionGuide2';
import { isMobile } from 'react-device-detect';
import Skeleton from 'commons/components/elements/Skeleton';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { queryParamBuilder } from 'commons/utils';
import { sendGTMEvent } from '@next/third-parties/google';
import { usePayment } from 'payment/contexts/PaymentProvider';
import AuthenticateCreditCardContainer from './AuthenticateCreditCardContainer';
import VATransactionCard from 'payment/components/TransactionCard/VATransactionCard';
import { TbArrowsLeftRight } from 'react-icons/tb';
import WhiteGradientGIcon from 'commons/components/elements/Icons/WhiteGradientGIcon';
import { LOGO_PAYMENT, NAME_PAYMENT } from 'payment/components/constant';

const TransactionContainer = (): JSX.Element => {
    const router = useRouter();
    const { id, redirect } = router.query;
    const { packet } = usePayment();
    const { isLoading, data } = useGetTransactionQuery(id as string, {
        skip: id === undefined || id === null,
        pollingInterval: 3000
    });

    // useEffect(() => {
    //     if (
    //         data &&
    //         data.status === 'WAITING' &&
    //         data.payment_method.startsWith('ID_')
    //     ) {
    //         let redirectUrl: string | undefined;
    //         const [_, paymentMerchant] = data.payment_method.split('_');
    //         switch (paymentMerchant) {
    //             case 'DANA':
    //             case 'LINKAJA':
    //                 redirectUrl = isMobile
    //                     ? (data.ewallet_actions
    //                           ?.mobile_web_checkout_url as string)
    //                     : (data.ewallet_actions
    //                           ?.desktop_web_checkout_url as string);
    //                 break;
    //             case 'SHOPEEPAY':
    //                 redirectUrl = isMobile
    //                     ? (data.ewallet_actions
    //                           ?.mobile_deeplink_checkout_url as string)
    //                     : undefined;
    //                 break;
    //         }

    //         if (redirectUrl) {
    //             router.push(redirectUrl);
    //         }
    //     }
    // }, [data]);

    useEffect(() => {
        if (data) {
            if (data.status === 'SUCCESS') {
                sendGTMEvent({
                    event: 'purchase',
                    ecommerce: {
                        transaction_id: data.id,
                        currency: 'IDR',
                        value: parseInt(data.amount),
                        payment_type: data.payment_method,
                        items: [
                            {
                                item_id: packet?.packet_name,
                                price: packet?.price
                            }
                        ]
                    }
                });

                toast.success(`Pembayaran Sukses!`, {
                    position: toast.POSITION.TOP_CENTER
                });
                router.push(
                    `/checkout/sukses/${data.id}?${queryParamBuilder({
                        redirect: redirect as string
                    })}`
                );
            }
        }
    }, [data]);

    return (
        <section className="flex-1 py-24 px-4 md:px-[7.5rem] flex flex-col">
            {isLoading && <Skeleton />}
            {data && <Transaction transaction={data as Transaction} />}
            <TransactionGuide />
        </section>
    );
};

const Transaction = ({
    transaction
}: {
    transaction: Transaction;
}): JSX.Element => {
    if (transaction.payment_method.startsWith('CARD_')) {
        return <AuthenticateCreditCardContainer trx={transaction} />;
    }
    if (transaction.payment_method.startsWith('VA_')) {
        return <VATransactionCard transaction={transaction} />;
    }

    switch (transaction.payment_method) {
        case 'ID_DANA':
        case 'ID_OVO':
        case 'ID_LINKAJA':
            return <RedirectContainer method={transaction.payment_method} />;
        default:
            return <TransactionCard transaction={transaction} />;
    }
};

const RedirectContainer = ({
    method
}: {
    method: PaymentMethod;
}): JSX.Element => {
    return (
        <div className="flex flex-col items-center space-y-4 justify-center min-h-[60vh]">
            <div className="relative">
                <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center shadow border border-graphite-600">
                        <WhiteGradientGIcon />
                    </div>

                    <div className="w-24 h-24 rounded-full flex items-center justify-center shadow border border-graphite-600">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
                            <div className="relative w-10 h-10">
                                <Image
                                    src={`${CDN_URL}/assets/payments/mobile-${LOGO_PAYMENT[method]}`}
                                    alt={`${method}`}
                                    layout="fill"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent-purple flex items-center justify-center">
                    <TbArrowsLeftRight className="text-white" size={24} />
                </div>
            </div>

            {method === 'ID_OVO' ? (
                <>
                    <span className="text-center text-lg font-bold text-white">
                        Buka OVO dan selesaikan transaksi
                    </span>
                    <span className="text-center text-md text-neutral-400">
                        Klik notifikasi OVO di HP kamu dan konfirmasi pembayaran
                        dalam 55 detik
                    </span>
                </>
            ) : (
                <>
                    <span className="text-center text-lg font-bold text-white">
                        Kamu akan diarahkan ke {NAME_PAYMENT[method]}
                    </span>
                    <span className="text-center text-md text-neutral-400">
                        Lakukan pembayaran melalui {NAME_PAYMENT[method]} untuk
                        menyelesaikan transaksi
                    </span>
                </>
            )}
        </div>
    );
};

export default TransactionContainer;
