import {
    useState,
    useRef,
    KeyboardEvent,
    DragEvent,
    useEffect,
    forwardRef
} from 'react';
import { BsImage, BsArrowUpShort } from 'react-icons/bs';
import { ImOmega } from 'react-icons/im';
import { IoMdClose } from 'react-icons/io';
import { Plus, ChevronDown } from 'lucide-react';
import { cn } from 'commons/utils';
import MathForm from 'komunitas/components/KomunitasForm/MathForm';
import SymbolForm from 'komunitas/components/KomunitasForm/SymbolForm';
import useUploadFile from 'commons/hooks/useUploadFile';
import CropModal from '../CropModal';
import { useTracker } from 'tracker/tracker';

interface PromptBarProps {
    onSend?: (prompt: string, imageUrl?: string) => void;
    isLoading?: boolean;
    onStateChange?: (state: { isEditorOpen: boolean }) => void;
    fileInputRef?: React.RefObject<HTMLInputElement>;
    placeholder?: string;
    showBorder?: boolean;
    isSidebar?: boolean;
    onOpenReferenceModal?: () => void;
    referenceCount?: number;
}

const PromptBar = forwardRef<HTMLInputElement, PromptBarProps>(
    (
        {
            onSend,
            isLoading,
            onStateChange,
            fileInputRef: externalFileInputRef,
            placeholder = 'Lagi butuh bantuan apa sobat? Jangan masukkan data pribadi kamu yaa!',
            showBorder = true,
            isSidebar = false,
            onOpenReferenceModal,
            referenceCount = 0
        },
        ref
    ) => {
        const [prompt, setPrompt] = useState('');
        const [imageUrl, setImageUrl] = useState<string | null>(null);
        const [imageName, setImageName] = useState<string | null>(null);
        const [isDragging, setIsDragging] = useState(false);
        const [referensiCount, setReferensiCount] = useState(0);
        const internalFileInputRef = useRef<HTMLInputElement>(null);
        const fileInputRef = externalFileInputRef || internalFileInputRef;
        const [activeForm, setActiveForm] = useState<'math' | 'symbol' | null>(
            null
        );
        const { uploadFile } = useUploadFile('qna');
        const [showCropModal, setShowCropModal] = useState(false);
        const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
        const tracker = useTracker();

        useEffect(() => {
            onStateChange?.({ isEditorOpen: activeForm !== null });
        }, [activeForm, onStateChange]);

        const handleSend = () => {
            if (prompt.trim() && onSend && !isLoading) {
                tracker?.genericTrack('Send Message to Copilot', {
                    MESSAGE_CONTENT: prompt
                });
                onSend(prompt, imageUrl || undefined);
                setPrompt('');
                setImageUrl(null);
                setImageName(null);
                setActiveForm(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };

        const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        };

        const handleSymbolClick = (symbol: string) => {
            if (ref && 'current' in ref && ref.current) {
                const input = ref.current;
                const start = input.selectionStart || 0;
                const end = input.selectionEnd || 0;
                const newPrompt =
                    prompt.slice(0, start) + symbol + prompt.slice(end);
                setPrompt(newPrompt);
                setTimeout(() => {
                    input.setSelectionRange(
                        start + symbol.length,
                        start + symbol.length
                    );
                    input.focus();
                });
            }
        };

        const handleFileUpload = async (file: File) => {
            if (!file.type.startsWith('image/')) {
                console.error('Only image files are allowed');
                return;
            }

            const tempUrl = URL.createObjectURL(file);
            setTempImageUrl(tempUrl);
            setShowCropModal(true);
        };

        const handleCropComplete = async (croppedImageUrl: string) => {
            try {
                const response = await fetch(croppedImageUrl);
                const blob = await response.blob();
                const croppedFile = new File([blob], 'cropped-image.jpg', {
                    type: 'image/jpeg'
                });

                const urls = await uploadFile([croppedFile]);
                if (urls && urls.length > 0) {
                    setImageUrl(urls[0]);
                    setImageName('cropped-image.jpg');
                }
            } catch (error) {
                console.error('Failed to process cropped image:', error);
            }
        };

        const handleImageUpload = async (
            event: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file = event.target.files?.[0];
            if (file) {
                await handleFileUpload(file);
            }
        };

        const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        };

        const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
        };

        const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                await handleFileUpload(file);
            }
        };

        const handlePaste = async (e: React.ClipboardEvent) => {
            const items = e.clipboardData.items;

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        await handleFileUpload(file);
                        break;
                    }
                }
            }
        };

        const handleRemoveImage = () => {
            setImageUrl(null);
            setImageName(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        const handleReferensiClick = () => {
            onOpenReferenceModal?.();
        };

        return (
            <>
                <div className="flex flex-col gap-2">
                    <div
                        className={cn(
                            'py-2 relative',
                            showBorder && 'border-t md:border-t-0 md:border-2 border-neutral-800 md:rounded-xl',
                            isDragging && 'border-[#5F2BCE] border-2',
                            isDragging && 'ring-2 ring-[#5F2BCE]/50'
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}>
                        {isDragging && (
                            <div className="absolute inset-0 bg-[#5F2BCE]/10 rounded-xl flex items-center justify-center pointer-events-none z-10">
                                <div className="bg-[#1D1D1D] px-4 py-2 rounded-lg text-sm font-medium">
                                    Drop image here
                                </div>
                            </div>
                        )}

                        {imageUrl && (
                            <div className="px-5 pb-3">
                                <div className="relative inline-block px-[10px] py-[6px] text-[10px] font-body bg-[#272727] rounded-[4px]">
                                    <button
                                        className="inline-block text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#5F2BCE] focus:ring-offset-1 focus:ring-offset-[#272727] rounded"
                                        onClick={() => window.open(imageUrl)}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                            ) {
                                                e.preventDefault();
                                                window.open(imageUrl);
                                            }
                                        }}
                                        tabIndex={0}>
                                        {imageName}
                                    </button>
                                    <button
                                        className="absolute top-[-5px] right-[-5px] w-[15px] h-[15px] bg-[#373737] hover:bg-[#444444] rounded-full flex justify-center items-center cursor-pointer transition-colors"
                                        onClick={handleRemoveImage}
                                        aria-label="Remove image">
                                        <IoMdClose className="text-neutral-400" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="px-2 pb-3">
                            <input
                                ref={ref}
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onPaste={handlePaste}
                                placeholder={placeholder}
                                className="w-full bg-transparent border-none focus:ring-0 outline-none text-white md:placeholder:text-base placeholder:text-sm"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="px-5 pb-4">
                            <div className={cn(isSidebar ? "mb-3" : "md:hidden mb-3")}>
                                {referensiCount === 0 ? (
                                    <button
                                        onClick={handleReferensiClick}
                                        className="flex items-center gap-1 px-3 py-1 rounded-full border border-neutral-600 hover:border-neutral-500 transition-colors text-sm text-neutral-300 hover:text-white"
                                        disabled={isLoading}>
                                        <Plus size={14} />
                                        <span>Tambah Referensi</span>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleReferensiClick}
                                            className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-600 hover:border-neutral-500 transition-colors text-neutral-300 hover:text-white"
                                            disabled={isLoading}>
                                            <Plus size={14} />
                                        </button>
                                        <button
                                            className="flex items-center gap-1 px-3 py-1 rounded-full border border-neutral-600 hover:border-neutral-500 transition-colors text-sm text-neutral-300 hover:text-white"
                                            disabled={isLoading}>
                                            <span>{referensiCount} Referensi ditambahkan</span>
                                            <ChevronDown size={14} className="rotate-180" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        hidden
                                        accept="image/png,image/gif,image/jpeg,image/jpg"
                                        capture="environment"
                                        onChange={handleImageUpload}
                                    />
                                    <button
                                        onClick={() => {
                                            tracker?.genericTrack(
                                                'Click Image Attachment'
                                            );
                                            fileInputRef.current?.click();
                                        }}
                                        disabled={isLoading}
                                        className={cn(
                                            'text-neutral-400 hover:text-white transition-colors',
                                            imageUrl && 'text-white'
                                        )}
                                        aria-label="Upload image">
                                        <BsImage size={20} />
                                    </button>
                                    <button
                                        className={cn(
                                            'text-neutral-400 hover:text-white p-2 rounded-lg transition-colors',
                                            activeForm === 'symbol' &&
                                                'bg-neutral-800 text-white'
                                        )}
                                        onClick={() => {
                                            tracker?.genericTrack(
                                                'Click Special Symbol Button'
                                            );
                                            setActiveForm(
                                                activeForm === 'symbol'
                                                    ? null
                                                    : 'symbol'
                                            );
                                        }}
                                        disabled={isLoading}
                                        aria-label="Symbol input">
                                        <ImOmega size={16} />
                                    </button>
                                    
                                    <div className={cn(isSidebar ? "hidden" : "hidden md:block")}>
                                        {referensiCount === 0 ? (
                                            <button
                                                onClick={handleReferensiClick}
                                                className="flex items-center gap-1 px-3 py-1 rounded-full border border-neutral-600 hover:border-neutral-500 transition-colors text-sm text-neutral-300 hover:text-white"
                                                disabled={isLoading}>
                                                <Plus size={14} />
                                                <span>Tambah Referensi</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-600 hover:border-neutral-500 transition-colors text-neutral-300 hover:text-white"
                                                    disabled={isLoading}>
                                                    <Plus size={14} />
                                                </button>
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1 rounded-full border border-neutral-600 hover:border-neutral-500 transition-colors text-sm text-neutral-300 hover:text-white"
                                                    disabled={isLoading}>
                                                    <span>{referensiCount} Referensi ditambahkan</span>
                                                    <ChevronDown size={14} className="rotate-180" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2">
                                    <span className="text-neutral-500 text-xs font-thin">
                                        *Copilot bisa salah, tolong cek lagi yaa!
                                    </span>
                                    <button
                                        onClick={handleSend}
                                        disabled={isLoading || !prompt.trim()}
                                        className={cn(
                                            'transition-colors bg-[#5F2BCE] p-1.5 rounded-full',
                                            prompt.trim() && !isLoading
                                                ? 'opacity-100 hover:opacity-90'
                                                : 'opacity-50 cursor-not-allowed'
                                        )}
                                        aria-label="Send message">
                                        <BsArrowUpShort
                                            size={24}
                                            className="text-white"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {activeForm === 'math' && (
                        <div className="bg-[#242424] rounded-lg max-h-[300px] overflow-y-auto">
                            <div className="p-4">
                                <MathForm />
                            </div>
                        </div>
                    )}

                    {activeForm === 'symbol' && (
                        <div className="bg-[#242424] rounded-lg max-h-[300px] overflow-y-auto">
                            <div className="p-4">
                                <SymbolForm onClickSymbol={handleSymbolClick} />
                            </div>
                        </div>
                    )}
                </div>
                {showCropModal && tempImageUrl && (
                    <div
                        className={cn(
                            'absolute inset-0 bg-[#101010]',
                            'fixed md:absolute z-50 md:z-auto'
                        )}>
                        <CropModal
                            onClose={() => {
                                setShowCropModal(false);
                                setTempImageUrl(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                            imageUrl={tempImageUrl}
                            onCropComplete={handleCropComplete}
                        />
                    </div>
                )}
            </>
        );
    }
);

PromptBar.displayName = 'PromptBar';

export default PromptBar;