import moment from 'moment';
import { useRouter } from 'next/router';
import { formatCurrency } from 'commons/utils';
import { checkExpiry } from '../../utils';
import { NAME_PAYMENT } from '../constant';
import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import QrisComponent from '../QrisComponent';
import ActionComponent from './ActionComponent';
import TransactionStatus from './TransactionStatus';
import StatusInfo from './StatusInfo';
import SubscriptionDate from './SubscriptionDate';

const STATUS_COLOR: { [key: string]: string } = {
    SUCCESS: 'bg-state-success',
    WAITING: 'bg-accent-yellow',
    EXPIRY: 'bg-state-error'
};

const TransactionCard = ({
    transaction,
    isList,
    active = false
}: {
    transaction: Transaction;
    isList?: boolean;
    active?: boolean;
}): JSX.Element => {
    const { subscribed_packet } =
        transaction.subscriber || ({} as Subscription);
    const router = useRouter();
    const isExpiry = checkExpiry(transaction.deadline as string);
    const { expiryDay, subscription_id } = useCourseSubscription();

    const statusColor = (): string =>
        STATUS_COLOR[
            isExpiry && transaction.status !== 'SUCCESS'
                ? 'EXPIRY'
                : transaction.status
        ];

    const activeTransaction = (): boolean | string => {
        if (transaction.status === 'SUCCESS') {
            if (
                !active &&
                moment(transaction.subscriber.deactivate_after)
                    .startOf('day')
                    .unix() < moment().unix()
            ) {
                return 'Perbarui';
            } else if (active && expiryDay <= 14) {
                return 'Perpanjang';
            }
        }

        return false;
    };

    return (
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-start">
            <div className="flex-1 flex flex-col relative p-6 md:px-8 md:pt-6 md:pb-5 bg-neutral-900 rounded-[10px]">
                <div
                    className={`w-[8px] h-[65px] absolute top-6 left-0 rounded-r ${statusColor()}`}
                />
                <div className="flex justify-between flex-wrap gap-6 pb-[18px] border-b border-[#242424]">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-extrabold font-body md:text-base">
                            {subscribed_packet?.packet_name}
                        </p>
                        <SubscriptionDate transaction={transaction} />
                    </div>
                    <div className="flex flex-col w-full gap-3 sm:w-max sm:items-end">
                        <TransactionStatus
                            isExpiry={isExpiry}
                            status={transaction.status}
                        />
                        {transaction.status === 'SUCCESS' &&
                            isList &&
                            activeTransaction() && (
                                <Button
                                    variant="custom"
                                    className="w-full sm:w-min !px-5 !py-[7.5px] !text-xs text-black bg-white"
                                    onClick={() =>
                                        router.push(
                                            `/pembayaran?packetId=${
                                                subscribed_packet.id
                                            }${
                                                activeTransaction() ===
                                                'Perpanjang'
                                                    ? `&subscriptionId=${subscription_id}`
                                                    : ''
                                            }`
                                        )
                                    }>
                                    {`${activeTransaction()}`}
                                </Button>
                            )}
                    </div>
                </div>
                <StatusInfo
                    isExpiry={isExpiry}
                    isList={isList}
                    packetId={subscribed_packet.id}
                    {...transaction}
                />
                <div className="flex flex-col sm:flex-row justify-between flex-wrap gap-3 pt-[18px]">
                    <div className="flex flex-col gap-1">
                        <span className="inline-block font-body text-[#CCCCCC] text-xs sm:text-sm">
                            Total Pembayaran
                        </span>
                        <span className="inline-block text-sm font-extrabold font-body sm:text-lg">
                            {formatCurrency(`${transaction.payment_amount}`)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="inline-block font-body text-[#CCCCCC] text-xs sm:text-sm">
                            Metode Pembayaran
                        </span>
                        <span className="inline-block text-sm font-extrabold sm:text-lg">
                            {NAME_PAYMENT[transaction.payment_method]}
                        </span>
                    </div>
                    <ActionComponent
                        transaction={transaction}
                        isList={isList}
                    />
                </div>
            </div>
            {!isList && <QrisComponent transaction={transaction} />}
        </div>
    );
};

export default TransactionCard;
