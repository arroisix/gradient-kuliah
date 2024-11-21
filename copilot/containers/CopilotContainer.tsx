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

const CopilotContainer = (): JSX.Element => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentSessionId, setCurrentSessionId] = useState<
        string | undefined
    >();
    const { isMobileBreakpoints } = useWindowBreakpoints();

    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                const response = await chatApi.getChatHistory();
                if (response.History && response.History.length > 0) {
                    const convertedMessages: ChatMessage[] =
                        response.History.map(
                            (item: {
                                role: 'AI' | 'User';
                                message: string;
                                message_id: string;
                                rating: number;
                                is_bookmarked: boolean;
                                image?: string | null;
                            }) => ({
                                id: item.message_id,
                                role: item.role === 'AI' ? 'assistant' : 'user',
                                content: item.message,
                                timestamp: new Date().toISOString(),
                                rating: item.rating,
                                isBookmarked: item.is_bookmarked,
                                image: item.image
                            })
                        );
                    setMessages(convertedMessages);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        loadChatHistory();
    }, []);

    const handleSendMessage = async (prompt: string) => {
        if (!prompt.trim()) return;

        setIsLoadingResponse(true);
        const timestamp = new Date().toISOString();

        setMessages((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content: prompt,
                timestamp
            }
        ]);

        let currentResponse = '';
        const assistantMessageId = crypto.randomUUID();

        try {
            await chatApi.chatSingle(
                {
                    input_text: prompt,
                    session_id: currentSessionId
                },
                {
                    onContent: (content) => {
                        setTimeout(() => {
                            currentResponse += content;
                            setMessages((prev) => {
                                const newMessages = [...prev];
                                const assistantMessageIndex =
                                    newMessages.findIndex(
                                        (msg) => msg.id === assistantMessageId
                                    );

                                if (assistantMessageIndex !== -1) {
                                    newMessages[assistantMessageIndex] = {
                                        ...newMessages[assistantMessageIndex],
                                        content: currentResponse
                                    };
                                    return newMessages;
                                } else {
                                    return [
                                        ...newMessages,
                                        {
                                            id: assistantMessageId,
                                            role: 'assistant',
                                            content: currentResponse,
                                            timestamp: new Date().toISOString()
                                        }
                                    ];
                                }
                            });
                        }, 50);
                    },
                    onComplete: (messageId, sessionId) => {
                        if (sessionId) {
                            setCurrentSessionId(sessionId);
                        }
                    },
                    onError: (error) => {
                        console.error('Chat error:', error);
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: crypto.randomUUID(),
                                role: 'assistant',
                                content:
                                    'Maaf, terjadi kesalahan. Silakan coba lagi.',
                                timestamp: new Date().toISOString()
                            }
                        ]);
                    }
                }
            );
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                    timestamp: new Date().toISOString()
                }
            ]);
        } finally {
            setIsLoadingResponse(false);
        }
    };

    const handleRetry = (message: ChatMessage) => {
        handleSendMessage(message.content);
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
            {/* TODO: Implement History Section
       {showMobileHistory && (
           <button
               className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
               onClick={() => setShowMobileHistory(false)}>
               <HistorySection
                   isOpen={showMobileHistory}
                   onClose={() => setShowMobileHistory(false)}
                   onOpen={() => setShowMobileHistory(true)}
                   isMobile
               />
           </button>
       )}

       <div className="hidden md:block">
           <HistorySection
               isOpen={showHistory}
               onClose={() => setShowHistory(false)}
               onOpen={() => setShowHistory(true)}
           />
       </div>
       */}

            <div
                className={cn(
                    'flex-1 flex flex-col h-full w-full',
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
                            className={cn(
                                'flex-1 overflow-y-auto',
                                !isMobileBreakpoints && 'pt-6',
                                isMobileBreakpoints && 'mt-16 pb-16'
                            )}>
                            <ChatSection
                                messages={messages}
                                onRetry={handleRetry}
                                isLoading={isLoadingResponse}
                            />
                            <div ref={messagesEndRef} />
                        </div>
                        <div
                            className={cn(
                                'w-full max-w-3xl mx-auto',
                                isMobileBreakpoints
                                    ? 'fixed bottom-8 left-0 right-0 bg-[#101010] pb-6'
                                    : 'mb-8 px-4'
                            )}>
                            <PromptBar
                                onSend={handleSendMessage}
                                isLoading={isLoadingResponse}
                            />
                        </div>
                    </>
                ) : (
                    <MainSection onSendMessage={handleSendMessage} />
                )}
            </div>
        </div>
    );
};

export default CopilotContainer;
