import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn, formatCurrency } from 'commons/utils';
import Image from 'next/image';
import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

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

    const qrContainerRef = useRef<HTMLDivElement | null>(null);

    // download as PNG
    const downloadQrAsPng = async (): Promise<void> => {
        // helper to load image with CORS
        const loadImg = (src: string): Promise<HTMLImageElement> =>
            new Promise((resolve, reject) => {
                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = (e) => reject(e);
                img.src = src;
            });

        try {
            if (!qrContainerRef.current) {
                toast.error('QR tidak ditemukan');
                return;
            }

            const svgEl = qrContainerRef.current.querySelector(
                'svg'
            ) as SVGSVGElement | null;
            if (!svgEl) {
                toast.error('QR tidak ditemukan');
                return;
            }

            // serialize QR SVG
            const cloned = svgEl.cloneNode(true) as SVGSVGElement;
            if (!cloned.getAttribute('xmlns')) {
                cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            }
            const serializer = new XMLSerializer();
            const svgStr = serializer.serializeToString(cloned);
            const svgBlob = new Blob([svgStr], {
                type: 'image/svg+xml;charset=utf-8'
            });
            const svgUrl = URL.createObjectURL(svgBlob);
            const qrImg = await loadImg(svgUrl);

            // determine brand logo
            const isShopeepay = transaction.payment_method === 'ID_SHOPEEPAY';
            const isGopay = transaction.payment_method === 'GOPAY';
            const brandLogoSrc = isGopay
                ? `${CDN_URL}/assets/payments/gopay.png`
                : isShopeepay
                ? `${CDN_URL}/assets/payments/shopeepay.png`
                : '';
            const brandLogoImg = brandLogoSrc
                ? await loadImg(brandLogoSrc)
                : null;

            // layout metrics
            const padding = 24;
            const gap = 16;
            const qrSize = Math.max(qrImg.width, qrImg.height); // assume square
            const logoHeight = 24; // consistent brand logo height

            // content width is max of QR and logo
            const contentWidth = Math.max(
                qrSize,
                brandLogoImg
                    ? (brandLogoImg.width / brandLogoImg.height) * logoHeight
                    : 0
            );
            const canvasWidth = contentWidth + padding * 2;

            // compute height: optional logo + gap + qr + padding
            let height = padding;
            if (brandLogoImg) height += logoHeight + gap;
            height += qrSize;
            height += padding;

            const scale = window.devicePixelRatio || 1;
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(canvasWidth * scale);
            canvas.height = Math.round(height * scale);
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('no 2d context');

            ctx.scale(scale, scale);

            // white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvasWidth, height);

            let cursorY = padding;

            // draw brand logo if exists
            if (brandLogoImg) {
                const logoW =
                    (brandLogoImg.width / brandLogoImg.height) * logoHeight;
                const xLogo = (canvasWidth - logoW) / 2;
                ctx.drawImage(brandLogoImg, xLogo, cursorY, logoW, logoHeight);
                cursorY += logoHeight + gap;
            }

            // draw QR centered
            const xQr = (canvasWidth - qrSize) / 2;
            ctx.drawImage(qrImg, xQr, cursorY, qrSize, qrSize);

            // export PNG
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        toast.error('Gagal membuat PNG');
                        return;
                    }
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `qr_${transaction.id}.png`;
                    a.click();
                    URL.revokeObjectURL(a.href);
                    URL.revokeObjectURL(svgUrl);
                },
                'image/png',
                1
            );
        } catch (e) {
            toast.error('Gagal mendownload QR PNG');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="font-body text-[#cccccc] text-xs sm:text-sm mb-0.5">
                Scan QR untuk membayar
            </div>
            <div className="mb-3 text-lg font-bold font-body text-[#B6A6F3]">
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
                <div ref={qrContainerRef}>
                    <QRCode
                        size={getQrCodeSize()}
                        value={
                            isShopeepay
                                ? (transaction.ewallet_actions
                                      ?.qr_checkout_string as string)
                                : transaction.qr_string
                        }
                    />
                </div>
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
                            isGopay
                                ? 'screenshot_upload_asset'
                                : 'screenshot_asset'
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
            <Button
                variant="primary"
                className="w-full mt-4"
                onClick={downloadQrAsPng}>
                Download QR
            </Button>
        </div>
    );
};

export default QrisComponent;
