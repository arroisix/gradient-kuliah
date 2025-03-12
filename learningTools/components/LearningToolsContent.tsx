import React from 'react';
import Paginator from 'commons/components/elements/Paginator';
import Skeleton from 'commons/components/elements/Skeleton';
import LatihanCard from 'latihan/components/Entrypoint/LatihanCard';
import FlashcardCard from 'flashcard/components/Entrypoint/FlashcardCard';

interface LearningToolsContentProps {
    isLoading: boolean;
    content: Array<any>;
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    limit: number;
}

const LearningToolsContent: React.FC<LearningToolsContentProps> = ({
    isLoading,
    content,
    totalItems,
    currentPage,
    limit
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <Skeleton repeat={6} className="w-full h-[158px] !mb-0" />
            </div>
        );
    }

    const totalPages = Math.ceil(totalItems / limit);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {content.map((item) => {
                    if (item.type.toLowerCase() === 'flashcard') {
                        return (
                            <FlashcardCard
                                key={item.slug}
                                slug={item.slug}
                                title={item.title}
                                totalCards={item.card_count}
                                author={{
                                    name: item.created_by,
                                    photo_profile: item.photo_profile
                                }}
                            />
                        );
                    }
                    if (item.type.toLowerCase() === 'quiz') {
                        return (
                            <LatihanCard
                                key={item.slug}
                                exercise={{
                                    id: item.slug,
                                    slug: item.slug,
                                    title: item.title,
                                    total_questions: item.problem_count,
                                    subject: item.course,
                                    icon: item.icon,
                                    status: item.in_progress
                                        ? 'IN_PROGRESS'
                                        : 'NOT_STARTED',
                                    progress: item.progress_percentage,
                                    is_free: true
                                }}
                                cardType="allExercises"
                            />
                        );
                    }
                    return null;
                })}
            </div>
            <Paginator
                totalPages={totalPages}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                className="justify-center w-full py-8"
            />
        </div>
    );
};

export default LearningToolsContent;
