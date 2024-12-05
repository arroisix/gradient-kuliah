import { useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from 'commons/utils';
import { IoChevronBack } from 'react-icons/io5';
import useWindowBreakpoints from '../../commons/hooks/useWindowBreakpoints';

interface CropModalProps {
    onClose: () => void;
    imageUrl: string;
    onCropComplete: (croppedImageUrl: string) => void;
}

const CropModal = ({ onClose, imageUrl, onCropComplete }: CropModalProps) => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });
    const [imageSrc, setImageSrc] = useState<HTMLImageElement | null>(null);
    const [, setImageStyle] = useState({
        maxHeight: '100%',
        maxWidth: '100%'
    });

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setImageSrc(e.currentTarget);

        const img = e.currentTarget;
        const viewportHeight = window.innerHeight;
        const headerHeight = isMobileBreakpoints ? 140 : 100;
        const footerHeight = isMobileBreakpoints ? 180 : 120;
        const availableHeight = viewportHeight - headerHeight - footerHeight;

        const scale = Math.min(
            availableHeight / img.height,
            (window.innerWidth * 0.8) / img.width
        );

        setImageStyle({
            maxHeight: `${availableHeight}px`,
            maxWidth: `${img.width * scale}px`
        });
    };

    const getCroppedImg = () => {
        if (!imageSrc) return;

        const canvas = document.createElement('canvas');
        const scaleX = imageSrc.naturalWidth / imageSrc.width;
        const scaleY = imageSrc.naturalHeight / imageSrc.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            imageSrc,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const croppedImageUrl = URL.createObjectURL(blob);
                onCropComplete(croppedImageUrl);
                onClose();
            },
            'image/jpeg',
            1.0
        );
    };

    return (
        <div
            className={cn(
                'bg-[#101010]',
                isMobileBreakpoints ? 'fixed inset-0 z-50' : 'h-[80vh] w-full'
            )}>
            <div
                className={cn(
                    'absolute left-0 right-0 bg-[#101010] z-20',
                    isMobileBreakpoints
                        ? 'pt-16 px-4 py-3 top-16'
                        : 'px-12 py-6 top-0'
                )}>
                <button
                    onClick={onClose}
                    className={cn(
                        'flex items-center gap-2 text-white',
                        isMobileBreakpoints ? '' : 'px-12'
                    )}>
                    <IoChevronBack size={20} />
                    <span className="text-base font-semibold">
                        Scan Foto Soal
                    </span>
                </button>
            </div>

            <div className="absolute inset-0 pt-28 pb-32">
                <div className="h-full w-full flex items-center justify-center p-4 pb-16">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        aspect={undefined}
                        className="max-h-full">
                        <img
                            src={imageUrl}
                            onLoad={onImageLoad}
                            alt="Crop preview"
                            className="rounded-2xl object-contain"
                            style={{ maxHeight: 'calc(100vh - 300px)' }}
                        />
                    </ReactCrop>
                </div>
            </div>

            <div
                className={cn(
                    'absolute left-0 right-0 bg-[#101010] px-4',
                    isMobileBreakpoints ? 'bottom-8 pb-16' : 'bottom-0 pb-8'
                )}>
                <div className="flex gap-4 max-w-lg mx-auto">
                    <button
                        type="button"
                        className="w-full px-4 py-3 text-sm font-semibold text-white bg-neutral-800 rounded-[70px]"
                        onClick={onClose}>
                        Kembali
                    </button>
                    <button
                        type="button"
                        className="w-full px-4 py-3 text-sm font-semibold text-white bg-[#5F2BCE] rounded-[70px]"
                        onClick={getCroppedImg}>
                        Tanyakan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CropModal;
