'use client';
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                    Detail Kartumu Terlindungi
                </h2>
            </div>

            {/* Body cards */}
            <div className="space-y-4 pb-2">
                {/* CVV Protection */}
                <div className="flex items-center gap-4 bg-graphite-700 p-4 rounded-lg">
                    <div className="w-5 h-5 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0"></div>
                    <div className="space-y-1">
                        <p className="text-white font-body font-medium text-sm">
                            Gradient tidak menyimpan kode CVV-mu
                        </p>
                        <p className="text-gray-400 text-xs font-body">
                            CVV akan diminta sesekali saat melakukan transaksi,
                            namun tidak disimpan di sistem.
                        </p>
                    </div>
                </div>

                {/* 3D‑Secure */}
                <div className="flex items-center gap-4 bg-graphite-700 p-4 rounded-lg">
                    <div className="w-5 h-5 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0"></div>
                    <div className="space-y-1">
                        <p className="text-white font-body font-medium text-sm">
                            Pembayaran aman dengan 3D-Secure
                        </p>
                        <p className="text-gray-400 text-xs font-body">
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
