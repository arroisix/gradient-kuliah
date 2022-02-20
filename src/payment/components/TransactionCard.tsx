import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineCheck, AiOutlineClockCircle } from 'react-icons/ai';
import { MdChevronRight, MdContentCopy } from 'react-icons/md';
import { formatCurrency } from 'src/commons/utils';
import { NAME_PAYMENT } from './constant';

const STATUS_COLOR: { [key: string]: string } = {
    SUCCESS: 'bg-state-success',
    WAITING: 'bg-accent-yellow'
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
            <div className="p-8">
                <div className="w-full flex justify-between items-center">
                    <div className="w-full">
                        <p className="text-2xl font-bold">
                            {course?.courseName}
                        </p>
                        <span className="text-base text-neutral-200">
                            Langganan hingga{' '}
                            {moment()
                                .add(subscribedPacket?.activeDuration, 'M')
                                .format('Do MMMM YYYY')}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-base text-neutral-400 uppercase">
                            {transaction.id?.substring(0, 8)}
                        </span>
                    </div>
                </div>
                <div className="w-full flex justify-between my-4">
                    <div>
                        <span className="text-base text-neutral-200 uppercase">
                            Total Pembayaran
                        </span>
                        <h3 className="font-bold text-4xl">
                            {formatCurrency(transaction.amount)}
                        </h3>
                    </div>
                    <div>
                        <span className="text-base text-neutral-200">
                            Metode Pembayaran
                        </span>
                        <h3 className="font-bold text-4xl">
                            {NAME_PAYMENT[transaction.paymentMethod]}
                        </h3>
                    </div>
                    <div>
                        <span className="text-base text-neutral-200">
                            Kode Virtual Account
                        </span>
                        <h3 className="font-bold text-4xl flex cursor-pointer">
                            {transaction.vaNumber}
                            <MdContentCopy className="ml-2" />
                        </h3>
                    </div>
                    <div>
                        <span className="text-base text-neutral-200">
                            Tanggal Pembelian
                        </span>
                        <h3 className="font-bold text-4xl">
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
                    isList && transaction.status === 'WAITING'
                        ? () => router.push(`/checkout/${transaction.id}`)
                        : undefined
                }
                className={`w-full ${
                    STATUS_COLOR[transaction.status]
                } px-8 py-2 flex items-center ${
                    isList &&
                    transaction.status === 'WAITING' &&
                    'cursor-pointer'
                }`}>
                <div>
                    {transaction.status === 'SUCCESS' && (
                        <AiOutlineCheck className="text-3xl" />
                    )}
                    {transaction.status === 'WAITING' && (
                        <AiOutlineClockCircle className="text-black text-3xl" />
                    )}
                </div>
                <div className="ml-2 w-full">
                    {transaction.status === 'WAITING' && (
                        <h6 className="text-base text-[#735103] uppercase font-bold">
                            Menunggu Pembayaran
                        </h6>
                    )}
                    {transaction.status === 'SUCCESS' && (
                        <h6 className="text-base text-white uppercase font-bold">
                            Pembayaran Berhasil
                        </h6>
                    )}
                    {transaction.status === 'WAITING' && (
                        <h5 className="text-xl font-bold text-black">
                            Bayar sebelum{' '}
                            {moment(transaction.deadline).format(
                                'Do MMMM YYYY H:mm'
                            )}{' '}
                            WIB
                        </h5>
                    )}
                </div>
                {transaction.status === 'WAITING' && (
                    <div className="flex justify-end w-full">
                        <h5 className="text-xl text-black flex items-center">
                            Lihat cara bayar <MdChevronRight />
                        </h5>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionCard;
