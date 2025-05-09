import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { BsImage, BsArrowUpShort } from 'react-icons/bs';
import { ImOmega } from 'react-icons/im';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { cn } from 'commons/utils';
import useUploadFile from 'commons/hooks/useUploadFile';
import SymbolForm from 'komunitas/components/KomunitasForm/SymbolForm';
import CropModal from '../CropModal';
import { chatApi } from '../../redux/api/copilotApi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { SparkleIcon } from 'lucide-react';
import { useTracker } from 'tracker/tracker';
import DashboardQuickActions from './DashboardQuickActions';

const DashboardPromptBar = (): JSX.Element => {
    const router = useRouter();
    const user = useSelector(getCurrentUser);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeForm, setActiveForm] = useState<'math' | 'symbol' | null>(
        null
    );
    const { uploadFile } = useUploadFile('qna');
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
    const tracker = useTracker();

    const handleSend = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);

        tracker?.genericTrack(
            'User Attempt to Search/Ask from Dashboard Search Box',
            {
                QUERY: prompt
            }
        );

        try {
            await chatApi.chat(
                { input_text: prompt, image_url: imageUrl || undefined },
                {
                    onContent: () => {
                        // empty
                    },
                    onComplete: async (
                        messageId,
                        chatSessionId,
                        _,
                        keyword
                    ) => {
                        setPrompt('');
                        setImageUrl(null);
                        setImageName(null);
                        setActiveForm(null);

                        if (keyword) {
                            await router.push(
                                `/search/results?q=${encodeURIComponent(
                                    keyword
                                )}`
                            );
                            if (chatSessionId) {
                                chatApi
                                    .deleteSession(chatSessionId)
                                    .catch((error) => {
                                        console.error(
                                            'Failed to delete session:',
                                            error
                                        );
                                    });
                            }
                        } else if (chatSessionId) {
                            await router.push(`/copilot/${chatSessionId}`);
                        }

                        setIsLoading(false);
                    },
                    onError: (error) => {
                        console.error('Chat error:', error);
                        setIsLoading(false);
                    }
                }
            );
        } catch (error) {
            console.error('Failed to send message:', error);
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return;
            } else {
                e.preventDefault();
                if (prompt.trim() && !isLoading) {
                    handleSend();
                }
            }
        }
    };

    const handleSymbolClick = (symbol: string) => {
        const textArea = document.querySelector('textarea');
        if (textArea) {
            const start = textArea.selectionStart || 0;
            const end = textArea.selectionEnd || 0;
            const newPrompt =
                prompt.slice(0, start) + symbol + prompt.slice(end);
            setPrompt(newPrompt);
            setTimeout(() => {
                textArea.setSelectionRange(
                    start + symbol.length,
                    start + symbol.length
                );
                textArea.focus();
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
        } finally {
            setShowCropModal(false);
            setTempImageUrl(null);
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

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            await handleFileUpload(file);
        }
    };

    return (
        <div className="w-full">
            <h1 className="text-2xl font-semibold mb-4">
                Halo, {user.full_name.split(' ')[0]}
            </h1>
            <div className="relative bg-[#1D1D1D] rounded-xl">
                <span
                    className="absolute -top-3 -right-1 flex items-center gap-2 py-1 px-3 rounded-md bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-sm md:text-base text-white tooltip tooltip-left"
                    data-tip="Copilot AI gratis selama versi Beta!">
                    <SparkleIcon size={16} fill="currentColor" />
                    Baru
                </span>
                <div
                    className={cn(
                        'p-4',
                        isDragging &&
                            'border-2 border-dashed border-[#5F2BCE] rounded-xl'
                    )}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                    }}
                    onDrop={handleDrop}>
                    {isLoading ? (
                        <div className="flex justify-center items-center w-full py-4">
                            <AiOutlineLoading3Quarters
                                size={24}
                                className="animate-spin text-neutral-400"
                            />
                            <span className="ml-2 text-neutral-400">
                                Copilot sedang berpikir...
                            </span>
                        </div>
                    ) : (
                        <>
                            {imageUrl && (
                                <div className="mb-3">
                                    <div className="relative inline-block px-[10px] py-[6px] text-[10px] font-body bg-[#272727] rounded-[4px]">
                                        <span className="text-white">
                                            {imageName}
                                        </span>
                                        <button
                                            onClick={() => {
                                                setImageUrl(null);
                                                setImageName(null);
                                            }}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-[#373737] hover:bg-[#444444] rounded-full flex items-center justify-center">
                                            <IoMdClose
                                                className="text-neutral-400"
                                                size={12}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                placeholder="Tanya soal atau cari materi"
                                className="w-full p-0 min-h-[100px] bg-transparent border-none resize-none outline-none text-white placeholder:text-gray-500 focus:ring-0 focus:outline-none"
                            />
                            <DashboardQuickActions
                                onImageCapture={() =>
                                    fileInputRef.current?.click()
                                }
                            />
                        </>
                    )}
                    <div className="flex items-center justify-between gap-3 mt-2">
                        <div className="flex items-center gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept="image/png,image/gif,image/jpeg,image/jpg"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                aria-label="Upload image">
                                <BsImage size={20} />
                            </button>
                            <button
                                className={cn(
                                    'p-2 text-gray-400 hover:text-white transition-colors',
                                    activeForm === 'symbol' &&
                                        'bg-neutral-800 text-white rounded-lg'
                                )}
                                onClick={() =>
                                    setActiveForm(
                                        activeForm === 'symbol'
                                            ? null
                                            : 'symbol'
                                    )
                                }
                                aria-label="Math input">
                                <ImOmega size={18} />
                            </button>
                        </div>
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
                            <BsArrowUpShort size={24} className="text-white" />
                        </button>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center px-4 py-3 bg-[#171717] text-xs text-gray-400">
                    <div className="flex items-center">
                        <span>Powered by</span>
                        <span className="ml-1 text-[#B6A6F3]">Copilot AI</span>
                    </div>
                </div>
            </div>
            {activeForm === 'symbol' && (
                <div className="mt-2 bg-[#242424] rounded-lg max-h-[300px] overflow-y-auto">
                    <div className="p-4">
                        <SymbolForm onClickSymbol={handleSymbolClick} />
                    </div>
                </div>
            )}
            {showCropModal && tempImageUrl && (
                <div className="fixed inset-0 z-50 bg-[#101010]">
                    <CropModal
                        onClose={() => {
                            setShowCropModal(false);
                            setTempImageUrl(null);
                        }}
                        imageUrl={tempImageUrl}
                        onCropComplete={handleCropComplete}
                    />
                </div>
            )}
        </div>
    );
};

export default DashboardPromptBar;
