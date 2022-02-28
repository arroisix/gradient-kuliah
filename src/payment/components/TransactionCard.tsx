import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
    AiOutlineCheck,
    AiOutlineClockCircle,
    AiOutlineClose
} from 'react-icons/ai';
import { MdChevronRight, MdContentCopy } from 'react-icons/md';
import { formatCurrency } from 'src/commons/utils';
import { checkExpiry } from '../utils';
import { NAME_PAYMENT } from './constant';

const STATUS_COLOR: { [key: string]: string } = {
    SUCCESS: 'bg-state-success',
    WAITING: 'bg-accent-yellow',
    EXPIRY: 'bg-state-error'
};

const TransactionCard = ({
    transaction,
    isList
}: {
    transaction: Transaction;
    isList?: boolean;
}): JSX.Element => {
    const [course, setCourse] = useState({} as Course);
    const { subscribedPacket } = transaction.subscriber || ({} as Subscription);
    const { courses } = subscribedPacket || ({} as Packet);
    const router = useRouter();
    const isExpiry = checkExpiry(transaction.deadline as string);

    useEffect(() => {
        if (courses) {
            setCourse(courses[0]);
        }
    }, [courses]);

    return (
        <div
            className={`rounded-lg bg-[#242424] w-full overflow-hidden ${
                isList && 'mb-4'
            }`}>
            <div className="p-4 md:p-8">
                <div className="w-full flex flex-col-reverse md:flex-row justify-between md:items-center">
                    <div className="w-full">
                        <p className="md:text-2xl font-bold">
                            {course?.courseName}
                        </p>
                        <span className="text-xs md:text-base text-neutral-200">
                            Langganan hingga{' '}
                            {moment()
                                .add(subscribedPacket?.activeDuration, 'M')
                                .format('Do MMMM YYYY')}
                        </span>
                    </div>
                    <div className="text-left md:text-right">
                        <span className="text-base text-neutral-400 uppercase">
                            {transaction.id?.substring(0, 8)}
                        </span>
                    </div>
                </div>
                <div className="w-full grid grid-cols-2 gap-2 md:flex md:justify-between  my-4">
                    <div>
                        <span className="text-xs md:text-base text-neutral-200 uppercase">
                            Total Pembayaran
                        </span>
                        <h3 className="font-bold text-base md:text-4xl">
                            {formatCurrency(transaction.amount)}
                        </h3>
                    </div>
                    <div>
                        <span className="text-xs md:text-base text-neutral-200">
                            Metode Pembayaran
                        </span>
                        <h3 className="font-bold text-base md:text-4xl">
                            {NAME_PAYMENT[transaction.paymentMethod]}
                        </h3>
                    </div>
                    <div>
                        <span className="text-xs md:text-base text-neutral-200">
                            Kode Virtual Account
                        </span>
                        <div className="flex">
                            <h3 className="font-bold text-base md:text-4xl flex cursor-pointer">
                                {transaction.vaNumber}
                            </h3>
                            <MdContentCopy className="text-2xl md:text-4xl ml-2" />
                        </div>
                    </div>
                    <div>
                        <span className="text-xs md:text-base text-neutral-200">
                            Tanggal Pembelian
                        </span>
                        <h3 className="font-bold text-base md:text-4xl">
                            {moment(transaction.createdAt).format(
                                'Do MMM YYYY'
                            )}
                        </h3>
                    </div>
                </div>
            </div>
            <div
                aria-hidden
                onClick={
                    isList && transaction.status === 'WAITING' && !isExpiry
                        ? () => router.push(`/checkout/${transaction.id}`)
                        : undefined
                }
                className={`w-full ${
                    STATUS_COLOR[
                        isExpiry && transaction.status !== 'SUCCESS'
                            ? 'EXPIRY'
                            : transaction.status
                    ]
                } px-4 md:px-8 py-2 flex flex-col md:flex-row ${
                    isList &&
                    transaction.status === 'WAITING' &&
                    'cursor-pointer'
                }`}>
                <div className="flex items-center">
                    {isExpiry && transaction.status !== 'SUCCESS' ? (
                        <div>
                            <AiOutlineClose className="text-3xl" />
                        </div>
                    ) : (
                        <div>
                            {transaction.status === 'SUCCESS' && (
                                <AiOutlineCheck className="text-3xl" />
                            )}
                            {transaction.status === 'WAITING' && (
                                <AiOutlineClockCircle className="text-black text-3xl" />
                            )}
                        </div>
                    )}
                    <div className="ml-2 w-full">
                        {isExpiry && transaction.status !== 'SUCCESS' ? (
                            <>
                                <h6 className="text-xs md:text-base uppercase font-bold text-neutral-800">
                                    PEMBAYARAN GAGAL
                                </h6>
                                <h5 className="text-base md:text-xl font-bold text-white">
                                    Masa waktu bayar habis
                                </h5>
                            </>
                        ) : (
                            <>
                                {transaction.status === 'WAITING' && (
                                    <h6 className="text-xs md:text-base text-[#735103] uppercase font-bold">
                                        Menunggu Pembayaran
                                    </h6>
                                )}
                                {transaction.status === 'SUCCESS' && (
                                    <h6 className="text-base text-white uppercase font-bold">
                                        Pembayaran Berhasil
                                    </h6>
                                )}
                                {transaction.status === 'WAITING' && (
                                    <h5 className="text-base md:text-xl font-bold text-black">
                                        Bayar sebelum{' '}
                                        {moment(transaction.deadline).format(
                                            'Do MMMM YYYY H:mm'
                                        )}{' '}
                                        WIB
                                    </h5>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {!isExpiry && transaction.status === 'WAITING' && (
                    <div className="flex md:justify-end w-full mt-4 md:mt-0 border-t border-neutral-900 py-2 md:border-0 md:py-0">
                        <h5 className="md:text-xl text-black flex justify-between md:justify-start w-full md:w-auto items-center">
                            Lihat cara bayar <MdChevronRight />
                        </h5>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionCard;
