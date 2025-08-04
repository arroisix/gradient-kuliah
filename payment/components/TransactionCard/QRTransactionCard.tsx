import { useMemo } from 'react';
import QrisComponent from '../QrisComponent';
import moment from 'moment';
import { formatCurrency } from 'commons/utils';
import SubscriptionDate from './SubscriptionDate';
import { checkExpiry } from 'payment/utils';

const STATUS_COLOR: { [key: string]: string } = {
    SUCCESS: 'bg-state-success',
    WAITING: 'bg-accent-yellow',
    EXPIRY: 'bg-state-error'
};

const QRTransactionCard = ({
    transaction
}: {
    transaction: Transaction;
}): JSX.Element => {
    const { subscribed_packet } =
        transaction.subscriber || ({} as Subscription);
    const deadlineText = useMemo(() => {
        const dl = moment(transaction.deadline).utc(true);
        return `Bayar sebelum ${dl.format('D MMM YYYY, HH.mm')}`;
    }, [transaction.deadline]);
    const isExpired = checkExpiry(transaction.deadline as string);

    const statusColor = (): string =>
        STATUS_COLOR[
            isExpired && transaction.status !== 'SUCCESS'
                ? 'EXPIRY'
                : transaction.status
        ];

    return (
        <section className="flex flex-col items-center space-y-8">
            <div className="w-full flex-1 flex flex-col relative p-6 md:px-8 md:pt-6 md:pb-5 bg-neutral-900 rounded-[10px]">
                <div
                    className={`w-[8px] h-[65px] absolute top-6 left-0 rounded-r ${statusColor()}`}
                />
                <div className="flex justify-between flex-wrap gap-6 pb-[18px] border-b border-[#242424]">
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-sm font-extrabold font-body md:text-base">
                            {subscribed_packet?.packet_name}
                        </p>
                        <SubscriptionDate transaction={transaction} />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between flex-wrap gap-3">
                        <div className="flex flex-col gap-1">
                            <p className="font-body text-[#CCCCCC] text-xs sm:text-sm">
                                Total Pembayaran
                            </p>
                            <p className="text-sm font-extrabold font-body sm:text-lg">
                                {formatCurrency(
                                    `${transaction.payment_amount}`
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="relative bg-[#181818] rounded-2xl overflow-hidden">
                    <div className="px-6 pt-6 pb-4 flex flex-col rounded-2xl items-center">
                        <QrisComponent transaction={transaction} />
                    </div>
                    <div className="bg-[#333333] text-center text-sm text-[#999999] py-3">
                        {deadlineText}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QRTransactionCard;
