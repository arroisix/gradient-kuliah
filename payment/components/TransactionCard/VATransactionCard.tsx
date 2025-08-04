import { useMemo } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import moment from 'moment';
import { useTracker } from 'tracker/tracker';
import { toast } from 'react-toastify';
import { MdContentCopy } from 'react-icons/md';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import { LOGO_PAYMENT, NAME_PAYMENT } from '../constant';

const formatVANumber = (va: string): string => {
    if (!va) return '';
    // Specific grouping for length 15 like screenshot: 3 4 4 3
    if (va.length === 15) {
        return `${va.slice(0, 3)} ${va.slice(3, 7)} ${va.slice(
            7,
            11
        )} ${va.slice(11)}`;
    }
    // Fallback: space every 3 digits
    return va.replace(/(\d{3})(?=\d)/g, '$1 ');
};

const VATransactionCard = ({
    transaction
}: {
    transaction: Transaction;
}): JSX.Element => {
    const tracker = useTracker();
    const [_, copy] = useCopyToClipboard();

    const formattedVA = useMemo(
        () => formatVANumber(transaction.va_number),
        [transaction.va_number]
    );

    const deadlineText = useMemo(() => {
        const dl = moment(transaction.deadline).utc(true);
        return `Bayar sebelum ${dl.format('D MMM YYYY, HH.mm')}`;
    }, [transaction.deadline]);

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
        <div className="w-full">
            <div className="relative bg-[#181818] rounded-2xl overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex flex-col rounded-2xl items-center">
                    {/* header/logo */}
                    <div className="flex flex-col items-center gap-1 mb-3">
                        <div
                            className={`relative w-14 h-14 shrink-0 flex rounded-md items-center justify-center`}>
                            <Image
                                src={`${CDN_URL}/assets/mobile-${
                                    LOGO_PAYMENT[transaction.payment_method]
                                }`}
                                alt={NAME_PAYMENT[transaction.payment_method]}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <span className="font-medium font-body text-white">
                            {`${transaction.payment_method.replace(
                                'VA_',
                                ''
                            )} Virtual Account`}
                        </span>
                    </div>

                    {/* VA number box */}
                    <div className="w-full bg-[#101010] rounded-2xl px-6 py-2 flex justify-between items-center gap-4">
                        <span className="text-xl font-bold font-body tracking-wide text-white break-all">
                            {formattedVA}
                        </span>
                        <button
                            onClick={copyVA}
                            aria-label="Copy virtual account number"
                            className="flex-shrink-0 p-2 rounded hover:bg-neutral-800 transition">
                            <MdContentCopy
                                size={24}
                                className="text-[#8c6aff]"
                            />
                        </button>
                    </div>
                </div>

                {/* footer deadline bar */}
                <div className="bg-[#333333] text-center text-sm text-[#999999] py-3">
                    {deadlineText}
                </div>
            </div>
        </div>
    );
};

export default VATransactionCard;
