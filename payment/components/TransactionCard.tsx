import moment from 'moment';
import { useRouter } from 'next/router';
import { AiFillClockCircle, AiFillCloseCircle } from 'react-icons/ai';
import { MdChevronRight, MdContentCopy } from 'react-icons/md';
import { formatCurrency } from 'commons/utils';
import { checkExpiry } from '../utils';
import { NAME_PAYMENT } from './constant';
import useCopyToClipboard from 'commons/hooks/useCopyToClipboard';
import { toast } from 'react-toastify';
import Button from 'commons/components/elements/Button';
import { HiCheckCircle } from 'react-icons/hi';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useTracker } from 'tracker/tracker';
import Barcode from 'react-jsbarcode';
import QrisComponent from './QrisComponent';
import Link from 'next/link';

const STATUS_COLOR: { [key: string]: string } = {
    SUCCESS: 'bg-state-success',
    WAITING: 'bg-accent-yellow',
    EXPIRY: 'bg-state-error'
};

const STATUS: { [key: string]: JSX.Element } = {
    SUCCESS: (
        <div className="flex items-center gap-[8px] text-state-success">
            <HiCheckCircle size={16} />
            <span className="text-sm inline-body font-body">
                Pembayaran Selesai
            </span>
        </div>
    ),
    WAITING: (
        <div className="flex items-center gap-[8px] text-accent-yellow">
            <AiFillClockCircle size={16} />
            <span className="text-sm inline-body font-body">
                Menunggu Pembayaran
            </span>
        </div>
    ),
    EXPIRY: (
        <div className="flex items-center gap-[8px] text-state-error">
            <AiFillCloseCircle size={16} />
            <span className="text-sm inline-body font-body">
                Pembayaran Gagal
            </span>
        </div>
    )
};

