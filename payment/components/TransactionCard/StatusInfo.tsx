import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { MdChevronRight } from 'react-icons/md';

type StatusInfoProps = {
    isExpiry: boolean;
    isList?: boolean;
    hasUpcoming?: boolean;
    packetId: Subscription['id'];
} & Pick<Transaction, 'status' | 'id' | 'payment_method' | 'deadline'>;

const StatusInfo = ({
    isExpiry,
    isList,
    status,
    id: transactionId,
    packetId,
    deadline,
    payment_method,
    hasUpcoming
}: StatusInfoProps): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const router = useRouter();

    if (isExpiry && status !== 'SUCCESS') {
        return (
            <div
                className="flex justify-center items-center gap-[6px] mt-[18px] px-3 py-2 bg-[#E9202A1A] border border-[#E9202A1A] rounded"
                onClick={() =>
                    isMobileBreakpoints
                        ? router.push(`/pembayaran?packetId=${packetId}`)
                        : null
                }
                aria-hidden>
                {!hasUpcoming && (
                    <p className="font-body text-[#CCCCCC80] text-xs sm:text-sm">
                        Masa waktu bayar habis.{' '}
                        <Link
                            href={`/pembayaran?packetId=${packetId}`}
                            className="flex gap-2 items-center text-[#CCCCCC] cursor-pointer hover:underline">
                            Beli lagi{' '}
                            <div className="w-[18px] h-[18px] cursor-pointer">
                                <MdChevronRight size={18} />
                            </div>
                        </Link>
                    </p>
                )}
            </div>
        );
    } else if (status === 'WAITING') {
        const isPaymentWithQR: PaymentMethod[] = [
            'ID_SHOPEEPAY',
            'GOPAY',
            'QRIS'
        ];
        const isShowLink = isPaymentWithQR.includes(payment_method);
        return (
            <div
                aria-hidden
                className="flex justify-center items-center gap-[6px] mt-[18px] px-3 py-2 bg-[#F2C04C1A] border border-[#F2C04C1A] rounded font-body text-[#CCCCCC80] text-xs sm:text-sm"
                onClick={() => localStorage.setItem('packetId', packetId)}>
                {`Bayar sebelum ${moment(deadline)
                    .utc()
                    .format('D MMM YYYY HH:mm')} WIB. `}
                {isList && !isShowLink && (
                    <Link
                        className="text-[#CCCCCC] cursor-pointer hover:underline flex items-center"
                        href={`/checkout/${transactionId}`}>
                        Lihat cara bayar
                        <MdChevronRight size={18} />
                    </Link>
                )}
            </div>
        );
    }

    return <></>;
};

export default StatusInfo;
