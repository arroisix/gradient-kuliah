import { useRouter } from 'next/router';
import { useGetTransactionQuery } from 'payment/redux/api/transactionApi';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import TransactionCard from '../components/TransactionCard';
import TransactionGuide from '../components/TransactionGuide';
import { isMobile } from 'react-device-detect';
import Skeleton from 'commons/components/elements/Skeleton';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { queryParamBuilder } from 'commons/utils';
import { sendGTMEvent } from '@next/third-parties/google';
import { usePayment } from 'payment/contexts/PaymentProvider';

const TransactionContainer = (): JSX.Element => {
    const router = useRouter();
    const { id, redirect } = router.query;
    const { packet } = usePayment();
    const { isLoading, data } = useGetTransactionQuery(id as string, {
        skip: id === undefined || id === null,
        pollingInterval: 3000
    });

    useEffect(() => {
        if (
            data &&
            data.status === 'WAITING' &&
            data.payment_method.startsWith('ID_')
        ) {
            let redirectUrl: string | undefined;
            const [_, paymentMerchant] = data.payment_method.split('_');
            switch (paymentMerchant) {
                case 'DANA':
                case 'LINKAJA':
                    redirectUrl = isMobile
                        ? (data.ewallet_actions
                              ?.mobile_web_checkout_url as string)
                        : (data.ewallet_actions
                              ?.desktop_web_checkout_url as string);
                    break;
                case 'SHOPEEPAY':
                    redirectUrl = isMobile
                        ? (data.ewallet_actions
                              ?.mobile_deeplink_checkout_url as string)
                        : undefined;
                    break;
            }

            if (redirectUrl) {
                router.push(redirectUrl);
            }
        }
    }, [data]);

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
                    `/checkout/sukses?${queryParamBuilder({
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
    switch (transaction.payment_method) {
        case 'ID_DANA':
            return (
                <div className="flex flex-col items-center justify-center h-[calc(100vh_-_10rem)] gap-6 text-center">
                    <Image
                        src={`${CDN_URL}/assets/redirect_asset.png`}
                        width={197}
                        height={118}
                    />
                    <p className="text-lg font-bold">
                        Kamu akan diarahkan ke halaman checkout Dana...
                    </p>
                </div>
            );
        case 'ID_OVO':
            return (
                <div className="flex flex-col text-center items-center justify-center h-[calc(100vh_-_10rem)] gap-6">
                    <Image
                        src={`${CDN_URL}/assets/waiting_asset.png`}
                        width={116}
                        height={116}
                    />
                    <p className="text-lg font-bold">
                        Menunggu konfirmasi dari aplikasi OVO
                    </p>
                    <p className="text-neutral-400">
                        Buka aplikasi OVO di HP kamu dan konfirmasi pembayaran
                        dalam 55 detik
                    </p>
                </div>
            );
        case 'ID_LINKAJA':
            return (
                <div className="flex flex-col text-center  items-center justify-center h-[calc(100vh_-_10rem)] gap-6">
                    <Image
                        src={`${CDN_URL}/assets/waiting_asset.png`}
                        width={116}
                        height={116}
                    />
                    <div className="space-y-2">
                        <p className="text-lg font-bold">
                            Pembayaran sedang diproses...
                        </p>
                        <p className="text-neutral-400">
                            Kamu akan diarahkan secara otomatis setelah
                            pembayaran berhasil
                        </p>
                    </div>
                </div>
            );
        default:
            return <TransactionCard transaction={transaction} />;
    }
};

export default TransactionContainer;
