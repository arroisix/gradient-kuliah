import { CDN_URL } from 'commons/constants';
import Modal from 'commons/components/modules/Modal';
import { cn } from 'commons/utils';
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
        <Modal
            isOpen={isOpen}
            setOpen={onClose}
            variant="dark"
            permanent={true}
            className={cn(
                '!max-w-full !w-full !m-0 !rounded-t-2xl !rounded-b-none fixed bottom-0 left-0 right-0 !max-h-[70vh] md:!max-h-none md:!rounded-b-2xl md:!rounded-t-2xl flex flex-col p-0 !overflow-hidden bg-[#1D1D1D]',
                'md:!max-w-sm lg:!max-w-md md:!static md:!w-auto md:!bottom-auto'
            )}>
            <div
                className={cn(
                    'flex flex-col w-full h-[70vh] md:h-auto md:max-h-[90vh] overflow-y-auto px-6 py-8 justify-center'
                )}>
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
        </Modal>
    );
};

export default ExerciseCloseModal;
