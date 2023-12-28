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
};

function ActionComponent({
    transaction,
    isList
}: ActionComponentProps): JSX.Element | null {
    const tracker = useTracker();
    const [_, copy] = useCopyToClipboard();

    // TODO: refactor
    switch (transaction.payment_method) {
        case 'VA_BCA':
        case 'VA_BJB':
        case 'VA_BRI':
        case 'VA_BNI':
        case 'VA_BSI':
        case 'VA_MANDIRI':
        case 'VA_PERMATA':
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
        case 'GOPAY':
        case 'ID_SHOPEEPAY':
        case 'QRIS':
            return isList ? (
                <Button
                    variant="custom"
                    className="text-sm text-center text-black transition bg-white hover:opacity-90"
                    href={`/checkout/${transaction.id}`}>
                    Tampilkan QR
                </Button>
            ) : null;
        default:
            return null;
    }
}

export default ActionComponent;
