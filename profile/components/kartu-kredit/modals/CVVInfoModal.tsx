'use client';
import CreditCardCVVCircled from 'commons/components/elements/Icons/CreditCardCVVCircled';
import CreditCardCVVSmallIcon from 'commons/components/elements/Icons/CreditCardCVVSmall';
import Modal from 'commons/components/modules/Modal';

const CVVInfoModal = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            className="!bg-[#1D1D1D]">
            {/* Header */}
            <div className="flex flex-col w-full mb-4">
                <h1 className="font-extrabold text-lg font-body">
                    Card Verification Value (CVV)
                </h1>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center space-y-4">
                <CreditCardCVVCircled />

                <p className="text-sm text-neutral-400 text-center mb-4 font-body">
                    Tiga atau empat digit terakhir yang terletak di belakang
                    kartu kamu. CVV diperlukan untuk verifikasi awal.
                </p>

                {/* CVV Protection Info */}
                <div className="flex gap-3 bg-[#20222E] p-3 rounded-lg items-center">
                    <div className="w-8 h-8 rounded-full bg-[#F505A1]/15 flex items-center justify-center shrink-0">
                        <CreditCardCVVSmallIcon />
                    </div>
                    <div>
                        <h3 className="font-bold text-md text-white mb-1 font-body">
                            Gradient tidak menyimpan kode CVV-mu
                        </h3>
                        <p className="text-sm text-neutral-400 font-body">
                            CVV akan diminta sesekali saat melakukan transaksi,
                            namun tidak disimpan di sistem.
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CVVInfoModal;
