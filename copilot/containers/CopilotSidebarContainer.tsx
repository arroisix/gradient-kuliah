import { useState, useRef, useEffect } from 'react';
import MainSection from 'copilot/components/revamp/MainSection';
import ChatSection from 'copilot/components/revamp/ChatSection';
import {
    ChatMessage,
    ContextReference,
    ChatInput,
    ChatHistoryContextItem,
    ReferenceContentType,
    SelectedReference,
    CopilotContentRecommendation,
    PerformanceAnalysis,
    CopilotInterrupt,
    CopilotAttachment,
    CopilotReference,
    Reasoning,
    ExerciseQuestion
} from '../types/copilot';
import PromptBar from 'copilot/components/revamp/MainSection/PromptBar';
import { chatApi } from '../redux/api/copilotApi';
import {
    IoClose,
    IoChevronDown,
    IoChevronUp,
    IoArrowBack
} from 'react-icons/io5';
import { MdHistory } from 'react-icons/md';
import { Maximize2 } from 'lucide-react';
import { cn } from 'commons/utils';
import SidebarHistorySection from '../components/HistorySection/SidebarHistorySection';
import { FaArrowDown } from 'react-icons/fa6';
import { LoadingIndicator } from 'copilot/components/LoadingIndicator';
import { toast } from 'react-toastify';
import { FiEdit } from 'react-icons/fi';
import CreditDropdown from 'commons/components/CreditDropdown';

type ContentType =
    | 'course_video'
    | 'textbook_problem'
    | 'bank_soal_problem'
    | 'astronotes_content';

interface CopilotSidebarContainerProps {
    currentContext?: SelectedReference;
    sessionId?: string;
    isCollapsed?: boolean;
    isMobile: boolean;
    selectedReferences: SelectedReference[];
    onCollapsedChange: (collapsed: boolean) => void;
    onClose: () => void;
    onOpenReferenceModal: () => void;
    onOpenReferenceContentModal: () => void;
    onRemoveReference: (
        referenceId: string,
        contentType: ReferenceContentType
    ) => void;
    onOpenUsedReferencesModal?: (references: SelectedReference[]) => void;
    contentType?: ContentType;
    bookSlug?: string;
    chapterId?: string;
    onSessionChange?: (sessionId: string) => void;
}

