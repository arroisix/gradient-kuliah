import { useState, useRef, useEffect } from 'react';
import MainSection from '../components/MainSection/MainSection';
import ChatSection from '../components/ChatSection/ChatSection';
import { ChatMessage } from '../types/copilot';
import PromptBar from '../components/MainSection/PromptBar';
import { chatApi } from '../redux/api/copilotApi';
import MobileHeader from '../components/MobileHeader/MobileHeader';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import CopilotAuthPrompt from '../components/AuthPrompt/AuthPrompt';

const CopilotContainer = (): JSX.Element => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [currentSessionId, setCurrentSessionId] = useState<
        string | undefined
    >();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [pendingMessage, setPendingMessage] = useState<{
        content: string;
        timestamp: string;
    } | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                const response = await chatApi.getChatHistory();
                if (response.history && response.history.length > 0) {
                    const convertedMessages: ChatMessage[] =
                        response.history.map(
                            (item: {
                                role: 'AI' | 'User';
                                message: string;
                                message_id: string;
                                rating: number;
                                is_bookmarked: boolean;
                                image?: string | null;
                            }) => ({
                                id: item.message_id,
                                role: item.role === 'AI' ? 'AI' : 'User',
                                content: item.message,
                                timestamp: new Date().toISOString(),
                                rating: item.rating,
                                isBookmarked: item.is_bookmarked,
                                image: item.image
                            })
                        );
                    setMessages(convertedMessages);
                    setCurrentSessionId(response.session_id);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setIsLoadingHistory(false);
                scrollToBottom();
            }
        };

        loadChatHistory();
    }, []);

    useEffect(() => {
        if (messages && messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const isNearBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    const scrollToBottom = () => {
        if (isMobileBreakpoints) {
            messagesEndRef.current?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        } else {
            chatContainerRef.current?.scrollTo({
                top: chatContainerRef.current?.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const handleSendMessage = async (prompt: string, imageUrl?: string) => {
        if (!prompt.trim()) return;

        const lastMessage = messages[messages.length - 1];
        if (
            lastMessage?.content === prompt &&
            lastMessage.role === 'User' &&
            Date.now() - new Date(lastMessage.timestamp).getTime() < 2000
        ) {
            console.log('Preventing duplicate message');
            return;
        }

        setIsLoadingResponse(true);
        const timestamp = new Date().toISOString();

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'User',
            content: prompt,
            timestamp,
            image: imageUrl || null
        };

        setMessages((prev) => [...prev, userMessage]);
        scrollToBottom();
        let currentResponse = '';

        try {
            await chatApi.chatSingle(
                {
                    input_text: prompt,
                    session_id: currentSessionId,
                    image_url: imageUrl
                },
                {
                    onContent: (content) => {
                        currentResponse += content;
                        setPendingMessage({
                            content: currentResponse,
                            timestamp: new Date().toISOString()
                        });
                        scrollToBottom();
                    },
                    onComplete: (messageId, sessionId) => {
                        setPendingMessage(null);

                        if (sessionId) {
                            setCurrentSessionId(sessionId);
                        }
                        if (messageId) {
                            setMessages((prev) => {
                                const aiMessage: ChatMessage = {
                                    id: messageId,
                                    role: 'AI',
                                    content: currentResponse,
                                    timestamp: new Date().toISOString()
                                };
                                return [...prev, aiMessage];
                            });
                        }
                    },
                    onError: (error) => {
                        console.error('Chat error:', error);
                        setPendingMessage(null);

                        const errorMessage: ChatMessage = {
                            id: 'error',
                            role: 'AI',
                            content:
                                'Maaf, terjadi kesalahan. Silakan coba lagi.',
                            timestamp: new Date().toISOString()
                        };
                        setMessages((prev) => [...prev, errorMessage]);
                        scrollToBottom();
                    }
                }
            );
        } catch (error) {
            console.error('Chat error:', error);
            setPendingMessage(null);

            const errorMessage: ChatMessage = {
                id: 'error',
                role: 'AI',
                content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                timestamp: new Date().toISOString()
            };
            setMessages((prev) => [...prev, errorMessage]);
            scrollToBottom();
        } finally {
            setIsLoadingResponse(false);
            scrollToBottom();
        }
    };

    const handleRetry = (message: ChatMessage) => {
        handleSendMessage(message.content, message.image || undefined);
    };

    return (
        <div
            className={cn(
                'flex bg-[#101010] overflow-hidden',
                !isMobileBreakpoints &&
                    'fixed top-[64px] bottom-0 left-0 right-0',
                isMobileBreakpoints && '-mx-4',
                'md:mx-0'
            )}>
            <div
                className={cn(
                    'flex-1 flex flex-col h-full w-full relative',
                    !isMobileBreakpoints && 'px-24'
                )}>
                {isMobileBreakpoints && (
                    <div className="fixed top-0 left-0 right-0 z-10 bg-[#101010]">
                        <MobileHeader />
                    </div>
                )}

                {isLoadingHistory ? (
                    <div className="flex-1 flex items-center justify-center">
                        <AiOutlineLoading3Quarters
                            size={24}
                            className="animate-spin text-neutral-400"
                        />
                        <span className="ml-2 text-neutral-400">
                            Loading chat history...
                        </span>
                    </div>
                ) : messages.length > 0 ? (
                    <>
                        <div
                            ref={chatContainerRef}
                            onScroll={handleScroll}
                            className={cn(
                                'flex-1 overflow-y-auto relative',
                                !isMobileBreakpoints &&
                                    'pt-6 px-4 md:px-8 lg:px-16',
                                isMobileBreakpoints && 'px-4 mt-16 pb-16',
                                messages.length <= 2 &&
                                    'flex flex-col justify-end'
                            )}>
                            <ChatSection
                                messages={messages}
                                pendingMessage={pendingMessage}
                                setMessages={setMessages}
                                onRetry={handleRetry}
                                isLoading={isLoadingResponse}
                                currentSessionId={currentSessionId}
                            />
                            <div ref={messagesEndRef} id="dummy-bubble" />
                        </div>
                        <div
                            className={cn(
                                'w-full max-w-3xl mx-auto',
                                isMobileBreakpoints
                                    ? 'fixed bottom-8 left-0 right-0 bg-[#101010] pb-6'
                                    : 'mb-8 px-4 md:px-8 lg:px-16'
                            )}>
                            <PromptBar
                                onSend={handleSendMessage}
                                isLoading={isLoadingResponse}
                                onStateChange={({ isEditorOpen }) =>
                                    setIsEditorOpen(isEditorOpen)
                                }
                            />
                        </div>

                        {showScrollButton && !isEditorOpen && (
                            <button
                                onClick={scrollToBottom}
                                className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-[#5F2BCE] hover:bg-[#4f24a8] text-white p-3 rounded-full shadow-lg transition-all duration-200 z-10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </button>
                        )}
                        <div ref={messagesEndRef} id="dummy-bubble" />
                    </>
                ) : (
                    <MainSection onSendMessage={handleSendMessage} />
                )}

                {!isAuthenticated && <CopilotAuthPrompt />}
            </div>
        </div>
    );
};

export default CopilotContainer;
