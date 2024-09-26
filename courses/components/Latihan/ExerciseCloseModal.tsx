import React, { useState } from 'react';

interface ExerciseCloseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

const Spinner = () => (
    <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ExerciseCloseModal: React.FC<ExerciseCloseModalProps> = ({
    isOpen,
    onClose,
    onConfirm
}) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error('Error ending exercise:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-[#EA5C49] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center">
                        {isLoading ? <Spinner /> : 'Akhiri Latihan'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="bg-[#333540] font-semibold text-white py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseCloseModal;
