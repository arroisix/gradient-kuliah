import { useEffect, useRef, useState } from 'react';
import { ChatMessage, ContentRecommendation } from 'copilot/types/copilot';
import { chatApi } from 'copilot/redux/api/copilotApi';
import ContentRecommendations from './ContentRecommendations';

interface MessageObserverProps {
    message: ChatMessage;
    children: React.ReactNode;
    onRecommendationsUpdate: (recommendations: ContentRecommendation[]) => void;
    isLatest: boolean;
}

const MessageObserver = ({
    message,
    children,
    onRecommendationsUpdate,
    isLatest
}: MessageObserverProps) => {
    const messageRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout>();
    const hasCalledApi = useRef(false);
    const [localRecommendations, setLocalRecommendations] = useState<
        ContentRecommendation[]
    >([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] =
        useState(false);

    useEffect(() => {
        if (
            !message.keyword ||
            message.role !== 'AI' ||
            hasCalledApi.current ||
            isLatest
        ) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasCalledApi.current) {
                        timerRef.current = setTimeout(async () => {
                            setIsLoadingRecommendations(true);
                            try {
                                const response =
                                    await chatApi.getContentRecommendation(
                                        message.keyword!
                                    );
                                const recommendations =
                                    response.recommendation.slice(0, 3);
                                setLocalRecommendations(recommendations);
                                onRecommendationsUpdate(recommendations);
                                hasCalledApi.current = true;
                            } catch (error) {
                                console.error(
                                    'Failed to fetch recommendations:',
                                    error
                                );
                            } finally {
                                setIsLoadingRecommendations(false);
                            }
                        }, 1000);
                    } else if (!entry.isIntersecting && timerRef.current) {
                        clearTimeout(timerRef.current);
                    }
                });
            },
            {
                threshold: 0.5
            }
        );

        if (messageRef.current) {
            observer.observe(messageRef.current);
        }

        return () => {
            observer.disconnect();
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [message.keyword, message.role, onRecommendationsUpdate]);

    const renderLocalRecommendations = () => {
        if (!message.keyword || isLatest) return null;

        return (
            <ContentRecommendations
                keyword={message.keyword}
                recommendations={localRecommendations}
                isLoading={isLoadingRecommendations}
            />
        );
    };

    return (
        <div ref={messageRef} className="min-w-0">
            {children}
            {renderLocalRecommendations()}
        </div>
    );
};

export default MessageObserver;
