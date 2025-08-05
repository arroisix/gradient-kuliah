import { useState, useRef, useEffect } from 'react';
import MainSection from '../components/MainSection/MainSection';
import ChatSection from '../components/ChatSection/ChatSection';
import { ChatMessage, ContextReference, ChatInput, ChatHistoryContextItem, ReferenceContentType, SelectedReference } from '../types/copilot';
import PromptBar from '../components/MainSection/PromptBar';
import { chatApi } from '../redux/api/copilotApi';
import MobileHeader from '../components/MobileHeader/MobileHeader';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import CopilotAuthPrompt from '../components/AuthPrompt/AuthPrompt';
import HistorySection from 'copilot/components/HistorySection/HistorySection';
import ReferenceModal from 'copilot/components/Reference/ReferenceModal';
import ReferenceContentModal from 'copilot/components/Reference/ReferenceContentModal';

interface CopilotContainerProps {
    sessionId?: string;
}

const CopilotContainer = ({ sessionId }: CopilotContainerProps): JSX.Element => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
    const [isReferenceContentModalOpen, setIsReferenceContentModalOpen] = useState(false);
    const [isUsedReferencesModalOpen, setIsUsedReferencesModalOpen] = useState(false);
    const [selectedReferences, setSelectedReferences] = useState<SelectedReference[]>([]);
    const [viewingUsedReferences, setViewingUsedReferences] = useState<SelectedReference[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
    const [pendingMessage, setPendingMessage] = useState<{
        content: string;
        timestamp: string;
    } | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const promptBarRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (isReferenceModalOpen) {
            const originalBodyOverflow = document.body.style.overflow;
            const originalHtmlOverflow = document.documentElement.style.overflow;
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

    const handleImageCapture = () => {
        fileInputRef.current?.click();
    };

    const convertHistoryContextToSelectedReferences = (historyContext?: { data: ChatHistoryContextItem[] }): SelectedReference[] => {
        if (!historyContext?.data) return [];
        
        return historyContext.data.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            header: item.header,
            contentType: item.content_type === 'course_video' ? 'course' : item.content_type as ReferenceContentType
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
                    const convertedMessages: ChatMessage[] = response.history.map(
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
                            usedReferences: convertHistoryContextToSelectedReferences(item.context)
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

    const buildChatContextFromReferences = (references: SelectedReference[]): ChatInput['context'] => {
        if (references.length === 0) return undefined;

        const context: ChatInput['context'] = {
            textbook_problem: [],
            book_pages: [],
            video: [],
            bank_soal_problem: []
        };

        references.forEach(ref => {
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

        return Object.values(context).some(arr => arr.length > 0) ? context : undefined;
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
            usedReferences: currentUsedReferences.length > 0 ? currentUsedReferences : undefined
        };

        setMessages(prev => [...prev, userMessage]);
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
                        setMessages(prev => {
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
                    setMessages(prev => [...prev, errorMessage]);
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
            setMessages(prev => [...prev, errorMessage]);
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

        setMessages(prev => [...prev, userMessage]);
        scrollToBottom();
        
        let currentResponse = '';
        const chatInput: ChatInput = {
            input_text: message.content,
            session_id: currentSessionId,
            image_url: message.image || undefined,
            context: message.usedReferences ? buildChatContextFromReferences(message.usedReferences) : undefined
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
                        setMessages(prev => {
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
                    setMessages(prev => [...prev, errorMessage]);
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
            setMessages(prev => [...prev, errorMessage]);
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

        setSelectedReferences(prev => {
            const exists = prev.find(ref => 
                ref.id === referenceId && ref.contentType === contentType
            );
            return exists ? prev : [...prev, newReference];
        });
    };

    const handleRemoveReference = (referenceId: string, contentType: ReferenceContentType) => {
        setSelectedReferences(prev => 
            prev.filter(ref => !(ref.id === referenceId && ref.contentType === contentType))
        );
    };

    const handleOpenHistory = () => {
        setIsHistoryOpen(true);
    };

    const handleCloseHistory = () => {
        setIsHistoryOpen(false);
    };

    return (
        <div
            className={cn(
                'flex bg-[#101010] overflow-hidden',
                '-mx-4 md:mx-0',
                'md:fixed md:top-[64px] md:bottom-0 md:left-0 md:right-0'
            )}>
            {isAuthenticated && (
                <HistorySection
                    isOpen={isHistoryOpen}
                    onClose={handleCloseHistory}
                    onOpen={handleOpenHistory}
                    isMobile={isMobileBreakpoints}
                />
            )}
            
            <div
                className={cn(
                    'flex-1 flex flex-col w-full relative md:items-center',
                    'px-4 md:px-24 md:h-full',
                    messages.length === 0 ? 'h-screen md:h-auto' : 'md:h-full'
                )}>
                <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-[#101010]">
                    <MobileHeader onOpenHistory={handleOpenHistory} />
                </div>

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
                                'flex-1 pt-4 w-full max-w-4xl overflow-y-auto relative no-scrollbar',
                                'mt-16 pb-16 min-h-screen',
                                'md:mt-0 md:pt-6 md:min-h-0',
                                messages.length <= 2 && 'flex flex-col justify-end'
                            )}>
                            <ChatSection
                                messages={messages}
                                pendingMessage={pendingMessage}
                                setMessages={setMessages}
                                onRetry={handleRetry}
                                isLoading={isLoadingResponse}
                                currentSessionId={currentSessionId}
                                onOpenUsedReferencesModal={handleOpenUsedReferencesModal}
                            />
                            <div ref={messagesEndRef} id="dummy-bubble" />
                        </div>
                    </>
                ) : (
                    <MainSection
                        onSendMessage={handleSendMessage}
                        onImageCapture={handleImageCapture}
                    />
                )}

                <div
                    className={cn(
                        'w-full max-w-4xl mx-auto',
                        'fixed bottom-8 left-0 right-0 bg-[#101010] pb-6',
                        'md:static md:mb-8 md:pb-0'
                    )}>
                    
                    <PromptBar
                        ref={promptBarRef}
                        fileInputRef={fileInputRef}
                        onSend={handleSendMessage}
                        isLoading={isLoadingResponse}
                        onStateChange={({ isEditorOpen }) => setIsEditorOpen(isEditorOpen)}
                        onOpenReferenceModal={handleOpenReferenceModal}
                        onOpenReferenceContentModal={handleOpenReferenceContentModal}
                        referenceCount={selectedReferences.length}
                    />
                </div>

                {showScrollButton && !isEditorOpen && (
                    <button
                        onClick={scrollToBottom}
                        className={cn(
                            'fixed p-3 bg-[#5F2BCE] hover:bg-[#4f24a8] text-white rounded-full shadow-lg transition-all duration-200 z-10',
                            'bottom-32 left-1/2 -translate-x-1/2',
                            'md:left-[calc(50%+144px)] md:translate-x-[-50%]',
                            !isHistoryOpen && 'md:left-1/2 md:-translate-x-1/2'
                        )}
                        aria-label="Scroll to bottom">
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

                {!isAuthenticated && <CopilotAuthPrompt />}
            </div>
            
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