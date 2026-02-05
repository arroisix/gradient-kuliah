import { useState, useEffect } from 'react';
import {
    BookmarkIcon,
    ChevronDownIcon,
    RefreshCwIcon,
    ThumbsDownIcon,
    ThumbsUpIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import {
    ChatMessage,
    ContentRecommendation,
    Reasoning,
    SelectedReference
} from 'copilot/types/copilot';
import CopilotIcon from 'copilot/assets/revamp/CopilotIcon';
import { chatApi } from 'copilot/redux/api/copilotApi';
import ImageModal from '../ImageModal';
import MessageObserver from './MessageObserver';
import ContentRecommendations from './ContentRecommendations';
import { useTracker } from 'tracker/tracker';
import { ReasoningIndicator } from 'copilot/components/ReasoningIndicator';
import { cn } from 'commons/utils';

interface ChatSectionProps {
    reasoning: Reasoning;
    messages: ChatMessage[];
    onRetry?: (message: ChatMessage) => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    isLoading?: boolean;
    currentSessionId?: string;
    onOpenUsedReferencesModal?: (references: SelectedReference[]) => void;
}

const ChatSection = ({
    reasoning,
    messages,
    setMessages,
    onRetry,
    isLoading,
    currentSessionId,
    onOpenUsedReferencesModal
}: ChatSectionProps): JSX.Element => {
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
    const tracker = useTracker();

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

            tracker?.genericTrack('Rating a Message', {
                RATING: ratingToApply
            });

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

        tracker?.genericTrack('Bookmarked a Message', {
            MESSAGE_ID: message.id
        });

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

    const handleRetry = (message: ChatMessage) => {
        tracker?.genericTrack('User Retry Generate AI Response', {
            MESSAGE_ID: message.id
        });

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

    const handleViewUsedReferences = (references: SelectedReference[]) => {
        onOpenUsedReferencesModal?.(references);
    };

    useEffect(() => {
        const fetchRecommendations = async (keyword: string) => {
            setIsLoadingRecommendations(true);
            try {
                const response = await chatApi.getContentRecommendation(
                    keyword
                );
                setRecommendations(response.recommendation);
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
        if (!message.keyword) {
            return <></>;
        }

        return (
            <ContentRecommendations
                keyword={message.keyword}
                recommendations={recommendations}
                isLoading={isLoadingRecommendations}
            />
        );
    };

    const renderReferenceIndicator = (message: ChatMessage) => {
        if (!message.usedReferences || message.usedReferences.length === 0) {
            return <></>;
        }

        return (
            <button
                onClick={() =>
                    handleViewUsedReferences(message.usedReferences!)
                }
                className="flex items-center gap-2 text-[#999999] text-sm ml-auto mt-2">
                <span>{message.usedReferences.length} Referensi</span>
                <ChevronDownIcon className="w-5 h-5" />
            </button>
        );
    };

    const renderMessage = (message: ChatMessage) => {
        const isLatestAIMessage =
            message.role === 'AI' &&
            message.id ===
                messages.filter((m) => m.role === 'AI').slice(-1)[0]?.id;

        const messageContent = (
            <>
                {message.image && !imageError[message.id] ? (
                    <div className="relative aspect-video max-w-sm ml-auto rounded-lg overflow-hidden mb-2">
                        <Image
                            src={message.image}
                            alt="embedded image"
                            onClick={() => handleOpenImage(message.image)}
                            onError={() => handleImageError(message.id)}
                            layout="fill"
                            className="object-cover object-center cursor-pointer"
                            priority
                        />
                    </div>
                ) : (
                    <></>
                )}

                {message.role === 'AI' ? (
                    <div className="space-y-4">
                        {/* message content */}
                        <ReactMarkdown
                            className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white text-sm"
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}>
                            {message.content}
                        </ReactMarkdown>

                        <div className="flex justify-between items-center gap-4">
                            {/* retry */}
                            <button
                                type="button"
                                onClick={() => handleRetry(message)}
                                className={cn(
                                    'text-[#999999] hover:text-white hover:bg-[#333333] transition-colors w-8 h-8 rounded-full flex justify-center items-center',
                                    'md:gap-1 md:w-fit md:px-2'
                                )}>
                                <RefreshCwIcon className="shrink-0 w-5 h-5" />
                                <span
                                    className={cn(
                                        'sr-only',
                                        'md:not-sr-only md:capitalize md:font-semibold md:text-xs md:leading-tight'
                                    )}>
                                    retry
                                </span>
                            </button>

                            {/* thumb-up, thumb-down, and bookmark */}
                            <div className="flex justify-end items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleRating(message, 1)}
                                    disabled={isRating[message.id]}
                                    className={cn(
                                        'transition-colors w-8 h-8 rounded-full grid place-items-center',
                                        message.rating === 1
                                            ? 'bg-[#5F2BCE] text-white'
                                            : 'text-[#999999] hover:text-white hover:bg-[#333333]',
                                        isRating[message.id] ? 'opacity-50' : ''
                                    )}>
                                    <ThumbsUpIcon className="w-5 h-5" />
                                    <span className="sr-only">thumbs-up</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleRating(message, -1)}
                                    disabled={isRating[message.id]}
                                    className={cn(
                                        'transition-colors w-8 h-8 rounded-full grid place-items-center',
                                        message.rating === -1
                                            ? 'bg-[#5F2BCE] text-white'
                                            : 'text-[#999999] hover:text-white hover:bg-[#333333]',
                                        isRating[message.id] ? 'opacity-50' : ''
                                    )}>
                                    <ThumbsDownIcon className="w-5 h-5" />
                                    <span className="sr-only">thumbs-down</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleBookmark(message)}
                                    disabled={isBookmarking[message.id]}
                                    className={cn(
                                        'transition-colors w-8 h-8 rounded-full grid place-items-center',
                                        message.isBookmarked
                                            ? 'bg-[#5F2BCE] text-white'
                                            : 'text-[#999999] hover:text-white hover:bg-[#333333]',
                                        isBookmarking[message.id]
                                            ? 'opacity-50'
                                            : ''
                                    )}>
                                    <BookmarkIcon className="w-5 h-5" />
                                    <span className="sr-only">bookmark</span>
                                </button>
                            </div>
                        </div>

                        {isLatestAIMessage && renderRecommendations(message)}
                    </div>
                ) : (
                    <p className="bg-[#363488] text-white text-sm p-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl w-[275px] ml-auto">
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
            {/* render all messages of the current session */}
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={message.role === 'AI' ? 'flex gap-3' : ''}>
                    {message.role === 'AI' ? (
                        <>
                            <div className="shrink-0 bg-[#5F2BCE] w-7 h-7 rounded-full grid place-items-center">
                                <CopilotIcon className="fill-white w-4 h-4" />
                            </div>
                            {renderMessage(message)}
                        </>
                    ) : (
                        renderMessage(message)
                    )}

                    {message.role === 'User' ? (
                        renderReferenceIndicator(message)
                    ) : (
                        <></>
                    )}
                </div>
            ))}

            {/* render reasoning */}
            {isLoading ? <ReasoningIndicator reasoning={reasoning} /> : <></>}

            {selectedImage ? (
                <ImageModal
                    isOpen={!!selectedImage}
                    onClose={handleCloseImage}
                    imageUrl={selectedImage}
                />
            ) : (
                <></>
            )}
        </>
    );
};

export default ChatSection;
