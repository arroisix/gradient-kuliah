import { useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { BsArrowCounterclockwise, BsBookmark } from 'react-icons/bs';
import { FiArrowUpLeft, FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import { BsCheck } from 'react-icons/bs';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../../types/copilot';
import { cn } from 'commons/utils';
import CopilotIcon from '../../assets/CopilotIcon';
import { chatApi } from '../../redux/api/copilotApi';
import Image from 'next/image';
import ImageModal from '../ImageModal/ImageModal';
import useWindowBreakpoints from '../../../commons/hooks/useWindowBreakpoints';

interface ChatSectionProps {
    messages: ChatMessage[];
    pendingMessage: { content: string; timestamp: string } | null;
    onRetry?: (message: ChatMessage) => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    isLoading?: boolean;
    currentSessionId?: string;
}

const ChatSection = ({
    messages,
    pendingMessage,
    setMessages,
    onRetry,
    isLoading,
    currentSessionId
}: ChatSectionProps): JSX.Element => {
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [isRating, setIsRating] = useState<Record<string, boolean>>({});
    const [isBookmarking, setIsBookmarking] = useState<Record<string, boolean>>(
        {}
    );
    const [imageError, setImageError] = useState<Record<string, boolean>>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { isMobileBreakpoints } = useWindowBreakpoints();

    const handleOpenImage = (imageUrl: string | null | undefined) => {
        if (imageUrl) {
            setSelectedImage(imageUrl);
        }
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    const handleRating = async (message: ChatMessage, newRating: number) => {
        if (!currentSessionId || isRating[message.id]) return;

        try {
            setIsRating((prev) => ({ ...prev, [message.id]: true }));
            const ratingToApply = message.rating === newRating ? 0 : newRating;

            await chatApi.changeMessageRating({
                session_id: currentSessionId,
                message_id: message.id,
                rating: ratingToApply
            });

            const updatedMessages = messages.map((msg) =>
                msg.id === message.id ? { ...msg, rating: ratingToApply } : msg
            );
            setMessages(updatedMessages);
        } catch (error) {
            console.error('Failed to rate message:', error);
        } finally {
            setIsRating((prev) => ({ ...prev, [message.id]: false }));
        }
    };

    const handleBookmark = async (message: ChatMessage) => {
        if (!currentSessionId || isBookmarking[message.id]) return;

        try {
            setIsBookmarking((prev) => ({ ...prev, [message.id]: true }));
            await chatApi.toggleBookmark({
                session_id: currentSessionId,
                message_id: message.id
            });

            const updatedMessages = messages.map((msg) =>
                msg.id === message.id
                    ? { ...msg, isBookmarked: !msg.isBookmarked }
                    : msg
            );
            setMessages(updatedMessages);
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
        } finally {
            setIsBookmarking((prev) => ({ ...prev, [message.id]: false }));
        }
    };

    const handleCopy = async (text: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessageId(messageId);
            setTimeout(() => {
                setCopiedMessageId(null);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleRetry = (message: ChatMessage) => {
        const messageIndex = messages.findIndex((m) => m.id === message.id);
        if (messageIndex > 0) {
            const userMessage = messages[messageIndex - 1];
            if (userMessage && userMessage.role === 'User' && onRetry) {
                onRetry(userMessage);
            }
        }
    };

    const handleImageError = (messageId: string) => {
        setImageError((prev) => ({ ...prev, [messageId]: true }));
    };

    const renderMessage = (message: ChatMessage) => {
        return (
            <>
                {message.image && !imageError[message.id] && (
                    <div className="relative w-full">
                        <div className="mt-4 relative w-full max-w-md aspect-video rounded-lg">
                            <Image
                                src={message.image}
                                alt="Uploaded content"
                                width={800}
                                height={400}
                                className="rounded-lg object-contain w-full h-auto cursor-zoom-in hover:opacity-90 transition-opacity"
                                onClick={() => handleOpenImage(message.image)}
                                onError={() => handleImageError(message.id)}
                                priority
                            />
                        </div>
                    </div>
                )}
                {message.role === 'AI' ? (
                    <div className="space-y-4 w-full">
                        <ReactMarkdown
                            className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}>
                            {message.content}
                        </ReactMarkdown>
                        <div
                            className={cn(
                                'flex items-center gap-4',
                                message.keyword &&
                                    'pb-2 border-b border-[#333333]'
                            )}>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handleCopy(message.content, message.id)
                                    }
                                    className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                                    <div className="flex items-center gap-2">
                                        {copiedMessageId === message.id ? (
                                            <>
                                                <BsCheck
                                                    size={20}
                                                    className="text-green-500"
                                                />
                                                <span className="text-sm text-green-500">
                                                    Copied!
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <BiCopy size={20} />
                                                <span className="text-sm">
                                                    Copy
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleRetry(message)}
                                    className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                                    <div className="flex items-center gap-2">
                                        <BsArrowCounterclockwise size={20} />
                                        <span className="text-sm">Retry</span>
                                    </div>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={() => handleRating(message, 1)}
                                    disabled={isRating[message.id]}
                                    className={cn(
                                        'p-2 rounded-lg transition-colors',
                                        message.rating === 1
                                            ? 'bg-[#5F2BCE] text-white'
                                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800',
                                        isRating[message.id] &&
                                            'opacity-50 cursor-not-allowed'
                                    )}>
                                    <FiThumbsUp
                                        size={20}
                                        className={cn(
                                            message.rating === 1 &&
                                                'fill-current'
                                        )}
                                    />
                                </button>
                                <button
                                    onClick={() => handleRating(message, -1)}
                                    disabled={isRating[message.id]}
                                    className={cn(
                                        'p-2 rounded-lg transition-colors',
                                        message.rating === -1
                                            ? 'bg-[#5F2BCE] text-white'
                                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800',
                                        isRating[message.id] &&
                                            'opacity-50 cursor-not-allowed'
                                    )}>
                                    <FiThumbsDown
                                        size={20}
                                        className={cn(
                                            message.rating === -1 &&
                                                'fill-current'
                                        )}
                                    />
                                </button>
                                <button
                                    onClick={() => handleBookmark(message)}
                                    disabled={isBookmarking[message.id]}
                                    className={cn(
                                        'p-2 rounded-lg transition-colors',
                                        message.isBookmarked
                                            ? 'bg-[#5F2BCE] text-white'
                                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800',
                                        isBookmarking[message.id] &&
                                            'opacity-50 cursor-not-allowed'
                                    )}>
                                    <BsBookmark
                                        size={20}
                                        className={cn(
                                            message.isBookmarked &&
                                                'fill-current'
                                        )}
                                    />
                                </button>
                            </div>
                        </div>
                        {message.keyword && (
                            <button
                                onClick={() => {
                                    if (message.keyword) {
                                        window.location.href = `/search/results?q=${encodeURIComponent(
                                            message.keyword
                                        )}`;
                                    }
                                }}
                                className="w-full px-4 py-3 text-start text-neutral-400 hover:bg-[#222222] rounded-lg transition-colors flex items-center justify-between border border-[#333333]">
                                <span className="text-sm">
                                    Lihat materi terkait
                                </span>
                                <FiArrowUpLeft className="text-neutral-400" />
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-white whitespace-pre-wrap">
                        {message.content}
                    </p>
                )}
            </>
        );
    };

    return (
        <>
            <div
                className={cn(
                    'w-full h-full',
                    isMobileBreakpoints
                        ? 'flex flex-col flex-1'
                        : 'min-h-[1200px]',
                    'pb-16'
                )}>
                <div
                    className={cn(
                        'max-w-3xl w-full mx-auto pb-16',
                        isMobileBreakpoints && 'flex-1 flex flex-col'
                    )}>
                    <div
                        className={cn(
                            'space-y-6',
                            isMobileBreakpoints && 'flex-1'
                        )}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    'flex w-full',
                                    message.role === 'User'
                                        ? 'justify-end'
                                        : 'justify-start'
                                )}>
                                {message.role === 'AI' && (
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-8 h-8 rounded-full bg-[#5F2BCE] flex items-center justify-center">
                                            <CopilotIcon />
                                        </div>
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        'max-w-[80%]',
                                        message.role === 'User' &&
                                            'bg-[#5F2BCE] px-4 py-3 rounded-2xl',
                                        message.role === 'AI' && 'w-full'
                                    )}>
                                    {renderMessage(message)}
                                </div>
                            </div>
                        ))}

                        {pendingMessage && (
                            <div className={cn('flex w-full justify-start')}>
                                <div className="flex-shrink-0 mr-3">
                                    <div className="w-8 h-8 rounded-full bg-[#5F2BCE] flex items-center justify-center">
                                        <CopilotIcon />
                                    </div>
                                </div>
                                <div className="max-w-[80%]">
                                    <div className="space-y-4">
                                        <ReactMarkdown
                                            className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white"
                                            remarkPlugins={[
                                                remarkMath,
                                                remarkGfm
                                            ]}
                                            rehypePlugins={[rehypeKatex]}>
                                            {pendingMessage.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-center items-center w-full py-4">
                                <AiOutlineLoading3Quarters
                                    size={24}
                                    className="animate-spin text-neutral-400"
                                />
                                <span className="ml-2 text-neutral-400">
                                    Copilot sedang berpikir...
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedImage && (
                <ImageModal
                    isOpen={!!selectedImage}
                    onClose={handleCloseImage}
                    imageUrl={selectedImage}
                />
            )}
        </>
    );
};

export default ChatSection;
