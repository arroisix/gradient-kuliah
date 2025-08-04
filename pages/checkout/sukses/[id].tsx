import Skeleton from 'commons/components/elements/Skeleton';
import { useGetTransactionQuery } from 'payment/redux/api/transactionApi';
import Layout from 'commons/layout';
import { useRouter } from 'next/router';
import TransactionSuccessIcon from 'commons/components/elements/Icons/TransactionSuccessIcon';
import { formatCurrency } from 'commons/utils';
import moment from 'moment';
import { NAME_PAYMENT } from 'payment/components/constant';
import Button from 'commons/components/elements/Button';
import { useDispatch } from 'react-redux';
import { subscriptionApi } from 'payment/redux/api/subscriptionApi';
import { useCallback, useEffect, useRef } from 'react';
import withAuth from 'commons/withAuth';

const SuccessCheckoutId = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const {
        data: transaction,
        isLoading,
        isError
    } = useGetTransactionQuery(id as string, {
        skip: id === undefined || id === null
    });

    const dispatch = useDispatch<any>();

    const didRedirectRef = useRef(false);
    const timerRef = useRef<number | null>(null);

    const performRedirect = useCallback(() => {
        if (didRedirectRef.current) return;
        didRedirectRef.current = true;
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const redirectUrl = (router.query.redirect ||
            localStorage.getItem('redirect')) as string;

        if (!!redirectUrl) {
            const url = new URL(redirectUrl, window.location.href);
            url.searchParams.append('checkout', 'success');
            localStorage.removeItem('redirect');
            router.push(url.toString());
        } else {
            router.push('/dashboard?checkout=success');
        }

        const getActiveSubscription = dispatch(
            subscriptionApi.endpoints.getActiveSubscription.initiate()
        );
        getActiveSubscription.refetch();
    }, [router, dispatch]);

    useEffect(() => {
        if (!isError) {
            timerRef.current = window.setTimeout(() => {
                performRedirect();
            }, 5000);
        }

        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        };
    }, [performRedirect, isError]);

    const toTitleCase = (str: string): string => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word: string) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    };

    if (isError) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[75vh] font-bold text-lg font-body">
                    Unauthorized Access
                </div>
            </Layout>
        );
    }

    return (
        <Layout isFullBlackBackground>
            <section className="min-h-[75vh] pt-4 px-[7.5rem] flex justify-center items-center flex-col space-y-4">
                {isLoading || !transaction ? (
                    <Skeleton />
                ) : (
                    <div className="rounded-2xl flex-col bg-[#101010] w-full md:w-1/2 p-8 space-y-3">
                        {/* Picutre, success, amount */}
                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-[100px] h-[100px] rounded-full bg-[#222222] flex items-center justify-center">
                                <TransactionSuccessIcon />
                            </div>
                            <span className="text-green-400 font-body text-center text-base">
                                Transaksi Berhasil
                            </span>
                            <span className="text-white font-body font-semibold text-2xl">
                                {formatCurrency(
                                    transaction.payment_amount.toString()
                                )}
                            </span>
                        </div>

                        {/* Transaction details */}
                        <div className="grid grid-cols-2 grid-rows-4 gap-3">
                            <span className="text-neutral-400 text-sm text-left">
                                No. Transaksi
                            </span>
                            <span className="text-white text-sm text-right">
                                {transaction.id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="text-neutral-400 text-sm text-left">
                                Detail Paket
                            </span>
                            <span className="text-white text-sm text-right">
                                {
                                    transaction.subscriber.subscribed_packet
                                        .packet_name
                                }
                            </span>
                            <span className="text-neutral-400 text-sm text-left">
                                Waktu Transaksi
                            </span>
                            <span className="text-white text-sm text-right">
                                {moment(transaction.created_at)
                                    .utc(true)
                                    .format('D MMM YYYY, hh:mm')}
                            </span>
                            <span className="text-neutral-400 text-sm text-left">
                                Metode Bayar
                            </span>
                            <span className="text-white text-sm text-right">
                                {NAME_PAYMENT[transaction.payment_method]}
                            </span>
                        </div>

                        <div className="h-0 border border-[#4D5165]"></div>

                        {/* Price details */}
                        <div className="grid grid-cols-2 grid-rows-2 space-y-3">
                            <span className="text-neutral-400 text-sm text-left">
                                Harga Paket
                            </span>
                            <span className="text-white text-sm text-right">
                                {formatCurrency(transaction.amount.toString())}
                            </span>
                            {transaction.promo && (
                                <>
                                    <span className="text-neutral-400 text-sm text-left">
                                        Diskon{' '}
                                        {toTitleCase(
                                            transaction.promo.promo_type
                                        )}{' '}
                                        {transaction.promo.code}
                                    </span>
                                    <span className="text-green-400 text-sm text-right">
                                        -
                                        {formatCurrency(
                                            transaction.discount_amount.toString()
                                        )}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="h-0 border border-[#4D5165] border-dashed"></div>

                        {/* Total payment */}
                        <div className="grid grid-cols-2 grid-rows-1 gap-3">
                            <span className="text-neutral-400 text-sm text-left">
                                Total Bayar
                            </span>
                            <span className="text-white text-sm text-right">
                                {formatCurrency(
                                    transaction.payment_amount.toString()
                                )}
                            </span>
                        </div>
                    </div>
                )}
                <Button
                    variant="primary"
                    className="w-full md:w-1/2"
                    onClick={performRedirect}>
                    Kembali ke Halaman Utama
                </Button>
            </section>
        </Layout>
    );
};

SuccessCheckoutId.displayName = 'Success Checkout Id';
export default withAuth(SuccessCheckoutId);
