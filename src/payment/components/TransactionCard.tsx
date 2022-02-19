import moment from 'moment';
import { useEffect, useState } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { MdContentCopy } from 'react-icons/md';
import { formatCurrency } from 'src/commons/utils';
import { useCheckout } from '../contexts/TransactionProvider';
import { NAME_PAYMENT } from './constant';

const TransactionCard = (): JSX.Element => {
    const [course, setCourse] = useState({} as Course);
    const { transaction } = useCheckout();
    const { subscribedPacket } = transaction.subscriber || ({} as Subscription);
    const { courses } = subscribedPacket || ({} as Packet);

    useEffect(() => {
        if (courses) {
            setCourse(courses[0]);
        }
    }, [courses]);

    return (
        <div className="rounded-lg bg-[#242424] w-full overflow-hidden">
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
            <div className="w-full bg-accent-yellow p-8 flex items-center">
                <AiOutlineClockCircle className="text-black text-3xl" />
                <div className="ml-2">
                    <h6 className="text-base text-[#735103] uppercase font-bold">
                        Menunggu Pembayaran
                    </h6>
                    <h5 className="text-xl font-bold text-black">
                        Bayar sebelum{' '}
                        {moment(transaction.deadline).format(
                            'Do MMMM YYYY H:mm'
                        )}{' '}
                        WIB
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