const CopilotSidebarContainer = ({
    currentContext,
    sessionId,
    isCollapsed = false,
    isMobile,
    selectedReferences,
    onCollapsedChange,
    onClose,
    onOpenReferenceModal,
    onOpenReferenceContentModal,
    onRemoveReference,
    onOpenUsedReferencesModal,
    contentType,
    bookSlug,
    chapterId
}: CopilotSidebarContainerProps): JSX.Element => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<
        string | undefined
    >();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [reasoning, setReasoning] = useState<Reasoning>({
        thoughts: [],
        isFinished: false
    });

    const handleToggleCollapse = () => {
        onCollapsedChange(!isCollapsed);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggleCollapse();
        }
    };

    const handleToggleHistory = () => {
        setIsHistoryOpen((prev) => !prev);
    };

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

    const handleSessionSelect = async (sessionId: string) => {
        if (!sessionId) {
            setMessages([]);
            setCurrentSessionId(undefined);
            setIsHistoryOpen(false);
            return;
        }

        try {
            setIsLoadingHistory(true);
            setCurrentSessionId(sessionId);

            const response = await chatApi.getChatHistory(sessionId);
            if (response.history?.length > 0) {
                const convertedMessages: ChatMessage[] = response.history.map(
                    (item) => ({
                        id: item.message_id,
                        role: item.role === 'AI' ? 'AI' : 'User',
                        content: item.message,
                        timestamp: new Date().toISOString(),
                        rating: item.rating,
                        isBookmarked: item.is_bookmarked,
                        images: item.images,
                        usedReferences:
                            convertHistoryContextToSelectedReferences(
                                item.context
                            ),
                        rich_content: item.rich_content,
                        interrupt: item.interrupt
                    })
                );
                setMessages(convertedMessages);
                setCurrentSessionId(sessionId);
            } else {
                setMessages([]);
            }
        } catch (error) {
        } finally {
            setIsHistoryOpen(false);
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        const loadChatHistory = async () => {
            if (!sessionId) {
                setMessages([]);
                setIsLoadingHistory(false);
                return;
            }

            try {
                const response = await chatApi.getChatHistory(sessionId);
                if (response.history?.length > 0) {
                    const convertedMessages: ChatMessage[] =
                        response.history.map((item) => ({
                            id: item.message_id,
                            role: item.role === 'AI' ? 'AI' : 'User',
                            content: item.message,
                            timestamp: new Date().toISOString(),
                            rating: item.rating,
                            isBookmarked: item.is_bookmarked,
                            images: item.images,
                            usedReferences:
                                convertHistoryContextToSelectedReferences(
                                    item.context
                                ),
                            rich_content: item.rich_content,
                            interrupt: item.interrupt
                        }));
                    setMessages(convertedMessages);
                    setCurrentSessionId(sessionId);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        loadChatHistory();
    }, [sessionId]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [reasoning]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const isNearBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
        });
    };

    const handleNewChat = () => {
        setCurrentSessionId(undefined);
        setMessages([]);
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
        const images = [];
        if (imageUrl) {
            images.push(imageUrl);
        }

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'User',
            content: prompt,
            timestamp,
            images,
            usedReferences:
                currentUsedReferences.length > 0
                    ? currentUsedReferences
                    : undefined
        };

        setMessages((prev) => [...prev, userMessage]);
        handleClearReferences();

        let currentResponse = '';
        const chatInput: ChatInput = {
            input_text: prompt,
            session_id: currentSessionId,
            image_url: imageUrl,
            context: buildChatContextFromReferences(currentUsedReferences),
            book_slug: bookSlug,
            chapter_id: chapterId
        };

        let content_recommendations: CopilotContentRecommendation[] = [];
        let performance_analysis: PerformanceAnalysis;
        let exercise_questions: ExerciseQuestion[] = [];
        let interrupt: CopilotInterrupt;
        let attachments: CopilotAttachment[] = [];
        let question_recommendation: string[] = [];
        let references: CopilotReference[] = [];

        try {
            await chatApi.chat(chatInput, {
                onContent: (content, rich_content) => {
                    if (content) {
                        currentResponse = content;
                    }

                    if (
                        Array.isArray(rich_content?.content_recommendations) &&
                        rich_content.content_recommendations.length > 0
                    ) {
                        content_recommendations =
                            rich_content.content_recommendations;
                    }

                    if (rich_content?.performance_analysis) {
                        performance_analysis =
                            rich_content.performance_analysis;
                    }

                    if (
                        Array.isArray(rich_content?.exercise_questions) &&
                        rich_content.exercise_questions.length > 0
                    ) {
                        exercise_questions = rich_content.exercise_questions;
                    }

                    if (
                        Array.isArray(rich_content?.attachments) &&
                        rich_content.attachments.length > 0
                    ) {
                        attachments = rich_content.attachments;
                    }

                    if (
                        Array.isArray(rich_content?.question_recommendation) &&
                        rich_content.question_recommendation.length > 0
                    ) {
                        question_recommendation =
                            rich_content.question_recommendation;
                    }

                    if (
                        Array.isArray(rich_content?.references) &&
                        rich_content.references.length > 0
                    ) {
                        references = rich_content.references;
                    }
                },
                onInfo: (interruptResponse, thought) => {
                    if (interruptResponse) {
                        currentResponse = interruptResponse.message;
                        interrupt = interruptResponse;
                    }

                    if (thought) {
                        setReasoning((v) => ({
                            ...v,
                            thoughts: [...v.thoughts, thought]
                        }));
                    }
                },
                onComplete: (messageId, sessionId) => {
                    setReasoning((v) => ({ ...v, isFinished: true }));
                    if (sessionId) {
                        setCurrentSessionId(sessionId);
                    }
                    if (messageId) {
                        // use timeout to show the finished state of the reasoning
                        setTimeout(() => {
                            setReasoning({ thoughts: [], isFinished: false });
                            setIsLoadingResponse(false);
                            setMessages((prev) => {
                                const aiMessage: ChatMessage = {
                                    id: messageId,
                                    role: 'AI',
                                    content: currentResponse,
                                    timestamp: new Date().toISOString(),
                                    interrupt,
                                    rich_content: {
                                        content_recommendations,
                                        performance_analysis,
                                        exercise_questions,
                                        attachments,
                                        question_recommendation,
                                        references
                                    }
                                };
                                return [...prev, aiMessage];
                            });
                        }, 1000);
                    }
                },
                onError: (error) => {
                    setReasoning({ thoughts: [], isFinished: false });
                    setIsLoadingResponse(false);
                    toast.error(`${error}.`, {
                        position: 'top-center',
                        theme: 'colored',
                        hideProgressBar: true
                    });
                    const errorMessage: ChatMessage = {
                        id: 'error',
                        role: 'AI',
                        content: `${error}.`,
                        timestamp: new Date().toISOString()
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                }
            });
        } catch (error) {
            setReasoning({ thoughts: [], isFinished: false });
            setIsLoadingResponse(false);
            console.error('Chat error:', error);
            const errorMessage: ChatMessage = {
                id: 'error',
                role: 'AI',
                content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                timestamp: new Date().toISOString()
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const handleRetry = async (message: ChatMessage) => {
        const timestamp = new Date().toISOString();
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'User',
            content: message.content,
            timestamp,
            images: message.images,
            usedReferences: message.usedReferences
        };

        const imageUrl =
            Array.isArray(message.images) && message.images.length > 0
                ? message.images[0]
                : undefined;

        setMessages((prev) => [...prev, userMessage]);
        let currentResponse = '';
        const chatInput: ChatInput = {
            input_text: message.content,
            session_id: currentSessionId,
            image_url: imageUrl,
            context: message.usedReferences
                ? buildChatContextFromReferences(message.usedReferences)
                : undefined,
            book_slug: bookSlug,
            chapter_id: chapterId
        };

        setIsLoadingResponse(true);
        let content_recommendations: CopilotContentRecommendation[] = [];
        let performance_analysis: PerformanceAnalysis;
        let exercise_questions: ExerciseQuestion[] = [];
        let interrupt: CopilotInterrupt;
        let attachments: CopilotAttachment[] = [];
        let question_recommendation: string[] = [];
        let references: CopilotReference[] = [];

        try {
            await chatApi.chat(chatInput, {
                onContent: (content, rich_content) => {
                    if (content) {
                        currentResponse = content;
                    }

                    if (
                        Array.isArray(rich_content?.content_recommendations) &&
                        rich_content.content_recommendations.length > 0
                    ) {
                        content_recommendations =
                            rich_content.content_recommendations;
                    }

                    if (rich_content?.performance_analysis) {
                        performance_analysis =
                            rich_content.performance_analysis;
                    }

                    if (
                        Array.isArray(rich_content?.exercise_questions) &&
                        rich_content.exercise_questions.length > 0
                    ) {
                        exercise_questions = rich_content.exercise_questions;
                    }

                    if (
                        Array.isArray(rich_content?.attachments) &&
                        rich_content.attachments.length > 0
                    ) {
                        attachments = rich_content.attachments;
                    }

                    if (
                        Array.isArray(rich_content?.question_recommendation) &&
                        rich_content.question_recommendation.length > 0
                    ) {
                        question_recommendation =
                            rich_content.question_recommendation;
                    }

                    if (
                        Array.isArray(rich_content?.references) &&
                        rich_content.references.length > 0
                    ) {
                        references = rich_content.references;
                    }
                },
                onInfo: (interruptResponse, thought) => {
                    if (interruptResponse) {
                        currentResponse = interruptResponse.message;
                        interrupt = interruptResponse;
                    }

                    if (thought) {
                        setReasoning((v) => ({
                            ...v,
                            thoughts: [...v.thoughts, thought]
                        }));
                    }
                },
                onComplete: (messageId, sessionId) => {
                    setReasoning((v) => ({ ...v, isFinished: true }));
                    if (sessionId) {
                        setCurrentSessionId(sessionId);
                    }
                    if (messageId) {
                        // use timeout to show the finished state of the reasoning
                        setTimeout(() => {
                            setReasoning({ thoughts: [], isFinished: false });
                            setIsLoadingResponse(false);
                            setMessages((prev) => {
                                const aiMessage: ChatMessage = {
                                    id: messageId,
                                    role: 'AI',
                                    content: currentResponse,
                                    timestamp: new Date().toISOString(),
                                    interrupt,
                                    rich_content: {
                                        content_recommendations,
                                        performance_analysis,
                                        exercise_questions,
                                        attachments,
                                        question_recommendation,
                                        references
                                    }
                                };
                                return [...prev, aiMessage];
                            });
                        }, 1000);
                    }
                },
                onError: (error) => {
                    setReasoning({ thoughts: [], isFinished: false });
                    setIsLoadingResponse(false);
                    console.error('Chat error:', error);
                    const errorMessage: ChatMessage = {
                        id: 'error',
                        role: 'AI',
                        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                        timestamp: new Date().toISOString()
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                }
            });
        } catch (error) {
            setReasoning({ thoughts: [], isFinished: false });
            setIsLoadingResponse(false);
            console.error('Chat error:', error);
            const errorMessage: ChatMessage = {
                id: 'error',
                role: 'AI',
                content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                timestamp: new Date().toISOString()
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const handleClearReferences = () => {
        for (const ref of selectedReferences) {
            if (ref.id === currentContext?.id) {
                continue;
            }
            onRemoveReference(ref.id, ref.contentType);
        }
    };

    const isMobileFullscreen = isMobile && isCollapsed;

    return (
        <>
            <div className="h-full bg-black flex flex-col overflow-hidden">
                <div
                    className={cn(
                        'flex items-center justify-between py-4 px-5 border-b border-gray-700 flex-shrink-0 transition-colors duration-300',
                        isMobileFullscreen ? 'rounded-none' : 'rounded-t-lg',
                        isCollapsed && !isMobileFullscreen
                            ? 'bg-[#5F2BCE]'
                            : 'bg-[#20222E]'
                    )}>
                    <button
                        onClick={isHistoryOpen ? handleToggleHistory : onClose}
                        className="p-1 text-gray-400 hover:text-white transition-colors z-10"
                        aria-label={
                            isHistoryOpen ? 'Back to chat' : 'Close copilot'
                        }>
                        {isHistoryOpen ? (
                            <IoArrowBack size={24} />
                        ) : (
                            <IoClose size={24} />
                        )}
                    </button>

                    <button
                        onClick={handleNewChat}
                        className="p-1 text-gray-400 hover:text-white transition-colors z-10">
                        <FiEdit size={20} />
                    </button>

                    {isCollapsed ? (
                        <div
                            onClick={handleToggleCollapse}
                            onKeyDown={handleKeyDown}
                            role="button"
                            tabIndex={0}
                            className="flex items-center cursor-pointer flex-1 justify-center hover:opacity-80 transition-opacity h-full py-4 -my-4"
                            aria-label={isCollapsed ? 'Expand' : 'Collapse'}>
                            <h3 className="text-white font-extrabold text-base xl:text-lg">
                                Copilot AI
                            </h3>
                        </div>
                    ) : (
                        <div className="flex-1 flex justify-center items-center">
                            <CreditDropdown />
                        </div>
                    )}

                    <button
                        onClick={handleToggleHistory}
                        className={`p-1 transition-colors ${
                            isHistoryOpen
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                        aria-label="Open chat history">
                        <MdHistory size={24} />
                    </button>

                    <div
                        onClick={handleToggleCollapse}
                        onKeyDown={handleKeyDown}
                        role="button"
                        tabIndex={0}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity h-full py-4 -my-4"
                        aria-label={isCollapsed ? 'Expand' : 'Collapse'}>
                        <button
                            onClick={handleToggleCollapse}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            aria-label={isCollapsed ? 'Expand' : 'Collapse'}>
                            {isMobile ? (
                                <Maximize2 size={24} />
                            ) : isCollapsed ? (
                                <IoChevronUp size={24} />
                            ) : (
                                <IoChevronDown size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {isHistoryOpen ? (
                    <SidebarHistorySection
                        isOpen={isHistoryOpen}
                        onClose={handleToggleHistory}
                        bookSlug={bookSlug}
                        chapterId={chapterId}
                        onSessionSelect={handleSessionSelect}
                        currentSessionId={currentSessionId}
                    />
                ) : (
                    <>
                        <div
                            onScroll={handleScroll}
                            className={cn(
                                'flex-grow overflow-scroll scrollbar-none px-4 pt-4',
                                isLoadingHistory
                                    ? 'grid place-items-center'
                                    : '',
                                messages.length > 0 ? '' : 'pb-4'
                            )}>
                            {isLoadingHistory ? (
                                <LoadingIndicator />
                            ) : messages.length > 0 ? (
                                <div className="space-y-4">
                                    <ChatSection
                                        isForModal
                                        reasoning={reasoning}
                                        messages={messages}
                                        setMessages={setMessages}
                                        onRetry={handleRetry}
                                        isLoading={isLoadingResponse}
                                        currentSessionId={currentSessionId}
                                        isLoadingResponse={isLoadingResponse}
                                        sendMessage={handleSendMessage}
                                        onOpenUsedReferencesModal={
                                            onOpenUsedReferencesModal
                                        }
                                    />
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : (
                                <MainSection
                                    isForModal
                                    contentType={contentType}
                                    onSendMessage={handleSendMessage}
                                />
                            )}
                        </div>

                        <div className="relative">
                            {showScrollButton && !isEditorOpen ? (
                                <button
                                    type="button"
                                    onClick={scrollToBottom}
                                    className="bg-[#5F2BCE] hover:opacity-80 transition-all w-8 h-8 grid place-items-center rounded-full absolute -top-4 left-1/2 -translate-x-1/2">
                                    <FaArrowDown className="text-white w-4 h-4" />
                                    <span className="sr-only">
                                        scroll to bottom
                                    </span>
                                </button>
                            ) : (
                                <></>
                            )}

                            <PromptBar
                                isForModal
                                onSend={handleSendMessage}
                                isLoading={isLoadingResponse}
                                onStateChange={({ isEditorOpen }) =>
                                    setIsEditorOpen(isEditorOpen)
                                }
                                onOpenReferenceModal={onOpenReferenceModal}
                                onOpenReferenceContentModal={
                                    onOpenReferenceContentModal
                                }
                                referenceCount={selectedReferences.length}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CopilotSidebarContainer;
