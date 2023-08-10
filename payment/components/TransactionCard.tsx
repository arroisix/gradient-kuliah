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

const STATUS_COLOR: { [key: string]: string } = {
    SUCCESS: 'bg-state-success',
    WAITING: 'bg-accent-yellow',
    EXPIRY: 'bg-state-error'
};

const STATUS: { [key: string]: JSX.Element } = {
    SUCCESS: (
        <div className="flex items-center gap-[8px] text-state-success">
            <HiCheckCircle size={16} />
            <span className="inline-body font-body text-sm">
                Pembayaran Selesai
            </span>
        </div>
    ),
    WAITING: (
        <div className="flex items-center gap-[8px] text-accent-yellow">
            <AiFillClockCircle size={16} />
            <span className="inline-body font-body text-sm">
                Menunggu Pembayaran
            </span>
        </div>
    ),
    EXPIRY: (
        <div className="flex items-center gap-[8px] text-state-error">
            <AiFillCloseCircle size={16} />
            <span className="inline-body font-body text-sm">
                Pembayaran Gagal
            </span>
        </div>
    )
};

const TransactionCard = ({
    transaction,
    isList
}: {
    transaction: Transaction;
    isList?: boolean;
}): JSX.Element => {
    const { subscribed_packet } =
        transaction.subscriber || ({} as Subscription);
    const router = useRouter();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isExpiry = checkExpiry(transaction.deadline as string);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, copy] = useCopyToClipboard();
    const { expiryDay, subscription_id } = useCourseSubscription();

    const copyVA = (): void => {
        if (transaction) {
            copy(transaction?.va_number as string);
            toast.info('Virtual Account berhasil di copy');
        }
    };

    function generateStatus(): JSX.Element {
        if (isExpiry && transaction.status !== 'SUCCESS') {
            return (
                <div className="flex items-center gap-[8px] text-state-error">
                    <AiFillCloseCircle size={16} />
                    <span className="inline-body font-body text-sm">
                        Pembayaran Gagal
                    </span>
                </div>
            );
        } else {
            return STATUS[transaction.status];
        }
    }

    function generateStatusInfo(): JSX.Element {
        if (!isList) return <></>;

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
                <div
                    className="flex justify-center items-center gap-[6px] mt-[18px] px-3 py-2 bg-[#F2C04C1A] border border-[#F2C04C1A] rounded"
                    onClick={() =>
                        isMobileBreakpoints
                            ? router.push(`/checkout/${transaction.id}`)
                            : null
                    }
                    aria-hidden>
                    <span className="inline-block font-body text-[#CCCCCC80] text-xs sm:text-sm">
                        {`Bayar sebelum ${moment(transaction.deadline)
                            .utc()
                            .format('D MMM YYYY HH:mm')} WIB. `}
                        <span
                            className="text-[#CCCCCC] cursor-pointer hover:underline"
                            onClick={() =>
                                router.push(`/checkout/${transaction.id}`)
                            }
                            aria-hidden>
                            Lihat cara bayar
                        </span>
                    </span>
                    <div className="w-[18px] h-[18px] cursor-pointer">
                        <MdChevronRight size={18} />
                    </div>
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
            if (expiryDay <= 14) {
                return 'Perpanjang';
            } else if (
                moment(moment(transaction.created_at).startOf('day'))
                    .add(subscribed_packet?.active_duration, 'd')
                    .unix() < moment().unix()
            ) {
                return 'Perbarui';
            }
        }

        return false;
    }

    return (
        <div className="relative p-6 md:px-8 md:pt-6 md:pb-5 bg-[#121212] rounded-[10px]">
            <div
                className={`w-[8px] h-[65px] absolute top-6 left-0 rounded-r ${
                    STATUS_COLOR[generateStatusColor()]
                }`}
            />
            <div className="flex justify-between flex-wrap gap-6 pb-[18px] border-b border-[#242424]">
                <div className="flex flex-col gap-1">
                    <span className="inline-body font-body font-extrabold text-sm md:text-base">
                        {subscribed_packet?.packet_name}
                    </span>
                    <span className="inline-body font-body text-xs md:text-sm">
                        {`${moment(transaction.created_at)
                            .utc()
                            .format('D MMM YYYY')} hingga ${moment()
                            .add(subscribed_packet?.active_duration, 'd')
                            .utc()
                            .format('D MMM YYYY')}`}
                    </span>
                </div>
                <div className="w-full sm:w-max flex flex-col sm:items-end gap-3">
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
                                            activeTransaction() === 'Perpanjang'
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
                    <span className="inline-block font-body font-extrabold text-sm sm:text-lg">
                        {formatCurrency(`${transaction.payment_amount}`)}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="inline-block font-body text-[#CCCCCC] text-xs sm:text-sm">
                        Metode Pembayaran
                    </span>
                    <span className="inline-block font-extrabold text-sm sm:text-lg">
                        {NAME_PAYMENT[transaction.payment_method]}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="inline-block font-body text-[#CCCCCC] text-xs sm:text-sm">
                        Kode Virtual Account
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="inline-block font-body font-extrabold text-sm sm:text-lg">
                            {transaction.va_number}
                        </span>
                        <MdContentCopy
                            onClick={copyVA}
                            className="text-[18px] sm:text-[23px] cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
