import { BiSolidCamera } from 'react-icons/bi';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { useTracker } from 'tracker/tracker';
import CardsActionButton from 'flashcard/assets/CardsActionButton';

interface ActionButtonsProps {
    onImageCapture?: () => void;
}

const ActionButtons = ({ onImageCapture }: ActionButtonsProps): JSX.Element => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const tracker = useTracker();

    const handleScanClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onImageCapture) {
            onImageCapture();
        }
    };

    const handleCreateFlashcard = () => {
        router.push('/flashcard/create-ai');
    };

    return (
        <div
            className={cn(
                'flex gap-2 justify-between w-full',
                !isMobileBreakpoints && 'max-w-[360px]'
            )}>
            <input
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button
                onClick={() => {
                    tracker?.genericTrack('Click Scan Foto Soal CTA');
                    handleScanClick();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#222222] hover:bg-neutral-800 p-4 rounded-lg transition-colors">
                <BiSolidCamera color={'#5D75FF'} size={20} />
                <span>Scan Foto Soal</span>
            </button>
            <button
                onClick={() => {
                    tracker?.genericTrack('Click Buat Flashcard CTA');
                    handleCreateFlashcard();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#222222] hover:bg-neutral-800 p-4 rounded-lg transition-colors">
                <CardsActionButton />
                <span>Buat Flashcard</span>
            </button>
        </div>
    );
};

export default ActionButtons;
