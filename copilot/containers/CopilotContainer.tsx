import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import HistorySection from '../components/HistorySection/HistorySection';
import MainSection from '../components/MainSection/MainSection';
import ChatSection from '../components/ChatSection/ChatSection';
import { ChatMessage } from '../types/copilot';
import PromptBar from '../components/MainSection/PromptBar';
import { chatApi } from '../redux/api/copilotApi';

const CopilotContainer = (): JSX.Element => {
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentSessionId, setCurrentSessionId] = useState<
        string | undefined
    >();

    useEffect(() => {
        if (
            router.query.sessionId &&
            typeof router.query.sessionId === 'string'
        ) {
            setCurrentSessionId(router.query.sessionId);
        }
    }, [router.query.sessionId]);

    const handleSendMessage = async (prompt: string) => {
        if (!prompt.trim()) return;

        setIsLoading(true);
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
                        currentResponse += content;
                        setMessages((prev) => {
                            const newMessages = [...prev];
                            const assistantMessageIndex = newMessages.findIndex(
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
                    },
                    onComplete: (messageId, sessionId) => {
                        if (sessionId && currentSessionId) {
                            setCurrentSessionId(sessionId);
                            router.push(`/copilot/${sessionId}`);
                        } else if (sessionId) {
                            // TODO: Redirect to newly created session id
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
            setIsLoading(false);
        }
    };

    const handleRetry = (message: ChatMessage) => {
        handleSendMessage(message.content);
    };

    return (
        <div className="flex h-screen bg-[#101010] overflow-hidden -mx-4 md:px-4">
            <div className="hidden md:block">
                <HistorySection
                    isOpen={showHistory}
                    onClose={() => setShowHistory(false)}
                    onOpen={() => setShowHistory(true)}
                />
            </div>

            <div className="flex-1 flex flex-col h-full">
                {messages.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto relative">
                            <div className="absolute inset-0">
                                <ChatSection
                                    messages={messages}
                                    onRetry={handleRetry}
                                />
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="flex-shrink-0 w-full max-w-3xl mx-auto mb-16 md:mb-8 px-2 md:px-8">
                            <PromptBar
                                onSend={handleSendMessage}
                                isLoading={isLoading}
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