function ActionComponent({
    transaction
}: {
    transaction: Transaction;
}): JSX.Element | null {
    const tracker = useTracker();
    const [_, copy] = useCopyToClipboard();

    const [paymentTag, _paymentMerchant] =
        transaction.payment_method.split('_');
    switch (paymentTag) {
        case 'VA':
            const copyVA = (): void => {
                if (transaction) {
                    copy(transaction.va_number as string);
                    toast.info('Virtual Account berhasil di copy');
                    tracker?.genericTrack('Copy VA Number', {
                        'Method Name': transaction.payment_method,
                        'VA Number': transaction.va_number
                    });
                }
            };

            return (
                <div className="flex flex-col gap-1">
                    <span className="inline-block font-body text-[#CCCCCC] text-xs sm:text-sm">
                        Kode Virtual Account
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="inline-block text-sm font-extrabold font-body sm:text-lg">
                            {transaction.va_number}
                        </span>
                        <MdContentCopy
                            onClick={copyVA}
                            className="text-[18px] sm:text-[23px] cursor-pointer"
                        />
                    </div>
                </div>
            );
        case 'INDOMARET':
        case 'ALFAMART':
            return (
                <div className="flex flex-col gap-1">
                    <span className="inline-block font-body text-[#CCCCCC] text-xs sm:text-sm">
                        Kode Pembayaran
                    </span>
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                        <Barcode
                            className="w-full"
                            value={transaction.payment_code}
                        />
                    </div>
                </div>
            );
        default:
            return null;
    }
}

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
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isExpiry = checkExpiry(transaction.deadline as string);
    const { expiryDay, subscription_id } = useCourseSubscription();

    function generateStatus(): JSX.Element {
        if (isExpiry && transaction.status !== 'SUCCESS') {
            return (
                <div className="flex items-center gap-[8px] text-state-error">
                    <AiFillCloseCircle size={16} />
                    <span className="text-sm inline-body font-body">
                        Pembayaran Gagal
                    </span>
                </div>
            );
        } else {
            return STATUS[transaction.status];
        }
    }

    function generateStatusInfo(): JSX.Element {
        if (isExpiry && transaction.status !== 'SUCCESS') {
            return (
                <div
                    className="flex justify-center items-center gap-[6px] mt-[18px] px-3 py-2 bg-[#E9202A1A] border border-[#E9202A1A] rounded"
                    onClick={() =>
                        isMobileBreakpoints
                            ? router.push(
                                  `/pembayaran?packetId=${subscribed_packet.id}`
                              )
                            : null
                    }
                    aria-hidden>
                    <span className="inline-block font-body text-[#CCCCCC80] text-xs sm:text-sm">
                        Masa waktu bayar habis.{' '}
                        <span
                            className="text-[#CCCCCC] cursor-pointer hover:underline"
                            onClick={() =>
                                router.push(
                                    `/pembayaran?packetId=${subscribed_packet.id}`
                                )
                            }
                            aria-hidden>
                            Beli lagi
                        </span>
                    </span>
                    <div className="w-[18px] h-[18px] cursor-pointer">
                        <MdChevronRight size={18} />
                    </div>
                </div>
            );
        } else if (transaction.status === 'WAITING') {
            return (
                <div className="flex justify-center items-center gap-[6px] mt-[18px] px-3 py-2 bg-[#F2C04C1A] border border-[#F2C04C1A] rounded font-body text-[#CCCCCC80] text-xs sm:text-sm">
                    {`Bayar sebelum ${moment(transaction.deadline)
                        .utc()
                        .format('D MMM YYYY HH:mm')} WIB. `}
                    {isList && (
                        <Link
                            className="text-[#CCCCCC] cursor-pointer hover:underline flex items-center"
                            href={`/checkout/${transaction.id}`}>
                            Lihat cara bayar
                            <MdChevronRight size={18} />
                        </Link>
                    )}
                </div>
            );
        }

        return <></>;
    }

    function generateStatusColor(): string {
        if (isExpiry && transaction.status !== 'SUCCESS') {
            return 'EXPIRY';
        } else {
            return transaction.status;
        }
    }

    function activeTransaction(): boolean | string {
        if (transaction.status === 'SUCCESS') {
            if (
                moment(moment(transaction.created_at).startOf('day'))
                    .add(subscribed_packet?.active_duration, 'd')
                    .unix() < moment().unix()
            ) {
                return 'Perbarui';
            } else if (expiryDay <= 14) {
                return 'Perpanjang';
            }
        }

        return false;
    }

    return (
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-start">
            <div className="flex-1 flex flex-col relative p-6 md:px-8 md:pt-6 md:pb-5 bg-[#121212] rounded-[10px]">
                <div
                    className={`w-[8px] h-[65px] absolute top-6 left-0 rounded-r ${
                        STATUS_COLOR[generateStatusColor()]
                    }`}
                />
                <div className="flex justify-between flex-wrap gap-6 pb-[18px] border-b border-[#242424]">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-extrabold inline-body font-body md:text-base">
                            {subscribed_packet?.packet_name}
                        </span>
                        <span className="text-xs inline-body font-body md:text-sm">
                            {active
                                ? `${moment(transaction.subscriber.active_from)
                                      .utc()
                                      .format('D MMM YYYY')} hingga ${moment(
                                      transaction.subscriber.deactivate_after
                                  )
                                      .utc()
                                      .format('D MMM YYYY')}`
                                : `${moment(transaction.created_at)
                                      .utc()
                                      .format('D MMM YYYY')} hingga ${moment(
                                      transaction.created_at
                                  )
                                      .add(
                                          subscribed_packet?.active_duration,
                                          'd'
                                      )
                                      .utc()
                                      .format('D MMM YYYY')}`}
                        </span>
                    </div>
                    <div className="flex flex-col w-full gap-3 sm:w-max sm:items-end">
                        {generateStatus()}
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
                {generateStatusInfo()}
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
                    <ActionComponent transaction={transaction} />
                </div>
            </div>
            {!isList && <QrisComponent transaction={transaction} />}
        </div>
    );
};

export default TransactionCard;
