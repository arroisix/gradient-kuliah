import { useRef } from 'react';
import { BsCamera, BsImage } from 'react-icons/bs';

interface ImageUploadControlsProps {
    onImageUpload: (file: File) => Promise<void>;
}

const ImageUploadControls = ({ onImageUpload }: ImageUploadControlsProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    return (
        <div className="absolute bottom-4 left-3 flex gap-3">
            <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="text-neutral-400 hover:text-white transition-colors">
                <BsCamera size={20} />
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="text-neutral-400 hover:text-white transition-colors">
                <BsImage size={20} />
            </button>
        </div>
    );
};

export default ImageUploadControls;
