import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Hapus percakapan dari riwayat?',
    description = 'Setelah dihapus, percakapan dan seluruh isinya tidak dapat kamu akses lagi'
}: DeleteModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center font-inter font-normal">
            <button
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}></button>
            <div className="relative w-full max-w-md mx-4 bg-[#222222] rounded-2xl p-6 shadow-xl transform transition-all duration-300 ease-out">
                <h3 className="text-lg text-white font-bold mb-4 text-center">
                    {title}
                </h3>
                <p className="text-sm text-[#999999] mb-6 text-center">
                    {description}
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        className="w-full bg-[#FF3B30] hover:bg-red-700 font-bold text-white py-3 px-4 rounded-3xl transition-colors"
                        onClick={onConfirm}>
                        Hapus Percakapan
                    </button>
                    <button
                        type="button"
                        className="w-full bg-[#333333] hover:bg-neutral-700 font-bold text-white py-3 px-4 rounded-3xl transition-colors"
                        onClick={onClose}>
                        Batalkan
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default DeleteModal;
