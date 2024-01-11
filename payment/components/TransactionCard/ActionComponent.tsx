import Button from 'commons/components/elements/Button';
import React from 'react';
import { MdContentCopy } from 'react-icons/md';
import Barcode from 'react-jsbarcode';
import { toast } from 'react-toastify';
import { useTracker } from 'tracker/tracker';
import { useCopyToClipboard } from 'usehooks-ts';

type ActionComponentProps = {
    transaction: Transaction;
    isList?: boolean;
    isExpired?: boolean;
};

const BY_VA = [
    'VA_BCA',
    'VA_BJB',
    'VA_BRI',
    'VA_BNI',
    'VA_BSI',
    'VA_MANDIRI',
    'VA_PERMATA'
];
const BY_MERCHANT = ['INDOMARET', 'ALFAMART'];
const BY_EWALLET = ['GOPAY', 'ID_SHOPEEPAY', 'QRIS'];

function ActionComponent({
    transaction,
    isExpired,
    isList
}: ActionComponentProps): JSX.Element {
    const tracker = useTracker();
    const [_, copy] = useCopyToClipboard();

    if (isExpired && transaction.status !== 'SUCCESS')
        return <div className="hidden sm:block"></div>;

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

    if (BY_VA.includes(transaction.payment_method)) {
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
    } else if (BY_MERCHANT.includes(transaction.payment_method)) {
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
    } else if (BY_EWALLET.includes(transaction.payment_method)) {
        return isList ? (
            <Button
                variant="custom"
                className="text-sm text-center text-black transition bg-white hover:opacity-90"
                href={`/checkout/${transaction.id}`}>
                Tampilkan QR
            </Button>
        ) : (
            <></>
        );
    }

    return <></>;
}

export default ActionComponent;
