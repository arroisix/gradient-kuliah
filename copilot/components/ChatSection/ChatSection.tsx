import { useState, useEffect } from 'react';
import { BiCopy } from 'react-icons/bi';
import { BsArrowCounterclockwise, BsBookmark, BsCheck } from 'react-icons/bs';
import { FiArrowUpLeft, FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Image from 'next/image';
import { ChatMessage, ContentRecommendation } from '../../types/copilot';
import { cn } from 'commons/utils';
import CopilotIcon from '../../assets/CopilotIcon';
import { chatApi } from '../../redux/api/copilotApi';
import ImageModal from '../ImageModal/ImageModal';
import { Library } from 'lucide-react';
import MessageObserver from '../MessageObserver';

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
    const [recommendations, setRecommendations] = useState<
        ContentRecommendation[]
    >([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] =
        useState(false);

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

    const getContentUrl = (content: ContentRecommendation): string => {
        switch (content.type) {
            case 'course_video':
                return content.course_slug && content.subchapter_slug
                    ? `/kelas/${content.course_slug}/${content.subchapter_slug}`
                    : '#';
            case 'astronotes_content':
                return content.book_slug && content.book_page
                    ? `/perpustakaan/astronotes/${content.book_slug}/${content.book_page}`
                    : '#';
            case 'textbook_problem':
                return content.book_slug && content.problem_slug
                    ? `/perpustakaan/textbook/${content.book_slug}/${content.problem_slug}`
                    : '#';
            case 'bank_soal_problem':
                return content.book_slug && content.problem_slug
                    ? `/perpustakaan/bank-soal/${content.book_slug}/${content.problem_slug}`
                    : '#';
        }
    };

    useEffect(() => {
        const fetchRecommendations = async (keyword: string) => {
            setIsLoadingRecommendations(true);
            try {
                const response = await chatApi.getContentRecommendation(
                    keyword
                );
                setRecommendations(response.recommendation.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
                setRecommendations([]);
            } finally {
                setIsLoadingRecommendations(false);
            }
        };

        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'AI' && lastMessage.keyword) {
            fetchRecommendations(lastMessage.keyword);
        } else {
            setRecommendations([]);
        }
    }, [messages]);

    const renderRecommendations = (message: ChatMessage) => {
        if (!message.keyword) return null;

        return (
            <div className="mt-4 space-y-4">
                <button
                    onClick={() => {
                        window.location.href = `/search/results?q=${encodeURIComponent(
                            message.keyword!
                        )}`;
                    }}
                    className="w-full px-4 py-3 text-start text-neutral-400 hover:bg-[#222222] rounded-lg transition-colors flex items-center justify-between border border-[#333333]">
                    <span className="text-sm">Lihat materi terkait</span>
                    <FiArrowUpLeft className="text-neutral-400" />
                </button>

                {isLoadingRecommendations ? (
                    <div className="flex justify-center py-4">
                        <AiOutlineLoading3Quarters
                            className="animate-spin text-neutral-400"
                            size={24}
                        />
                    </div>
                ) : (
                    recommendations.length > 0 && (
                        <div className="relative w-full">
                            <div className="absolute left-0 right-0">
                                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                                    {recommendations.map((content, index) => (
                                        <Link
                                            key={index}
                                            href={getContentUrl(content)}
                                            className="flex-shrink-0 bg-[#222222] w-[280px] rounded-lg overflow-hidden flex flex-col">
                                            {content.type === 'course_video' ? (
                                                <>
                                                    {content.thumbnail && (
                                                        <div className="relative aspect-video w-full">
                                                            <Image
                                                                src={
                                                                    content.thumbnail
                                                                }
                                                                alt={
                                                                    content.subchapter_name ||
                                                                    ''
                                                                }
                                                                layout="fill"
                                                                className="object-cover"
                                                                priority
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                                                                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                                                                </div>
                                                            </div>
                                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                                                            {content.subchapter_name && (
                                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                                    <p className="text-[10px] text-white font-medium line-clamp-2">
                                                                        {
                                                                            content.subchapter_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex flex-col h-full p-3">
                                                    {content.snippet && (
                                                        <p
                                                            className="text-sm text-white flex-1"
                                                            dangerouslySetInnerHTML={{
                                                                __html: content.snippet.replace(
                                                                    /<mark>(.*?)<\/mark>/g,
                                                                    '<span class="text-[#F2C04C]">$1</span>'
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Library
                                                            size={16}
                                                            className="text-[#7D89CC]"
                                                        />
                                                        <p className="text-sm text-[#999999] transition-colors">
                                                            {content.book_name}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[160px]" />
                        </div>
                    )
                )}
            </div>
        );
    };

    const renderMessage = (message: ChatMessage) => {
        const isLatestAIMessage =
            message.role === 'AI' &&
            message.id ===
                messages.filter((m) => m.role === 'AI').slice(-1)[0]?.id;

        const messageContent = (
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
                        {isLatestAIMessage && renderRecommendations(message)}
                    </div>
                ) : (
                    <p className="text-white whitespace-pre-wrap">
                        {message.content}
                    </p>
                )}
            </>
        );

        if (message.role === 'AI') {
            return (
                <MessageObserver
                    message={message}
                    onRecommendationsUpdate={(recommendations) => {
                        if (isLatestAIMessage) {
                            setRecommendations(recommendations);
                        }
                    }}
                    isLatest={isLatestAIMessage}>
                    {messageContent}
                </MessageObserver>
            );
        }

        return messageContent;
    };

    return (
        <>
            <div
                className={cn(
                    'w-full h-full pb-16',
                    'flex flex-col md:flex-1',
                    'min-h-[1200px] md:min-h-0'
                )}>
                <div
                    className={cn(
                        'w-full mx-auto pb-16',
                        'flex-1 flex flex-col md:block'
                    )}>
                    <div className={cn('space-y-6', 'flex-1 md:block')}>
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
