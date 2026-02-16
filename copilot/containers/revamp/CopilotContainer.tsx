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
    Reasoning,
    PerformanceAnalysis,
    ExerciseQuestion,
    CopilotContentRecommendation,
    CopilotInterrupt,
    CopilotAttachment
} from 'copilot/types/copilot';
import PromptBar from 'copilot/components/revamp/MainSection/PromptBar';
import { chatApi } from 'copilot/redux/api/copilotApi';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import ReferenceModal from 'copilot/components/revamp/Reference/ReferenceModal';
import ReferenceContentModal from 'copilot/components/revamp/Reference/ReferenceContentModal';
import { LoadingIndicator } from 'copilot/components/LoadingIndicator';
import { cn } from 'commons/utils';
import { FaArrowDown } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import CopilotAuthPrompt from 'copilot/components/revamp/AuthPrompt';
import { useRouter } from 'next/router';

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
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [reasoning, setReasoning] = useState<Reasoning>({
        thoughts: [],
        isFinished: false
    });

    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);
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
            if (sessionId && isLoadingResponse) {
                return;
            }

            if (!sessionId) {
                setMessages([]);
                setCurrentSessionId(undefined);
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
            context: buildChatContextFromReferences(currentUsedReferences)
        };

        let content_recommendations: CopilotContentRecommendation[] = [];
        let performance_analysis: PerformanceAnalysis;
        let exercise_questions: ExerciseQuestion[] = [];
        let interrupt: CopilotInterrupt;
        let attachments: CopilotAttachment[] = [];
        let question_recommendation: string[] = [];

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
                        router.push(`/copilot/${sessionId}`, undefined, {
                            shallow: true
                        });
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
                                        question_recommendation
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
                : undefined
        };

        setIsLoadingResponse(true);
        let content_recommendations: CopilotContentRecommendation[] = [];
        let performance_analysis: PerformanceAnalysis;
        let exercise_questions: ExerciseQuestion[] = [];
        let interrupt: CopilotInterrupt;
        let attachments: CopilotAttachment[] = [];
        let question_recommendation: string[] = [];

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
                        router.push(`/copilot/${sessionId}`, undefined, {
                            shallow: true
                        });
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
                                        question_recommendation
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

    return (
        <>
            <div
                className={cn(
                    'h-full flex flex-col overflow-hidden',
                    'md:px-4'
                )}>
                <div
                    onScroll={handleScroll}
                    className={cn(
                        'flex-grow overflow-scroll scrollbar-none px-4 pt-4',
                        'md:px-0',
                        isLoadingHistory ? 'grid place-items-center' : '',
                        messages.length > 0 ? '' : 'pb-4'
                    )}>
                    {isLoadingHistory ? (
                        <LoadingIndicator />
                    ) : messages.length > 0 ? (
                        <div
                            className={cn(
                                'space-y-4',
                                'md:w-full md:max-w-[720px] md:mx-auto'
                            )}>
                            <ChatSection
                                reasoning={reasoning}
                                messages={messages}
                                setMessages={setMessages}
                                onRetry={handleRetry}
                                isLoading={isLoadingResponse}
                                currentSessionId={currentSessionId}
                                isLoadingResponse={isLoadingResponse}
                                sendMessage={handleSendMessage}
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

                <div
                    className={cn(
                        'relative',
                        'md:w-full md:max-w-[720px] md:mx-auto'
                    )}>
                    {showScrollButton && !isEditorOpen ? (
                        <button
                            type="button"
                            onClick={scrollToBottom}
                            className={cn(
                                'bg-[#5F2BCE] hover:opacity-80 transition-all w-8 h-8 grid place-items-center rounded-full absolute -top-4 left-1/2 -translate-x-1/2'
                            )}>
                            <FaArrowDown className="text-white w-4 h-4" />
                            <span className="sr-only">scroll to bottom</span>
                        </button>
                    ) : (
                        <></>
                    )}

                    <PromptBar
                        onSend={handleSendMessage}
                        isLoading={isLoadingResponse}
                        onStateChange={({ isEditorOpen }) =>
                            setIsEditorOpen(isEditorOpen)
                        }
                        onOpenReferenceModal={handleOpenReferenceModal}
                        onOpenReferenceContentModal={
                            handleOpenReferenceContentModal
                        }
                        referenceCount={selectedReferences.length}
                    />
                </div>
            </div>

            {!isAuthenticated ? <CopilotAuthPrompt /> : <></>}

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
        </>
    );
};

export default CopilotContainer;
