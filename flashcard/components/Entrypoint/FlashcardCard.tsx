import React from 'react';
import Link from 'next/link';
import { cn } from 'commons/utils';
import FlashcardTag from '../../assets/FlashcardTag';
import Cards from 'flashcard/assets/Cards';

interface FlashcardCardProps {
    slug: string;
    title: string;
    totalCards: number;
    author?: {
        name: string;
        photo_profile: string;
    };
    className?: string;
    cardType?: 'myFlashcards' | 'allFlashcards';
    createdByMe?: boolean;
}

const FlashcardCard = ({
    slug,
    title,
    totalCards,
    author,
    className,
    cardType = 'allFlashcards',
    createdByMe
}: FlashcardCardProps): JSX.Element => {
    return (
        <Link
            href={`/flashcard/${slug}`}
            className={cn('relative block h-[200px] w-full', className)}>
            {' '}
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
                <div className="flex flex-col h-full">
                    <div className="flex-none">
                        <div className="flex items-center">
                            <FlashcardTag />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mt-3 line-clamp-3 min-h-[4.5rem]">
                        {title}
                    </h3>

                    <div className="mt-auto">
                        {author && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {author.photo_profile ? (
                                        <img
                                            src={author.photo_profile}
                                            alt={author.name}
                                            className="w-5 h-5 rounded-full flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-[#5F2BCE] flex items-center justify-center text-white text-xs flex-shrink-0">
                                            {author.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm text-neutral-400 truncate">
                                        {createdByMe ? 'Kamu' : author.name}
                                    </span>
                                </div>
                                <div className="text-[#666666] flex-shrink-0">
                                    |
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-400 flex-shrink-0">
                                    <Cards />
                                    <span>{totalCards} Cards</span>
                                </div>
                            </div>
                        )}
                        {!author && (
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <Cards />
                                <span>{totalCards} Cards</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default FlashcardCard;
