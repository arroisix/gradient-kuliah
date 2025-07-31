'use client';

import WhiteGradientGIcon from 'commons/components/elements/Icons/WhiteGradientGIcon';
import Skeleton from 'commons/components/elements/Skeleton';
import Modal from 'commons/components/modules/Modal';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import Script from 'next/script';
import { useGetUserCardQuery } from 'payment/redux/api/transactionApi';
import { useEffect, useState } from 'react';
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
    const { data: card, isLoading } = useGetUserCardQuery(trx.user_card_id!);
    const [isXenditReady, setIsXenditReady] = useState(false);
    const [iframeUrl, setIframeUrl] = useState();
    const [authStatus, setAuthStatus] = useState<string>('');
    const [authId, setAuthId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleXenditLoad = (): void => {
        if (window.Xendit) {
            window.Xendit.setPublishableKey(
                process.env.NEXT_PUBLIC_XENDIT_KEY as string
            );
            setIsXenditReady(true);
        }
    };

    useEffect(() => {
        if (!isXenditReady || !card || isLoading) return;

        window.Xendit.card.createAuthentication(
            {
                amount: trx.payment_amount.toString(),
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

                setAuthId(resp.id);
                setAuthStatus(resp.status);

                if (
                    resp.status === 'IN_REVIEW' &&
                    resp.payer_authentication_url
                ) {
                    setIframeUrl(resp.payer_authentication_url);
                } else if (resp.status === 'VERIFIED') {
                    setIframeUrl(undefined);
                    console.log('DONE');
                } else {
                    setError(
                        `Authentication returned unexpected status ${resp.status}`
                    );
                }
            }
        );
    }, [card, isLoading, isXenditReady]);

    useEffect(() => {
        if (authStatus === 'VERIFIED') {
            
        }
        console.log({ authStatus });
    }, [authStatus]);

    if (isLoading || !card) {
        return <Skeleton repeat={1} />;
    }

    return (
        <>
            <Script
                src="https://js.xendit.co/v1/xendit.min.js"
                strategy="afterInteractive"
                onLoad={handleXenditLoad}
            />
            <div className="flex flex-col items-center space-y-4 justify-center fixed inset-0">
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
                {error && <p className="mt-2 text-red-300">{error}</p>}
            </div>
            {iframeUrl && (
                <button
                    className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center"
                    onClick={() => setIframeUrl(undefined)}>
                    <div className="bg-white w-[90%] h-[90%] md:w-[500px] md:h-[700px] shadow-lg overflow-hidden">
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
