'use client';
import CommentLockedIcon from 'commons/components/elements/Icons/CommentLockedIcon';
import CreditCardCVVSmallIcon from 'commons/components/elements/Icons/CreditCardCVVSmall';
import Modal from 'commons/components/modules/Modal';

const CardProtectionModal = ({
    isOpen,
    setOpen
}: ModalBaseProps): JSX.Element => {
    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            className="!bg-[#1D1D1D]">
            {/* Header */}
            <div className="flex flex-col w-full mb-4">
                <h1 className="font-bold text-lg">
                    Detail Kartumu Terlindungi
                </h1>
            </div>

            {/* Body cards */}
            <div className="flex flex-col space-y-4 pb-2">
                {/* CVV Protection */}
                <div className="flex items-center gap-4 bg-[#2C2C2C] p-4 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#F505A1]/15 flex items-center justify-center shrink-0">
                        <CreditCardCVVSmallIcon />
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-medium text-md">
                            Gradient tidak menyimpan kode CVV-mu
                        </p>
                        <p className="text-neutral-400 text-sm">
                            CVV akan diminta sesekali saat melakukan transaksi,
                            namun tidak disimpan di sistem.
                        </p>
                    </div>
                </div>

                {/* 3D‑Secure */}
                <div className="flex items-center gap-4 bg-[#2C2C2C] p-4 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#00AA99]/15 flex items-center justify-center shrink-0">
                        <CommentLockedIcon />
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-medium text-md">
                            Pembayaran aman dengan 3D-Secure
                        </p>
                        <p className="text-gray-400 text-sm">
                            Dengan dukungan Xendit, setiap pembayaran dilindungi
                            oleh verifikasi tambahan melalui kode OTP sebelum
                            diproses.
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CardProtectionModal;
