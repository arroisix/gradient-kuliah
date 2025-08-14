'use client';

import WhiteGradientGIcon from 'commons/components/elements/Icons/WhiteGradientGIcon';
import Skeleton from 'commons/components/elements/Skeleton';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import Script from 'next/script';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useCompleteCardCheckoutMutation } from 'payment/redux/api/subscriptionApi';
import { useGetUserCardQuery } from 'payment/redux/api/transactionApi';
import { useCallback, useEffect, useState } from 'react';
import { TbArrowsLeftRight } from 'react-icons/tb';

declare global {
    interface Window {
        Xendit: any;
    }
}

const AuthenticateCreditCardContainer = ({
    trx
}: {
    trx: Transaction;
}): JSX.Element => {
    const { tempCard, setTempCard } = usePayment();

    // if we came in with no saved card, but have a tempCard
    const isTemp = !trx.user_card_id && !!tempCard?.card_token;
    const skipGet = isTemp || !trx.user_card_id;
    const { data: storedCard, isLoading: loadingCard } = useGetUserCardQuery(
        trx.user_card_id as string,
        { skip: skipGet }
    );
    const card = isTemp ? tempCard : storedCard;
    const isLoading = loadingCard && !isTemp;

    const [completeCardCheckout] = useCompleteCardCheckoutMutation();
    const [isXenditReady, setIsXenditReady] = useState(false);
    const [iframeUrl, setIframeUrl] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    useEffect(() => {
        if (!trx?.status) return;
        const status = String(trx.status).toUpperCase();

        const isFailure = status.toUpperCase() === 'FAILURE';

        if (isFailure) {
            setIframeUrl(undefined);
            setSuccess(undefined);
            setError(
                `Pembayaran gagal. Silakan coba lagi atau gunakan metode pembayaran lain. ${
                    trx.failure_code
                        ? `Alasan: ${trx.failure_code.replaceAll('_', ' ')}`
                        : ''
                }`
            );
        }
    }, [trx.status]);

    const handleXenditLoad = (): void => {
        if (window.Xendit) {
            window.Xendit.setPublishableKey(
                process.env.NEXT_PUBLIC_XENDIT_KEY as string
            );
            setIsXenditReady(true);
        }
    };

    const start3DS = useCallback((): void => {
        if (!isXenditReady || !card || isLoading) return;

        window.Xendit.card.createAuthentication(
            {
                amount: Math.floor(trx.payment_amount),
                token_id: card.card_token,
                external_id: trx.id
            },
            (err: any, resp: any) => {
                if (err) {
                    console.error('3DS error', err);
                    // detect expired token / invalid CVV
                    if (
                        err.code === 'INVALID_CVN' ||
                        err.message.includes('cvn') ||
                        err.message.includes('invalid_cvv')
                    ) {
                        return setError(
                            'Your session expired—please re-enter CVV to retry.'
                        );
                    }
                    return setError(err.message);
                }

                if (
                    resp.status === 'IN_REVIEW' &&
                    resp.payer_authentication_url
                ) {
                    setIframeUrl(resp.payer_authentication_url);
                } else if (resp.status === 'VERIFIED') {
                    setSuccess(
                        'Verifikasi berhasil! Mohon tunggu, kamu akan diarahkan ke halaman berikutnya...'
                    );
                    setIframeUrl(undefined);
                    (async () => {
                        try {
                            await completeCardCheckout({
                                transaction_id: trx.id,
                                authentication_id: resp.id,
                                user_card_token: isTemp
                                    ? card.card_token
                                    : undefined
                            }).unwrap();

                            if (isTemp) {
                                setTempCard(undefined);
                            }
                        } catch (e: any) {
                            setSuccess(undefined);
                            setError(
                                'Verifikasi berhasil, tetapi penyelesaian transaksi gagal. Silakan coba lagi.'
                            );
                        }
                    })();
                } else {
                    setError(
                        `Authentication returned unexpected status ${resp.status}`
                    );
                }
            }
        );
    }, [
        card,
        completeCardCheckout,
        isLoading,
        isTemp,
        isXenditReady,
        setTempCard,
        trx.id,
        trx.payment_amount
    ]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Xendit && !isXenditReady) {
            handleXenditLoad();
        }
    }, [isXenditReady]);

    useEffect(() => {
        start3DS();
    }, [start3DS]);

    if (isLoading) {
        return <Skeleton repeat={1} />;
    }

    return (
        <>
            <Script
                src="https://js.xendit.co/v1/xendit.min.js"
                strategy="afterInteractive"
                onLoad={handleXenditLoad}
            />
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
                                        src={`${CDN_URL}/assets/payments/${trx.payment_method
                                            .substring('CARD_'.length)
                                            .toLowerCase()}.png`}
                                        alt={`${trx.payment_method}`}
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

                <span className="text-center text-lg font-bold text-white">
                    Kamu akan diarahkan ke halaman verifikasi
                </span>
                <button
                    onClick={start3DS}
                    className="text-sm text-[#7264EB] underline">
                    Atau klik di sini untuk verifikasi manual
                </button>
                {error && (
                    <span className="mt-2 text-red-400 text-center">
                        {error}
                    </span>
                )}
                {success && (
                    <span className="mt-2 text-green-400 text-center">
                        {success}
                    </span>
                )}
            </div>
            {iframeUrl && (
                <button
                    className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center cursor-default"
                    onClick={() => setIframeUrl(undefined)}>
                    <div className="bg-white w-[90%] h-[90%] shadow-lg overflow-hidden">
                        <iframe
                            src={iframeUrl}
                            title="3-D Secure Authentication"
                            className="w-full h-full"
                        />
                    </div>
                </button>
            )}
        </>
    );
};

export default AuthenticateCreditCardContainer;
