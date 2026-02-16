import {
    useState,
    KeyboardEvent,
    DragEvent,
    useEffect,
    FormEvent,
    useRef
} from 'react';
import {
    PlusIcon,
    XIcon,
    BookOpenIcon,
    ImageIcon,
    CameraIcon
} from 'lucide-react';
import { cn } from 'commons/utils';
import SymbolForm from 'komunitas/components/KomunitasForm/SymbolForm';
import useUploadFile from 'commons/hooks/useUploadFile';
import CropModal from '../../CropModal';
import { useTracker } from 'tracker/tracker';
import { FaArrowUp } from 'react-icons/fa6';
import Modal from 'commons/components/modules/Modal';
import { TbMath } from 'react-icons/tb';
import { useWindowSize } from 'usehooks-ts';
import { useAuth } from 'authentication/contexts/AuthProvider';

interface PromptBarProps {
    onSend?: (prompt: string, imageUrl?: string) => void;
    isLoading?: boolean;
    onStateChange?: (state: { isEditorOpen: boolean }) => void;
    placeholder?: string;
    onOpenReferenceModal?: () => void;
    onOpenReferenceContentModal?: () => void;
    referenceCount?: number;
}

function PromptBar({
    onSend,
    isLoading,
    onStateChange,
    placeholder = 'Lagi butuh bantuan apa sobat?',
    onOpenReferenceModal,
    onOpenReferenceContentModal,
    referenceCount = 0
}: PromptBarProps): JSX.Element {
    const promptBarRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeForm, setActiveForm] = useState<'math' | 'symbol' | null>(
        null
    );
    const { uploadFile } = useUploadFile('qna');
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
    const tracker = useTracker();
    const { width } = useWindowSize();
    const { profile } = useAuth();

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

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSymbolClick = (symbol: string) => {
        if (promptBarRef && 'current' in promptBarRef && promptBarRef.current) {
            const input = promptBarRef.current;
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
            // setIsModalOpen(false);
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
        if (referenceCount === 0) {
            onOpenReferenceModal?.();
        } else {
            onOpenReferenceContentModal?.();
        }
        setIsModalOpen(false);
    };

    const handleAutogrowPrompt = (
        event: FormEvent<HTMLTextAreaElement>
    ): void => {
        event.currentTarget.style.height = 'auto';
        event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
    };

    const handleClickCamera = (): void => {
        tracker?.genericTrack('Click Scan Foto Soal CTA');
        fileInputRef.current?.click();
        setIsModalOpen(false);
    };

    const handleClickImage = (): void => {
        tracker?.genericTrack('Click Image Attachment');
        fileInputRef.current?.click();
        setIsModalOpen(false);
    };

    const handleClickSymbol = (): void => {
        tracker?.genericTrack('Click Special Symbol Button');
        setActiveForm(activeForm === 'symbol' ? null : 'symbol');
        setIsModalOpen(false);
    };

    const handleOpenModal = (): void => {
        setIsModalOpen(!isModalOpen);
        setActiveForm(null);
    };

    return (
        <>
            <input
                hidden
                ref={fileInputRef}
                onChange={handleImageUpload}
                type="file"
                accept="image/png,image/gif,image/jpeg,image/jpg,image/*"
                capture="environment"
            />

            <div
                className={cn(
                    'bg-[#101010] bg-opacity-[55%] px-6 py-4 rounded-tl-2xl rounded-tr-2xl border-t space-y-4 transition-colors',
                    'md:border md:mb-4 md:rounded-2xl',
                    prompt ? 'border-[#5F2BCE]' : 'border-[#222222]'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}>
                {isDragging ? (
                    <div className="absolute inset-0 bg-black/75 grid place-items-center pointer-events-none z-10">
                        <div className="bg-[#333333] px-4 py-2 rounded-lg text-sm font-medium">
                            Drop image here
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {imageUrl ? (
                    <div className="relative inline-block px-[10px] py-[6px] text-[10px] font-body bg-[#272727] rounded-full">
                        <button
                            className="inline-block text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#5F2BCE] focus:ring-offset-1 focus:ring-offset-[#272727] rounded"
                            onClick={() => window.open(imageUrl)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
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
                            <XIcon className="text-neutral-400" />
                        </button>
                    </div>
                ) : (
                    <></>
                )}

                <textarea
                    ref={promptBarRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={placeholder}
                    disabled={isLoading}
                    rows={1}
                    onInput={handleAutogrowPrompt}
                    className="scrollbar-thin text-white placeholder:text-[#4D5165] text-sm w-full max-h-64 bg-transparent p-0 resize-none border-none focus:outline-none focus:ring-0"
                />

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={isLoading}
                            onClick={handleOpenModal}
                            type="button"
                            className={cn(
                                'shrink-0 hover:bg-[#20222E] border border-[#333540] hover:text-white transition-colors rounded-full w-8 h-8 grid place-items-center',
                                isModalOpen
                                    ? 'bg-[#282B3C] text-white'
                                    : 'bg-[#191920] text-[#DEDEDE]'
                            )}>
                            <PlusIcon className="w-4 h-4" />
                            <span className="sr-only">open modal</span>
                        </button>

                        <button
                            disabled={isLoading}
                            onClick={handleClickSymbol}
                            type="button"
                            className={cn(
                                'shrink-0 hover:bg-[#20222E] border border-[#333540] hover:text-white transition-colors rounded-full w-8 h-8 grid place-items-center',
                                activeForm === 'symbol'
                                    ? 'bg-[#282B3C] text-white'
                                    : 'bg-[#191920] text-[#DEDEDE]'
                            )}>
                            <TbMath className="w-4 h-4" />
                            <span className="sr-only">Rumus</span>
                        </button>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={isLoading || !prompt.trim()}
                        className={cn(
                            'bg-[#5F2BCE] hover:opacity-90 transition-colors w-8 h-8 grid place-items-center rounded-full',
                            isLoading || !prompt.trim()
                                ? 'opacity-50 pointer-events-none'
                                : ''
                        )}>
                        <FaArrowUp className="text-white w-4 h-4" />
                        <span className="sr-only">send message</span>
                    </button>
                </div>

                {activeForm === 'symbol' ? (
                    <div className="bg-[#242424] rounded-lg max-h-[300px] overflow-y-auto p-4 scrollbar-thin">
                        <SymbolForm onClickSymbol={handleSymbolClick} />
                    </div>
                ) : (
                    <></>
                )}
            </div>

            <p
                className={cn(
                    'hidden justify-center items-center text-[#999999] font-medium text-xs leading-tight mb-8',
                    'md:flex'
                )}>
                *Copilot bisa salah, tolong cek lagi yaa!
            </p>

            {showCropModal && tempImageUrl ? (
                <div className="fixed z-50 top-14 left-0 right-0 bottom-0 bg-[#101010]">
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
            ) : (
                <></>
            )}

            {/* mobile modal */}
            {isModalOpen && width < 768 ? (
                <Modal
                    isOpen={isModalOpen}
                    setOpen={(value) => setIsModalOpen(value)}
                    permanent={true}
                    variant="dark">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-semibold">
                                Tambahkan di chat
                            </h3>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                type="button">
                                <XIcon className="text-[#4D5165] w-6 h-6" />
                                <span className="sr-only">close modal</span>
                            </button>
                        </div>

                        <div className="w-full max-w-[343px] mx-auto space-y-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleClickCamera}
                                    className="bg-[#282B3C] flex flex-col items-center gap-3 p-3 rounded-lg w-full">
                                    <div className="w-8 h-8 rounded-full grid place-items-center bg-[#20222E]">
                                        <CameraIcon className="text-[#DEDEDE] w-5 h-5" />
                                    </div>
                                    <span className="text-white text-sm leading-[125%]">
                                        Kamera
                                    </span>
                                </button>

                                <button
                                    onClick={handleClickImage}
                                    className="bg-[#282B3C] flex flex-col items-center gap-3 p-3 rounded-lg w-full">
                                    <div className="w-8 h-8 rounded-full grid place-items-center bg-[#20222E]">
                                        <ImageIcon className="text-[#DEDEDE] w-5 h-5" />
                                    </div>
                                    <span className="text-white text-sm leading-[125%]">
                                        Gambar
                                    </span>
                                </button>
                            </div>

                            {profile?.current_role === 'COLLEGE_STUDENT' ? (
                                <button
                                    onClick={handleReferensiClick}
                                    type="button"
                                    className="bg-[#282B3C] flex items-center gap-3 p-3 rounded-lg w-full">
                                    <div className="w-8 h-8 rounded-full grid place-items-center bg-[#20222E]">
                                        <BookOpenIcon className="text-[#DEDEDE] w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-white text-sm">
                                            Pakai Referensi
                                        </span>
                                        <span className="text-[#999999] text-sm">
                                            Gunakan materi kelas dari Gradient.
                                        </span>
                                    </div>
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Modal>
            ) : (
                <></>
            )}

            {/* desktop modal */}
            {isModalOpen && width >= 768 ? (
                <div
                    className={cn(
                        'animate-fade-up animate-duration-300 bg-[#181818] w-[303px] rounded-lg p-4 absolute left-6 space-y-3',
                        profile?.current_role === 'COLLEGE_STUDENT'
                            ? '-top-[(calc(153px+23px))]'
                            : '-top-[(calc(76px+23px))]'
                    )}>
                    <button
                        onClick={handleClickImage}
                        className="bg-[#222222] hover:bg-[#333333] transition-colors w-full flex items-center gap-3 px-4 py-3 rounded-lg">
                        <ImageIcon className="text-[#999999] w-5 h-5" />
                        <span className="text-white text-sm font-semibold leading-tight">
                            Gambar
                        </span>
                    </button>

                    {profile?.current_role === 'COLLEGE_STUDENT' ? (
                        <button
                            onClick={handleReferensiClick}
                            type="button"
                            className="bg-[#222222] hover:bg-[#333333] transition-colors w-full flex gap-3 px-4 py-3 rounded-lg">
                            <BookOpenIcon className="text-[#999999] w-5 h-5" />
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-white text-sm leading-tight">
                                    Pakai Referensi
                                </span>
                                <span className="text-[#999999] text-xs leading-[160%]">
                                    Gunakan materi kelas dari Gradient.
                                </span>
                            </div>
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

PromptBar.displayName = 'PromptBar';

export default PromptBar;
