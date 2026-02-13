import { useState } from 'react';
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
    Reasoning,
    SelectedReference
} from 'copilot/types/copilot';
import CopilotIcon from 'copilot/assets/revamp/CopilotIcon';
import { chatApi } from 'copilot/redux/api/copilotApi';
import ImageModal from './ImageModal';
import { useTracker } from 'tracker/tracker';
import { ReasoningIndicator } from 'copilot/components/ReasoningIndicator';
import { cn } from 'commons/utils';
import { ContentRecommendations } from 'copilot/components/content-renderer/ContentRecommendations';
import { InterruptInput } from '../content-renderer/InterruptInput';
import { InterruptOptions } from '../content-renderer/InterruptOptions';
import { ExerciseQuestionList } from '../content-renderer/ExerciseQuestionList';
import { InterruptTargetInstitutions } from '../content-renderer/InterruptTargetInstitutions';
import SetTargetDrawer from 'exercises/components/Entrypoint/SetTargetDrawer';
import { GoArrowUpRight } from 'react-icons/go';
import { PerformanceAnalysis } from '../content-renderer/PerformanceAnalysis';
import { References } from '../content-renderer/References';

interface ChatSectionProps {
    reasoning: Reasoning;
    messages: ChatMessage[];
    onRetry?: (message: ChatMessage) => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    isLoading?: boolean;
    currentSessionId?: string;
    isLoadingResponse: boolean;
    sendMessage: (prompt: string, imageUrl?: string) => Promise<void>;
    onOpenUsedReferencesModal?: (references: SelectedReference[]) => void;
}

const ChatSection = ({
    reasoning,
    messages,
    setMessages,
    onRetry,
    isLoading,
    currentSessionId,
    isLoadingResponse,
    sendMessage,
    onOpenUsedReferencesModal
}: ChatSectionProps): JSX.Element => {
    const [isRating, setIsRating] = useState<Record<string, boolean>>({});
    const [isBookmarking, setIsBookmarking] = useState<Record<string, boolean>>(
        {}
    );
    const [imageError, setImageError] = useState<Record<string, boolean>>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
        const rich_content = message.rich_content;
        const messageContent = (
            <>
                {Array.isArray(message.images) &&
                message.images.length > 0 &&
                !imageError[message.id] ? (
                    <div className="carousel flex space-x-4 p-1">
                        {message.images.map((image) => (
                            <div
                                key={image}
                                className="carousel-item relative aspect-video w-[320px] ml-auto rounded-lg overflow-hidden mb-2">
                                <Image
                                    src={image}
                                    alt="embedded image"
                                    onClick={() => handleOpenImage(image)}
                                    onError={() => handleImageError(message.id)}
                                    layout="fill"
                                    className="object-cover object-center cursor-pointer"
                                    priority
                                />
                            </div>
                        ))}
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

                        {/* interrupt */}
                        {message.interrupt?.data.type === 'input' ? (
                            <InterruptInput
                                fields={message.interrupt.data.fields}
                                isLoadingResponse={isLoadingResponse}
                                sendMessage={sendMessage}
                            />
                        ) : message.interrupt?.data.type === 'options' ? (
                            <InterruptOptions
                                fields={message.interrupt.data.fields}
                                isLoadingResponse={isLoadingResponse}
                                sendMessage={sendMessage}
                            />
                        ) : message.interrupt?.data.type === 'special' ? (
                            <SetTargetDrawer isForInterrupt>
                                <InterruptTargetInstitutions
                                    isLoadingResponse={isLoadingResponse}
                                    sendMessage={sendMessage}
                                />
                            </SetTargetDrawer>
                        ) : (
                            <></>
                        )}

                        {/* attachments */}
                        {Array.isArray(rich_content?.attachments) &&
                        rich_content.attachments.length > 0 ? (
                            <div className="carousel flex space-x-4 p-1">
                                {rich_content.attachments.map((v) => (
                                    <button
                                        key={v.url}
                                        onClick={() => handleOpenImage(v.url)}
                                        className="carousel-item relative aspect-video w-[320px] rounded-lg overflow-hidden"
                                        type="button">
                                        <Image
                                            src={v.url}
                                            alt=""
                                            layout="fill"
                                            className="object-cover object-center"
                                        />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <></>
                        )}

                        {/* exercise questions */}
                        {Array.isArray(rich_content?.exercise_questions) &&
                        rich_content.exercise_questions.length > 0 ? (
                            <ExerciseQuestionList
                                currentSessionId={currentSessionId ?? ''}
                                message_id={message.id}
                                exercise_questions={
                                    rich_content.exercise_questions
                                }
                            />
                        ) : (
                            <></>
                        )}

                        {/* performance analysis */}
                        {rich_content?.performance_analysis ? (
                            <PerformanceAnalysis
                                isLoadingResponse={isLoadingResponse}
                                sendMessage={sendMessage}
                                performance_analysis={
                                    rich_content.performance_analysis
                                }
                            />
                        ) : (
                            <></>
                        )}

                        {/* content recommendations */}
                        {Array.isArray(rich_content?.content_recommendations) &&
                        rich_content.content_recommendations.length > 0 ? (
                            <div className="carousel flex space-x-4 p-1">
                                <ContentRecommendations
                                    content_recommendations={
                                        rich_content.content_recommendations
                                    }
                                />
                            </div>
                        ) : (
                            <></>
                        )}

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
                                        'hidden',
                                        'md:block md:capitalize md:font-semibold md:text-xs md:leading-tight'
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
                                </button>
                            </div>
                        </div>

                        {/* references */}
                        {Array.isArray(rich_content?.references) &&
                        rich_content.references.length > 0 ? (
                            <References references={rich_content.references} />
                        ) : (
                            <></>
                        )}

                        {/* question recommendation */}
                        {Array.isArray(rich_content?.question_recommendation) &&
                        rich_content.question_recommendation.length > 0 ? (
                            <div className="space-y-3">
                                <h4 className="text-[#999999] text-sm leading-[160%]">
                                    Saran buat kamu:
                                </h4>

                                {rich_content.question_recommendation.map(
                                    (message) => (
                                        <button
                                            key={message}
                                            onClick={() => sendMessage(message)}
                                            type="button"
                                            className="bg-gradient-to-b from-black/10 to-[#F2F2F2]/10 text-white text-xs leading-[160%] p-3 rounded-xl border border-[#333333] flex justify-between items-center gap-3 text-left">
                                            {message}
                                            <GoArrowUpRight className="shrink-0 text-[#666666] w-5 h-5" />
                                        </button>
                                    )
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                ) : (
                    <p className="bg-[#363488] text-white text-sm p-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl w-[275px] ml-auto">
                        {message.content}
                    </p>
                )}
            </>
        );

        if (message.role === 'AI') {
            return <div className="min-w-0 w-full">{messageContent}</div>;
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
