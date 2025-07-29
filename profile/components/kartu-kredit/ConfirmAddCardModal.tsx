'use client';
import Button from 'commons/components/elements/Button';
import CreditCardCVVSmallIcon from 'commons/components/elements/Icons/CreditCardCVVSmall';
import CreditCardSmallIcon from 'commons/components/elements/Icons/CreditCardSmall';
import CreditCardStackIcon from 'commons/components/elements/Icons/CreditCardStack';
import Modal from 'commons/components/modules/Modal';

interface ConfirmAddCardModalProps extends ModalBaseProps {
    onConfirm: () => void;
}

const ConfirmAddCardModal = ({
    isOpen,
    setOpen,
    onConfirm
}: ConfirmAddCardModalProps): JSX.Element => {
    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            className="!bg-[#1D1D1D]">
            {/* Header */}
            <div className="flex flex-col w-full">
                <h1 className="font-bold text-lg">Info Kartu yang Disimpan</h1>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center space-y-4">
                <CreditCardStackIcon className="mb-2" />

                <div className="flex gap-3 bg-[#2C2C2C] p-3 rounded-lg items-center">
                    <div className="w-8 h-8 rounded-full bg-[#00AA99]/15 flex items-center justify-center shrink-0">
                        <CreditCardSmallIcon />
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-white mb-1">
                            Gradient hanya menyimpan jenis kartu (Mastercard
                            atau Visa)
                        </h3>
                        <p className="text-xs text-neutral-400">
                            Nomor kartu dan CVV tidak disimpan sehinggga kamu
                            tetap bisa berinteraksi dengan aman.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 bg-[#2C2C2C] p-3 rounded-lg items-center">
                    <div className="w-8 h-8 rounded-full bg-[#F505A1]/15 flex items-center justify-center shrink-0">
                        <CreditCardCVVSmallIcon />
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-white mb-1">
                            Gradient tidak menyimpan kode CVV-mu
                        </h3>
                        <p className="text-xs text-neutral-400">
                            CVV akan diminta sekali saat melakukan transaksi,
                            tetapi tidak disimpan di sistem.
                        </p>
                    </div>
                </div>
                <Button
                    variant="primary"
                    className="w-1/2"
                    onClick={onConfirm}
                    eventName="Add new credit card">
                    Simpan
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmAddCardModal;
