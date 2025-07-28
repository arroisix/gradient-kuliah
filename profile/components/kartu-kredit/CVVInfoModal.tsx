'use client';
import Modal from 'commons/components/modules/Modal';

const CVVInfoModal = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            className="!bg-[#1D1D1D]">
            {/* Header */}
            <h2 className="text-lg font-bold text-white mb-6">
                Card Verification Value (CVV)
            </h2>

            {/* Content */}
            <div className="space-y-4">
                {/* Card Illustration */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="w-48 h-28 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg">
                            <div className="absolute top-4 left-4 w-8 h-6 bg-yellow-400 rounded"></div>
                            <div className="absolute bottom-4 right-4">
                                <div className="relative">
                                    <div className="w-8 h-5 bg-white rounded text-xs flex items-center justify-center text-gray-800 font-bold">
                                        CVV
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 border-2 border-red-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-neutral-400 text-center mb-4 font-body">
                    Tiga atau empat digit terakhir yang terletak di belakang
                    kartu kamu. CVV diperlukan untuk verifikasi awal.
                </p>

                {/* CVV Protection Info */}
                <div className="flex gap-3 bg-graphite-700 p-3 rounded-lg items-center">
                    <div className="w-5 h-5 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0"></div>
                    <div>
                        <h3 className="font-medium text-sm text-white mb-1 font-body">
                            Gradient tidak menyimpan kode CVV-mu
                        </h3>
                        <p className="text-xs text-neutral-400 font-body">
                            CVV diminta sesekali saat kamu melakukan transaksi
                            dan tidak disimpan di sistem.
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CVVInfoModal;
