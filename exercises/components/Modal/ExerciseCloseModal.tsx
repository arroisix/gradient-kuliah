import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import React, { useState } from 'react';

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
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = (): void => {
        setIsLoading(true);
        try {
            onConfirm();
        } catch (error) {
            console.error('Error ending exercise:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#1D1D1D] rounded-t-2xl px-6 py-8 w-full max-w-[328px] md:max-w-sm lg:max-w-md justify-center flex flex-col">
                <Image
                    src={`${CDN_URL}/assets/mobile-confirm-exit-modal.png`}
                    className="object-contain"
                    alt="confirm-exit-modal"
                    width={140}
                    height={140}
                />
                <h2 className="font-bold text-white mb-4 text-center mt-6">
                    Kamu yakin mau mengakhiri latihan ini?
                </h2>
                <p className="text-[#999999] text-center mb-6">
                    Tenang, kamu bisa melanjutkan lagi dengan semua progress
                    kamu masih ada
                </p>
                <div className="flex flex-col lg:flex-row gap-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="bg-white/10 font-semibold text-white py-2 lg:py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors w-full order-2 lg:order-1">
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-[#EA5C49] font-semibold text-white py-2 lg:py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center w-full order-1 lg:order-2">
                        {isLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            'Akhiri Latihan'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseCloseModal;
