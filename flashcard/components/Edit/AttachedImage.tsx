import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { Image } from 'lucide-react';

interface AttachedImageProps {
    onRemove?: () => void;
}

const AttachedImage = ({ onRemove }: AttachedImageProps) => {
    return (
        <div className="inline-flex items-center gap-2 px-2 py-1.5 rounded bg-[#272727] text-xs">
            <div className="p-1.5 rounded bg-[#373737] text-neutral-400">
                <Image size={12} />
            </div>
            <span className="text-neutral-400">Gambar terlampir</span>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="p-1 hover:bg-[#444444] rounded-full transition-colors"
                    aria-label="Remove image">
                    <IoMdClose className="text-neutral-400" size={12} />
                </button>
            )}
        </div>
    );
};

export default AttachedImage;
