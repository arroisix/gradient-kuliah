import { useState, useRef, useEffect } from 'react';
import MainSection from '../components/MainSection/MainSection';
import ChatSection from '../components/ChatSection/ChatSection';
import { ChatMessage, ChatInput, ReferenceContentType, SelectedReference } from '../types/copilot';
import PromptBar from '../components/MainSection/PromptBar';
import { chatApi } from '../redux/api/copilotApi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { Maximize2 } from 'lucide-react';
import { cn } from 'commons/utils';

interface CopilotSidebarContainerProps {
    sessionId?: string;
    isCollapsed?: boolean;
    isMobile: boolean;
    selectedReferences: SelectedReference[];
    onCollapsedChange: (collapsed: boolean) => void;
    onClose: () => void;
    onOpenReferenceModal: () => void;
    onOpenReferenceContentModal: () => void;
    onRemoveReference: (referenceId: string, contentType: ReferenceContentType) => void;
    onOpenUsedReferencesModal?: (references: SelectedReference[]) => void;
}

const CopilotSidebarContainer = ({
    sessionId,
    isCollapsed = false,
    isMobile,
    selectedReferences,
    onCollapsedChange,
    onClose,
    onOpenReferenceModal,
    onOpenReferenceContentModal,
    onRemoveReference,
    onOpenUsedReferencesModal
}: CopilotSidebarContainerProps): JSX.Element => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
    const [pendingMessage, setPendingMessage] = useState<{
        content: string;
        timestamp: string;
    } | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const promptBarRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageCapture = () => {
        fileInputRef.current?.click();
    };

    const handleToggleCollapse = () => {
        onCollapsedChange(!isCollapsed);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggleCollapse();
        }
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
                        }) => ({
                            id: item.message_id,
                            role: item.role === 'AI' ? 'AI' : 'User',
                            content: item.message,
                            timestamp: new Date().toISOString(),
                            rating: item.rating,
                            isBookmarked: item.is_bookmarked,
                            image: item.image,
                            keyword: item.keyword
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
        const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    const scrollToBottom = () => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    };

    const buildChatContextFromReferences = (references: SelectedReference[]): ChatInput['context'] | undefined => {
        if (references.length === 0) return undefined;

        const context: ChatInput['context'] = {
            textbook_problem: [],
            book_pages: [],
            video: [],
            bank_soal_problem: []
        };

        references.forEach(ref => {
            switch (ref.contentType) {
                case 'textbook_problem':
                    context.textbook_problem.push(ref.id);
                    break;
                case 'course':
                    context.video.push(ref.id);
                    break;
                case 'astronotes_content':
                    context.book_pages.push(ref.id);
                    break;
                case 'bank_soal_problem':
                    context.bank_soal_problem.push(ref.id);
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
    };

    const handleClearReferences = () => {
        selectedReferences.forEach(ref => {
            onRemoveReference(ref.id, ref.contentType);
        });
    };

    const isMobileFullscreen = isMobile && isCollapsed;

    return (
        <>
            <div className="flex flex-col h-full bg-[#181818] overflow-hidden rounded-t-lg">
                <div className={cn(
                    "flex items-center justify-between py-4 px-5 border-b border-gray-700 flex-shrink-0 transition-colors duration-300",
                    isMobileFullscreen ? "rounded-none" : "rounded-t-lg",
                    isCollapsed && !isMobileFullscreen ? "bg-[#5F2BCE]" : "bg-[#2C2C2C]"
                )}>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-white transition-colors z-10"
                        aria-label="Close copilot">
                        <IoClose size={32} />
                    </button>

                    <div 
                        onClick={handleToggleCollapse}
                        onKeyDown={handleKeyDown}
                        role="button"
                        tabIndex={0}
                        className="flex items-center cursor-pointer flex-1 justify-center hover:opacity-80 transition-opacity h-full py-4 -my-4"
                        aria-label={isCollapsed ? "Expand" : "Collapse"}>
                        <h3 className="text-white font-extrabold text-base xl:text-lg">
                            Copilot AI
                        </h3>
                    </div>

                    <div 
                        onClick={handleToggleCollapse}
                        onKeyDown={handleKeyDown}
                        role="button"
                        tabIndex={0}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity h-full py-4 -my-4"
                        aria-label={isCollapsed ? "Expand" : "Collapse"}>
                        
                        <button
                            onClick={handleToggleCollapse}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            aria-label={isCollapsed ? "Expand" : "Collapse"}>
                            {isMobile ? (
                                <Maximize2 size={24} />
                            ) : (
                                isCollapsed ? <IoChevronUp size={32} /> : <IoChevronDown size={32} />
                            )}
                        </button>
                    </div>
                </div>

                <div
                    className={cn(
                        "flex-1 overflow-hidden transition-all duration-300 ease-in-out",
                        (isCollapsed && !isMobile) ? "h-0 opacity-0" : "flex opacity-100"
                    )}>
                    <div className="flex flex-col w-full h-full">
                        {isLoadingHistory ? (
                            <div className="flex-1 flex items-center justify-center">
                                <AiOutlineLoading3Quarters 
                                    size={24} 
                                    className="animate-spin text-neutral-400" 
                                />
                                <span className="ml-2 text-neutral-400">Loading...</span>
                            </div>
                        ) : messages.length > 0 ? (
                            <div
                                ref={chatContainerRef}
                                onScroll={handleScroll}
                                className="flex-1 overflow-y-auto p-4 min-h-0 pb-2 sm:pb-4">
                                <ChatSection
                                    messages={messages}
                                    pendingMessage={pendingMessage}
                                    setMessages={setMessages}
                                    onRetry={handleRetry}
                                    isLoading={isLoadingResponse}
                                    currentSessionId={currentSessionId}
                                    isSidebar={true}
                                    onOpenUsedReferencesModal={onOpenUsedReferencesModal}
                                />
                                <div ref={messagesEndRef} />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden pt-8">
                                <MainSection
                                    className={cn(
                                        "bg-[#181818] flex-none w-full max-w-md mx-auto px-4 py-0",
                                        "[&>div]:mt-0 [&>div]:mb-0 [&>div]:overflow-hidden"
                                    )}
                                    showTitle={false}
                                    showActionButtons={false}
                                    onSendMessage={handleSendMessage}
                                    onImageCapture={handleImageCapture}
                                />
                            </div>
                        )}

                        <div className="border-t border-gray-700 flex-shrink-0 bg-[#181818]">
                            <PromptBar
                                ref={promptBarRef}
                                fileInputRef={fileInputRef}
                                placeholder="Lagi butuh bantuan apa sobat?"
                                onSend={handleSendMessage}
                                isLoading={isLoadingResponse}
                                onStateChange={({ isEditorOpen }) => setIsEditorOpen(isEditorOpen)}
                                showBorder={false}
                                isSidebar={true}
                                onOpenReferenceModal={onOpenReferenceModal}
                                onOpenReferenceContentModal={onOpenReferenceContentModal}
                                referenceCount={selectedReferences.length}
                            />
                        </div>

                        {showScrollButton && !isEditorOpen && (
                            <button
                                onClick={scrollToBottom}
                                className={cn(
                                    "absolute bg-[#5F2BCE] hover:bg-[#4f24a8] text-white rounded-full shadow-lg transition-all duration-200",
                                    "p-2 sm:p-3 bottom-36 left-1/2 transform -translate-x-1/2"
                                )}
                                aria-label="Scroll to bottom">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4" 
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default CopilotSidebarContainer;