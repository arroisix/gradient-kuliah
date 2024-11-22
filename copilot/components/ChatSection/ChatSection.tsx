import { useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import { BsBookmark } from 'react-icons/bs';
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

interface ChatSectionProps {
    messages: ChatMessage[];
    onRetry?: (message: ChatMessage) => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    isLoading?: boolean;
    currentSessionId?: string;
}

const ChatSection = ({
    messages,
    setMessages,
    onRetry,
    isLoading,
    currentSessionId
}: ChatSectionProps): JSX.Element => {
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [isRating, setIsRating] = useState<Record<string, boolean>>({});

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
            if (userMessage && userMessage.role === 'user' && onRetry) {
                onRetry(userMessage);
            }
        }
    };

    return (
        <div className="w-full min-h-screen h-full pb-16">
            <div className="max-w-3xl w-full mx-auto pb-16">
                <div className="space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                'flex w-full',
                                message.role === 'user'
                                    ? 'justify-end'
                                    : 'justify-start'
                            )}>
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 mr-3">
                                    <div className="w-8 h-8 rounded-full bg-[#5F2BCE] flex items-center justify-center">
                                        <CopilotIcon />
                                    </div>
                                </div>
                            )}
                            <div
                                className={cn(
                                    'max-w-[80%]',
                                    message.role === 'user' &&
                                        'bg-[#5F2BCE] px-4 py-3 rounded-2xl'
                                )}>
                                {message.role === 'assistant' ? (
                                    <div className="space-y-4">
                                        <ReactMarkdown
                                            className="markdown-overflow-break-word markdown-blue-link font-body markdown-img-max-height markdown-body math-display-overflow text-white"
                                            remarkPlugins={[
                                                remarkMath,
                                                remarkGfm
                                            ]}
                                            rehypePlugins={[rehypeKatex]}>
                                            {message.content}
                                        </ReactMarkdown>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleCopy(
                                                            message.content,
                                                            message.id
                                                        )
                                                    }
                                                    className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        {copiedMessageId ===
                                                        message.id ? (
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
                                                                <BiCopy
                                                                    size={20}
                                                                />
                                                                <span className="text-sm">
                                                                    Copy
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRetry(message)
                                                    }
                                                    className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <BsArrowCounterclockwise
                                                            size={20}
                                                        />
                                                        <span className="text-sm">
                                                            Retry
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 ml-auto">
                                                <button
                                                    onClick={() =>
                                                        handleRating(message, 1)
                                                    }
                                                    disabled={
                                                        isRating[message.id]
                                                    }
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
                                                            message.rating ===
                                                                1 &&
                                                                'fill-current'
                                                        )}
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRating(
                                                            message,
                                                            -1
                                                        )
                                                    }
                                                    disabled={
                                                        isRating[message.id]
                                                    }
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
                                                            message.rating ===
                                                                -1 &&
                                                                'fill-current'
                                                        )}
                                                    />
                                                </button>
                                                <button className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                                                    <BsBookmark size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white whitespace-pre-wrap">
                                        {message.content}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

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
    );
};

export default ChatSection;
