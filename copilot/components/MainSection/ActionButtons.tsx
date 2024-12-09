import { BsQuestionCircleFill } from 'react-icons/bs';
import { BiSolidCamera } from 'react-icons/bi';
import { useRef } from 'react';

interface ActionButtonsProps {
    onFocusPrompt?: () => void;
    onImageCapture?: () => void;
}

const ActionButtons = ({
    onFocusPrompt,
    onImageCapture
}: ActionButtonsProps): JSX.Element => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <div className="flex gap-2 justify-between w-full max-w-[360px]">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button
                onClick={() => onFocusPrompt?.()}
                className="flex-1 flex items-center justify-center gap-2 bg-[#222222] hover:bg-neutral-800 p-4 rounded-lg transition-colors">
                <BsQuestionCircleFill color={'#9747FF'} size={20} />
                <span>Tanya Soal</span>
            </button>
            <button
                onClick={handleScanClick}
                className="flex-1 flex items-center justify-center gap-2 bg-[#222222] hover:bg-neutral-800 p-4 rounded-lg transition-colors">
                <BiSolidCamera color={'#5D75FF'} size={20} />
                <span>Scan Foto Soal</span>
            </button>
        </div>
    );
};

export default ActionButtons;
