import React, { useEffect } from 'react';
import {
    HiOutlineBookOpen,
    HiOutlinePencilAlt,
    HiOutlineX
} from 'react-icons/hi';
import ListBooks from '../CourseDetailBox/ListBooks';

type Props = {
    open: boolean;
    onClose: () => void;
    items: Book[];
    bukuCount: number;
    kuisCount: number;
    isLoading?: boolean;
};

const RelatedContentModal = ({
    open,
    onClose,
    items,
    bukuCount,
    kuisCount,
    isLoading = false
}: Props): JSX.Element | null => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') onClose();
        };
        if (open) {
            window.addEventListener('keydown', onKey);
        }
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClose();
                    }
                }}
                role="button"
                aria-label="Close overlay"
                tabIndex={0}
            />
            <div className="relative z-[101] mx-auto my-10 w-[432px] max-w-[92vw] rounded-2xl border border-neutral-700 bg-[#1A1A1A] p-5 shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-white">
                        Konten Terkait
                    </h3>
                    {bukuCount > 0 && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#2C2C2C] text-xs font-medium text-neutral-300">
                            <HiOutlineBookOpen size={14} />
                            {bukuCount} Buku
                        </span>
                    )}
                    {kuisCount > 0 && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#2C2C2C] text-xs font-medium text-neutral-300">
                            <HiOutlinePencilAlt size={14} />
                            {kuisCount} Kuis
                        </span>
                    )}
                    <button
                        onClick={onClose}
                        className="ml-auto p-2 rounded-md hover:bg-neutral-800 text-neutral-300"
                        aria-label="Tutup">
                        <HiOutlineX size={18} />
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto pr-1">
                    {/* Use vertical list with boxed items */}
                    <ListBooks
                        books={items}
                        isLoading={isLoading}
                        horizontal={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default RelatedContentModal;
