import { useEffect, useRef, useState } from 'react';
import { ChatMessage, ContentRecommendation } from '../types/copilot';
import { chatApi } from '../redux/api/copilotApi';
import Link from 'next/link';
import Image from 'next/image';
import { Library } from 'lucide-react';
import { FiArrowUpLeft } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

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

    const getContentUrl = (content: ContentRecommendation): string => {
        switch (content.type) {
            case 'course_video':
                return content.course_slug && content.subchapter_slug
                    ? `/kelas/${content.course_slug}/${content.subchapter_slug}`
                    : '#';
            case 'astronotes_content':
                return content.book_slug && content.book_page
                    ? `/perpustakaan/astronotes/${content.book_slug}/${content.book_page}`
                    : '#';
            case 'textbook_problem':
                return content.book_slug && content.problem_slug
                    ? `/perpustakaan/textbook/${content.book_slug}/${content.problem_slug}`
                    : '#';
            case 'bank_soal_problem':
                return content.book_slug && content.problem_slug
                    ? `/perpustakaan/bank-soal/${content.book_slug}/${content.problem_slug}`
                    : '#';
        }
    };

    useEffect(() => {
        if (!message.keyword || message.role !== 'AI' || isLatest) {
            return;
        }

        let clearTimer: NodeJS.Timeout;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (clearTimer) {
                            clearTimeout(clearTimer);
                        }

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
                                setLocalRecommendations([]);
                                onRecommendationsUpdate([]);
                            } finally {
                                setIsLoadingRecommendations(false);
                            }
                        }, 2000);
                    } else {
                        if (timerRef.current) {
                            clearTimeout(timerRef.current);
                        }

                        clearTimer = setTimeout(() => {
                            setLocalRecommendations([]);
                            onRecommendationsUpdate([]);
                            hasCalledApi.current = false;
                        }, 2000);
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
            if (clearTimer) {
                clearTimeout(clearTimer);
            }
            hasCalledApi.current = false;
        };
    }, [message.keyword, message.role, isLatest, onRecommendationsUpdate]);

    const renderLocalRecommendations = () => {
        if (!message.keyword || isLatest) return null;

        return (
            <div className="mt-4 space-y-4">
                <button
                    onClick={() => {
                        window.location.href = `/search/results?q=${encodeURIComponent(
                            message.keyword!
                        )}`;
                    }}
                    className="w-full px-4 py-3 text-start text-neutral-400 hover:bg-[#222222] rounded-lg transition-colors flex items-center justify-between border border-[#333333]">
                    <span className="text-sm">Lihat materi terkait</span>
                    <FiArrowUpLeft className="text-neutral-400" />
                </button>

                {isLoadingRecommendations ? (
                    <div className="flex justify-center py-4">
                        <AiOutlineLoading3Quarters
                            className="animate-spin text-neutral-400"
                            size={24}
                        />
                    </div>
                ) : (
                    localRecommendations.length > 0 && (
                        <div className="relative w-full">
                            <div className="absolute left-0 right-0">
                                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                                    {localRecommendations.map(
                                        (content, index) => (
                                            <Link
                                                key={index}
                                                href={getContentUrl(content)}
                                                className="flex-shrink-0 bg-[#222222] w-[280px] rounded-lg overflow-hidden flex flex-col">
                                                {content.type ===
                                                'course_video' ? (
                                                    <>
                                                        {content.thumbnail && (
                                                            <div className="relative aspect-video w-full">
                                                                <Image
                                                                    src={
                                                                        content.thumbnail
                                                                    }
                                                                    alt={
                                                                        content.book_name ||
                                                                        ''
                                                                    }
                                                                    layout="fill"
                                                                    className="object-cover"
                                                                    priority
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                                                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col h-full p-3">
                                                        {content.snippet && (
                                                            <p
                                                                className="text-sm text-white flex-1"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: content.snippet.replace(
                                                                        /<mark>(.*?)<\/mark>/g,
                                                                        '<span class="text-[#F2C04C]">$1</span>'
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <Library
                                                                size={16}
                                                                className="text-[#7D89CC]"
                                                            />
                                                            <p className="text-sm text-[#999999] transition-colors">
                                                                {
                                                                    content.book_name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="h-[160px]" />
                        </div>
                    )
                )}
            </div>
        );
    };

    return (
        <div ref={messageRef}>
            {children}
            {renderLocalRecommendations()}
        </div>
    );
};

export default MessageObserver;
