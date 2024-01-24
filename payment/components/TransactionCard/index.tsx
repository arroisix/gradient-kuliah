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
    active = false,
    hasUpcoming
}: {
    transaction: Transaction;
    isList?: boolean;
    active?: boolean;
    hasUpcoming?: boolean;
}): JSX.Element => {
    const { subscribed_packet } =
        transaction.subscriber || ({} as Subscription);
    const router = useRouter();
    const isExpired = checkExpiry(transaction.deadline as string);
    const { expiryDay, subscription_id } = useCourseSubscription();

    const statusColor = (): string =>
        STATUS_COLOR[
            isExpired && transaction.status !== 'SUCCESS'
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
            } else if (active && expiryDay <= 7) {
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
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-sm font-extrabold font-body md:text-base">
                            {subscribed_packet?.packet_name}
                        </p>
                        <SubscriptionDate transaction={transaction} />
                        <p
                            className="text-sm tooltip tooltip-right font-body"
                            data-tip={transaction.id}>
                            Nomor Pembelian:{' '}
                            {transaction.id.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                    <div className="flex flex-col w-full gap-3 sm:w-max sm:items-end">
                        <TransactionStatus
                            isExpiry={isExpired}
                            status={transaction.status}
                        />
                        {transaction.status === 'SUCCESS' &&
                            !hasUpcoming &&
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
                    isExpiry={isExpired}
                    isList={isList}
                    packetId={subscribed_packet.id}
                    hasUpcoming={hasUpcoming}
                    {...transaction}
                />
                <div className="flex flex-col sm:flex-row justify-between flex-wrap gap-3 pt-[18px]">
                    <div className="flex flex-col gap-1">
                        <p className="font-body text-[#CCCCCC] text-xs sm:text-sm">
                            Total Pembayaran
                        </p>
                        <p className="text-sm font-extrabold font-body sm:text-lg">
                            {formatCurrency(`${transaction.payment_amount}`)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="font-body text-[#CCCCCC] text-xs sm:text-sm">
                            Metode Pembayaran
                        </p>
                        <p className="text-sm font-extrabold sm:text-lg">
                            {NAME_PAYMENT[transaction.payment_method]}
                        </p>
                    </div>
                    <ActionComponent
                        transaction={transaction}
                        isExpired={isExpired}
                        isList={isList}
                    />
                </div>
            </div>
            {!isList && <QrisComponent transaction={transaction} />}
        </div>
    );
};

export default TransactionCard;
