import { useState, useRef, useEffect } from 'react';
import MainSection from 'copilot/components/revamp/MainSection';
import ChatSection from 'copilot/components/revamp/ChatSection';
import {
    ChatMessage,
    ContextReference,
    ChatInput,
    ChatHistoryContextItem,
    ReferenceContentType,
    SelectedReference
} from 'copilot/types/copilot';
import PromptBar from 'copilot/components/revamp/MainSection/PromptBar';
import { chatApi } from 'copilot/redux/api/copilotApi';
import MobileHeader from 'copilot/components/revamp/MobileHeader';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import HistorySection from 'copilot/components/revamp/HistorySection';
import ReferenceModal from 'copilot/components/revamp/Reference/ReferenceModal';
import ReferenceContentModal from 'copilot/components/revamp/Reference/ReferenceContentModal';
import { LoadingIndicator } from 'copilot/components/LoadingIndicator';

interface CopilotContainerProps {
    sessionId?: string;
}

const CopilotContainer = ({
    sessionId
}: CopilotContainerProps): JSX.Element => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
    const [isReferenceContentModalOpen, setIsReferenceContentModalOpen] =
        useState(false);
    const [isUsedReferencesModalOpen, setIsUsedReferencesModalOpen] =
        useState(false);
    const [selectedReferences, setSelectedReferences] = useState<
        SelectedReference[]
    >([]);
    const [viewingUsedReferences, setViewingUsedReferences] = useState<
        SelectedReference[]
    >([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<
        string | undefined
    >();
    const [pendingMessage, setPendingMessage] = useState<{
        content: string;
        timestamp: string;
    } | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    console.log(showScrollButton, pendingMessage, isEditorOpen);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const promptBarRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (isReferenceModalOpen) {
            const originalBodyOverflow = document.body.style.overflow;
            const originalHtmlOverflow =
                document.documentElement.style.overflow;
            const scrollY = window.scrollY;

            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';

            return () => {
                document.body.style.overflow = originalBodyOverflow;
                document.documentElement.style.overflow = originalHtmlOverflow;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
        return undefined;
    }, [isReferenceModalOpen]);

    const convertHistoryContextToSelectedReferences = (historyContext?: {
        data: ChatHistoryContextItem[];
    }): SelectedReference[] => {
        if (!historyContext?.data) return [];

        return historyContext.data.map((item) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            header: item.header,
            contentType:
                item.content_type === 'course_video'
                    ? 'course'
                    : (item.content_type as ReferenceContentType)
        }));
    };

    useEffect(() => {
        const loadChatHistory = async () => {
            if (!sessionId) {
                setIsLoadingHistory(false);
                return;
            }

            try {
                const response = await chatApi.getChatHistory(sessionId);
                if (response.history?.length > 0) {
                    const convertedMessages: ChatMessage[] =
                        response.history.map(
                            (item: {
                                role: 'AI' | 'User';
                                message: string;
                                message_id: string;
                                rating: number;
                                is_bookmarked: boolean;
                                image?: string | null;
                                keyword?: string | null;
                                context?: {
                                    data: ChatHistoryContextItem[];
                                };
                            }) => ({
                                id: item.message_id,
                                role: item.role === 'AI' ? 'AI' : 'User',
                                content: item.message,
                                timestamp: new Date().toISOString(),
                                rating: item.rating,
                                isBookmarked: item.is_bookmarked,
                                image: item.image,
                                keyword: item.keyword,
                                usedReferences:
                                    convertHistoryContextToSelectedReferences(
                                        item.context
                                    )
                            })
                        );
                    setMessages(convertedMessages);
                    setCurrentSessionId(sessionId);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setIsLoadingHistory(false);
                scrollToBottom();
            }
        };

        loadChatHistory();
    }, [sessionId]);

    useEffect(() => {
        if (messages.length > 0) {
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
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const buildChatContextFromReferences = (
        references: SelectedReference[]
    ): ChatInput['context'] => {
        if (references.length === 0) return undefined;

        const context: ChatInput['context'] = {
            textbook_problem: [],
            book_pages: [],
            video: [],
            bank_soal_problem: []
        };

        references.forEach((ref) => {
            const contextReference: ContextReference = {
                id: ref.id,
                title: ref.title,
                subtitle: ref.subtitle || '',
                header: ref.header
            };

            switch (ref.contentType) {
                case 'textbook_problem':
                    context.textbook_problem.push(contextReference);
                    break;
                case 'course':
                    context.video.push(contextReference);
                    break;
                case 'astronotes_content':
                    context.book_pages.push(contextReference);
                    break;
                case 'bank_soal_problem':
                    context.bank_soal_problem.push(contextReference);
                    break;
            }
        });

        return Object.values(context).some((arr) => arr.length > 0)
            ? context
            : undefined;
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

        const currentUsedReferences = [...selectedReferences];

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'User',
            content: prompt,
            timestamp,
            image: imageUrl || null,
            usedReferences:
                currentUsedReferences.length > 0
                    ? currentUsedReferences
                    : undefined
        };

        setMessages((prev) => [...prev, userMessage]);
        handleClearReferences();
        scrollToBottom();

        let currentResponse = '';
        const chatInput: ChatInput = {
            input_text: prompt,
            session_id: currentSessionId,
            image_url: imageUrl,
            context: buildChatContextFromReferences(currentUsedReferences)
        };

        try {
            await chatApi.chat(chatInput, {
                onContent: (content) => {
                    currentResponse += content;
                    setPendingMessage({
                        content: currentResponse,
                        timestamp: new Date().toISOString()
                    });
                    scrollToBottom();
                },
                onComplete: (messageId, sessionId, sessionName, keyword) => {
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
                                timestamp: new Date().toISOString(),
                                keyword: keyword
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
                        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                        timestamp: new Date().toISOString()
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                    scrollToBottom();
                }
            });
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
        const timestamp = new Date().toISOString();
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'User',
            content: message.content,
            timestamp,
            image: message.image,
            usedReferences: message.usedReferences
        };

        setMessages((prev) => [...prev, userMessage]);
        scrollToBottom();

        let currentResponse = '';
        const chatInput: ChatInput = {
            input_text: message.content,
            session_id: currentSessionId,
            image_url: message.image || undefined,
            context: message.usedReferences
                ? buildChatContextFromReferences(message.usedReferences)
                : undefined
        };

        setIsLoadingResponse(true);

        try {
            chatApi.chat(chatInput, {
                onContent: (content) => {
                    currentResponse += content;
                    setPendingMessage({
                        content: currentResponse,
                        timestamp: new Date().toISOString()
                    });
                    scrollToBottom();
                },
                onComplete: (messageId, sessionId, sessionName, keyword) => {
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
                                timestamp: new Date().toISOString(),
                                keyword: keyword
                            };
                            return [...prev, aiMessage];
                        });
                    }
                    setIsLoadingResponse(false);
                },
                onError: (error) => {
                    console.error('Chat error:', error);
                    setPendingMessage(null);

                    const errorMessage: ChatMessage = {
                        id: 'error',
                        role: 'AI',
                        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                        timestamp: new Date().toISOString()
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                    setIsLoadingResponse(false);
                }
            });
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
            setIsLoadingResponse(false);
        }
    };

    const handleClearReferences = () => {
        setSelectedReferences([]);
    };

    const handleOpenReferenceModal = () => {
        setIsReferenceModalOpen(true);
    };

    const handleCloseReferenceModal = () => {
        setIsReferenceModalOpen(false);
    };

    const handleOpenReferenceContentModal = () => {
        setIsReferenceContentModalOpen(true);
    };

    const handleCloseReferenceContentModal = () => {
        setIsReferenceContentModalOpen(false);
    };

    const handleOpenUsedReferencesModal = (references: SelectedReference[]) => {
        setViewingUsedReferences(references);
        setIsUsedReferencesModalOpen(true);
    };

    const handleCloseUsedReferencesModal = () => {
        setIsUsedReferencesModalOpen(false);
        setViewingUsedReferences([]);
    };

    const handleReferenceSelect = (
        referenceId: string,
        referenceTitle: string,
        referenceSubtitle: string,
        referenceHeader: string,
        contentType: ReferenceContentType
    ) => {
        const newReference: SelectedReference = {
            id: referenceId,
            title: referenceTitle,
            subtitle: referenceSubtitle,
            header: referenceHeader,
            contentType
        };

        setSelectedReferences((prev) => {
            const exists = prev.find(
                (ref) =>
                    ref.id === referenceId && ref.contentType === contentType
            );
            return exists ? prev : [...prev, newReference];
        });
    };

    const handleRemoveReference = (
        referenceId: string,
        contentType: ReferenceContentType
    ) => {
        setSelectedReferences((prev) =>
            prev.filter(
                (ref) =>
                    !(ref.id === referenceId && ref.contentType === contentType)
            )
        );
    };

    const handleOpenHistory = () => {
        setIsHistoryOpen(true);
    };

    const handleCloseHistory = () => {
        setIsHistoryOpen(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            <MobileHeader onOpenHistory={handleOpenHistory} />
            {isAuthenticated && (
                <HistorySection
                    isOpen={isHistoryOpen}
                    onClose={handleCloseHistory}
                    onOpen={handleOpenHistory}
                    isMobile={isMobileBreakpoints}
                />
            )}

            <div
                className={`${
                    isLoadingHistory ? 'grid place-items-center' : ''
                } flex-grow overflow-scroll no-scrollbar p-4`}>
                {isLoadingHistory ? (
                    <LoadingIndicator />
                ) : messages.length > 0 ? (
                    <div
                        ref={chatContainerRef}
                        onScroll={handleScroll}
                        className="space-y-4">
                        <ChatSection
                            messages={messages}
                            setMessages={setMessages}
                            onRetry={handleRetry}
                            isLoading={isLoadingResponse}
                            currentSessionId={currentSessionId}
                            onOpenUsedReferencesModal={
                                handleOpenUsedReferencesModal
                            }
                        />
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <MainSection onSendMessage={handleSendMessage} />
                )}
            </div>

            <PromptBar
                ref={promptBarRef}
                fileInputRef={fileInputRef}
                onSend={handleSendMessage}
                isLoading={isLoadingResponse}
                onStateChange={({ isEditorOpen }) =>
                    setIsEditorOpen(isEditorOpen)
                }
                onOpenReferenceModal={handleOpenReferenceModal}
                onOpenReferenceContentModal={handleOpenReferenceContentModal}
                referenceCount={selectedReferences.length}
            />

            <ReferenceModal
                isOpen={isReferenceModalOpen}
                onClose={handleCloseReferenceModal}
                onReferenceSelect={handleReferenceSelect}
            />

            <ReferenceContentModal
                isOpen={isReferenceContentModalOpen}
                onClose={handleCloseReferenceContentModal}
                selectedReferences={selectedReferences}
                onRemoveReference={handleRemoveReference}
                onOpenReferenceModal={() => {
                    setIsReferenceContentModalOpen(false);
                    setIsReferenceModalOpen(true);
                }}
                isViewOnly={false}
            />

            <ReferenceContentModal
                isOpen={isUsedReferencesModalOpen}
                onClose={handleCloseUsedReferencesModal}
                selectedReferences={viewingUsedReferences}
                isViewOnly={true}
            />
        </div>
    );
};

export default CopilotContainer;
