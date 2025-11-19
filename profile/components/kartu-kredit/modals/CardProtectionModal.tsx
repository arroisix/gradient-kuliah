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
                <h1 className="font-extrabold text-lg font-body">
                    Detail Kartumu Terlindungi
                </h1>
            </div>

            {/* Body cards */}
            <div className="flex flex-col space-y-4 pb-2">
                {/* CVV Protection */}
                <div className="flex items-center gap-4 bg-[#20222E] p-4 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#F505A1]/15 flex items-center justify-center shrink-0">
                        <CreditCardCVVSmallIcon />
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-bold text-md font-body">
                            Gradient tidak menyimpan informasi sensitif
                        </p>
                        <p className="text-neutral-400 text-sm font-body">
                            Detail kartu seperti nomor, identitas pemilik, dan
                            CVV tidak disimpan. CVV akan diminta sesekali saat
                            melakukan transaksi.
                        </p>
                    </div>
                </div>

                {/* 3D‑Secure */}
                <div className="flex items-center gap-4 bg-[#20222E] p-4 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#00AA99]/15 flex items-center justify-center shrink-0">
                        <CommentLockedIcon />
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-bold text-md font-body">
                            Pembayaran aman dengan 3D-Secure
                        </p>
                        <p className="text-gray-400 text-sm font-body">
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
