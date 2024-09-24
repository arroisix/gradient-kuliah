import React from 'react';

interface ExerciseCloseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ExerciseCloseModal: React.FC<ExerciseCloseModalProps> = ({
    isOpen,
    onClose,
    onConfirm
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#1D1D1D] rounded-2xl px-6 py-8 w-full max-w-[328px] md:max-w-sm">
                <h2 className="text-xl font-semibold text-white mb-4 text-center">
                    Kamu yakin mau mengakhiri latihan ini?
                </h2>
                <p className="text-[#999999] text-center mb-6">
                    Tenang, kamu bisa melanjutkan lagi dengan semua progress
                    kamu masih ada
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-[#EA5C49] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                        Akhiri Latihan
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-[#333540] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseCloseModal;
