import { chatApi } from 'copilot/redux/api/copilotApi';
import {
    ChatHistoryContextItem,
    ChatInput,
    ChatMessage,
    ContextReference,
    CopilotAttachment,
    CopilotContentRecommendation,
    CopilotInterrupt,
    CopilotReference,
    ExerciseQuestion,
    PerformanceAnalysis,
    Reasoning,
    ReferenceContentType,
    SelectedReference
} from 'copilot/types/copilot';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { baseApi } from 'redux/api/baseApi';

function buildChatContextFromReferences(
    references: SelectedReference[]
): ChatInput['context'] {
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
}

function convertHistoryContextToSelectedReferences(historyContext?: {
    data: ChatHistoryContextItem[];
}): SelectedReference[] {
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
}

interface UseCopilotProps {
    withSilentRedirect?: boolean;
}

function useCopilot({ withSilentRedirect = true }: UseCopilotProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [selectedReferences, setSelectedReferences] = useState<
        SelectedReference[]
    >([]);
    const [currentSessionId, setCurrentSessionId] = useState<
        string | undefined
    >();
    const [reasoning, setReasoning] = useState<Reasoning>({
        thoughts: [],
        isFinished: false
    });

    const router = useRouter();
    const dispatch = useDispatch();

    const handleClearReferences = () => {
        setSelectedReferences([]);
    };

    useEffect(() => {
        if (currentSessionId && messages.length > 0) {
            return;
        }

        if (!currentSessionId) {
            setIsLoadingHistory(false);
            return;
        }

        const loadChatHistory = async () => {
            try {
                const response = await chatApi.getChatHistory(currentSessionId);
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
                    setCurrentSessionId(currentSessionId);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        loadChatHistory();
    }, [currentSessionId, messages.length]);

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
                        if (withSilentRedirect) {
                            router.push(`/copilot/${sessionId}`, undefined, {
                                shallow: true
                            });
                        }
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
                            console.log('Updating user credit');
                            dispatch(
                                baseApi.util.invalidateTags(['COPILOT_CREDIT'])
                            );
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
                        if (withSilentRedirect) {
                            router.push(`/copilot/${sessionId}`, undefined, {
                                shallow: true
                            });
                        }
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

    return {
        isLoadingResponse,
        isLoadingHistory,
        messages,
        reasoning,
        currentSessionId,
        handleSendMessage,
        handleRetry,
        setCurrentSessionId
    };
}

export { useCopilot };
