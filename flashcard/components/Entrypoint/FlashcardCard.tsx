import React from 'react';
import Link from 'next/link';
import { cn } from 'commons/utils';
import FlashcardTag from '../../assets/FlashcardTag';

interface FlashcardCardProps {
    id: string;
    title: string;
    totalCards: number;
    author?: string;
    className?: string;
    cardType?: 'myFlashcards' | 'allFlashcards';
}

const FlashcardCard = ({
    id,
    title,
    totalCards,
    author,
    className,
    cardType = 'allFlashcards'
}: FlashcardCardProps): JSX.Element => {
    return (
        <Link
            href={`/flashcard/${id}`}
            className={cn('relative block h-full w-full', className)}>
            {cardType !== 'myFlashcards' && (
                <div className="absolute -top-2 left-0 right-0 mx-auto w-[95%] h-full rounded-lg bg-neutral-800" />
            )}

            <div
                className={cn(
                    'relative w-full h-full rounded-lg p-5',
                    'transition-all duration-200',
                    cardType === 'myFlashcards' && 'hover:bg-opacity-80',
                    cardType === 'myFlashcards'
                        ? 'bg-neutral-800'
                        : 'bg-neutral-900'
                )}>
                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center">
                            <FlashcardTag />
                        </div>
                        <h3 className="text-lg font-semibold text-white line-clamp-2">
                            {title}
                        </h3>
                    </div>
                    <div className="text-sm text-neutral-400 mt-2 flex items-center justify-between">
                        {author && (
                            <span className="truncate max-w-[60%]">
                                {author}
                            </span>
                        )}
                        <span className="whitespace-nowrap">
                            {totalCards} Cards
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default FlashcardCard;
