import React, { useEffect } from 'react';
import Skeleton from 'commons/components/elements/Skeleton';
import LearningCard from './LearningCard';
import { CardData } from './LanjutBelajarSection';

interface LearningCardGridProps {
    cardData: CardData[];
    isLoading: boolean;
    onCardClick: (card: CardData) => void;
}

const LearningCardGrid: React.FC<LearningCardGridProps> = ({
    cardData,
    isLoading,
    onCardClick
}) => {
    const scrollContainer = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollLeft = 0;
        }
    }, [cardData]);

    return (
        <div className="relative">
            <div
                className="overflow-x-auto pb-4 hide-scrollbar"
                ref={scrollContainer}>
                <div className="flex gap-4 pl-4 md:pl-2 pr-4 md:pr-2 w-max">
                    {isLoading ? (
                        <LoadingState />
                    ) : cardData.length > 0 ? (
                        cardData.map((card) => (
                            <div
                                key={`${card.id}-${card.category}`}
                                className="w-72 md:w-[350px] lg:w-[380px] flex-shrink-0">
                                <LearningCard
                                    card={card}
                                    onClick={onCardClick}
                                />
                            </div>
                        ))
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
};

// Loading state component
const LoadingState = () => (
    <>
        {Array(3)
            .fill(0)
            .map((_, index) => (
                <div
                    key={`loading-${index}`}
                    className="w-72 md:w-[350px] lg:w-[380px] flex-shrink-0 bg-neutral-800 rounded-lg overflow-hidden">
                    <div className="flex h-full">
                        <div className="w-[30%]">
                            <Skeleton className="h-full aspect-[3/4]" />
                        </div>
                        <div className="p-4 flex-1">
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-1/4 mb-4" />
                            <Skeleton className="h-6 w-1/4 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
    </>
);

// Empty state component
const EmptyState = () => (
    <div className="w-full flex items-center justify-center py-10 min-w-[300px]">
        <p className="text-neutral-400">Belum ada konten untuk ditampilkan</p>
    </div>
);

export default LearningCardGrid;
