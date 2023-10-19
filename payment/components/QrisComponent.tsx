import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn, formatCurrency } from 'commons/utils';
import Image from 'next/image';
import React from 'react';
import QRCode from 'react-qr-code';

type QrisComponentProps = {
    transaction: Transaction;
};

const QrisComponent = ({ transaction }: QrisComponentProps): JSX.Element => {
    const { isMobileBreakpoints, checkCustomBreakpoints } =
        useWindowBreakpoints();

    const showQris = ['QRIS', 'GOPAY', 'ID_SHOPEEPAY'];
    if (!showQris.includes(transaction.payment_method)) return <></>;
    const isShopeepay = transaction.payment_method === 'ID_SHOPEEPAY';
    const isGopay = transaction.payment_method === 'GOPAY';
    const isQris = transaction.payment_method === 'QRIS';

    const getQrCodeSize = (): number => {
        if (isMobileBreakpoints) return 226;
        if (!checkCustomBreakpoints(2560)) return 440; // for screens larger than 2560
        if (!checkCustomBreakpoints(1441)) return 350; // for screens larger than 1440
        return 158;
    };

    return (
        <div className="flex flex-col items-center">
            <div className="font-body text-[#cccccc] text-xs sm:text-sm mb-0.5">
                Scan QR untuk membayar
            </div>
            <div className="mb-3 text-lg font-bold">
                {formatCurrency(`${transaction.payment_amount}`)}
            </div>
            <div
                className={cn(
                    'flex flex-col items-center gap-2 px-6 mt-1 bg-white rounded-lg',
                    isShopeepay ? 'pt-2 pb-4' : 'py-4'
                )}>
                {transaction.payment_method === 'GOPAY' && (
                    <Image
                        src={`${CDN_URL}/assets/payments/gopay.png`}
                        width={105}
                        height={24}
                        objectFit="contain"
                    />
                )}
                {isShopeepay && (
                    <Image
                        src={`${CDN_URL}/assets/payments/shopeepay.png`}
                        width={92}
                        height={32}
                        objectFit="contain"
                    />
                )}
                <QRCode
                    size={getQrCodeSize()}
                    value={
                        isShopeepay
                            ? (transaction.ewallet_actions
                                  ?.qr_checkout_string as string)
                            : transaction.qr_string
                    }
                />
                {!isShopeepay && (
                    <div className="flex items-center gap-2 mt-4 text-xs text-neutral-800">
                        Powered by{' '}
                        <Image
                            src={`${CDN_URL}/assets/payments/qris.png`}
                            width={41}
                            height={14}
                        />
                    </div>
                )}
            </div>
            {isMobileBreakpoints && (isQris || isGopay) && (
                <div className="flex w-full gap-4 p-4 mt-4 rounded-lg bg-accent-purple/20">
                    <Image
                        src={`${CDN_URL}/assets/${
                            isGopay ? 'screenshot_upload' : 'screenshot'
                        }.png`}
                        width={64}
                        height={64}
                        objectFit="contain"
                        className="flex-none h-full aspect-square"
                    />
                    <div className="flex-1">
                        <p className="mb-2 text-sm font-bold">
                            Membuka dari HP?
                        </p>
                        <p className="text-xs">
                            {isGopay
                                ? 'Screenshot QR dan upload di halaman scan QR Gojek dengan menekan icon di samping'
                                : 'Screenshot QR dan upload di app pembayaran pilihanmu'}
                        </p>
                    </div>
                </div>
            )}
            {isShopeepay && isMobileBreakpoints && (
                <Button
                    href={
                        transaction.ewallet_actions
                            ?.mobile_deeplink_checkout_url ?? '#'
                    }
                    variant="primary"
                    className="mt-4">
                    atau Klik di Sini
                </Button>
            )}
        </div>
    );
};

export default QrisComponent;
