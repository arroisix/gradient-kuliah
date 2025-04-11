import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoTime } from 'react-icons/io5';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { FaGraduationCap } from 'react-icons/fa';
import { BiListUl } from 'react-icons/bi';
import { CardData } from './LanjutBelajarSection';
import { cn } from 'commons/utils';
import FlashcardLargeIcon from '../../assets/FlashcardLargeIcon';
import Cards from '../../../flashcard/assets/Cards';
import KuisCover from '../../assets/KuisCover';

interface LearningCardProps {
    card: CardData;
    onClick: (card: CardData) => void;
}

type CategoryType =
    | 'Video'
    | 'Astronotes'
    | 'Textbook Solution'
    | 'Bank Soal'
    | 'Exercise'
    | 'Flashcard';

const LearningCard: React.FC<LearningCardProps> = ({ card, onClick }) => {
    const isVideo = card.category === 'Video';
    const isFlashcard = card.category === 'Flashcard';
    const isExercise = card.category === 'Exercise';
    const hasNumberPrefix = card.title?.match(/^\d+\.\s/) || false;

    return (
        <Link
            href={card.href}
            className="block relative rounded-lg bg-[#2C2C2C] hover:bg-neutral-700 transition-colors overflow-hidden h-full min-h-[165px] border border-[#666666] border-opacity-50"
            onClick={() => onClick(card)}>
            <div className="flex h-full">
                {/* Left side - Thumbnail */}
                <div
                    className={cn('relative', isVideo ? 'w-[40%]' : 'w-[30%]')}>
                    {isFlashcard ? (
                        <div className="w-full h-full flex items-center justify-center p-4 bg-[#222222]">
                            <FlashcardLargeIcon />
                        </div>
                    ) : isExercise ? (
                        <div className="w-full h-full flex items-center justify-center p-4 bg-[#222222]">
                            <KuisCover />
                        </div>
                    ) : card.thumbnail ? (
                        <Image
                            src={card.thumbnail}
                            alt={card.title || ''}
                            layout="fill"
                            objectFit="cover"
                            className={isVideo ? '' : 'p-4'}
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
                            <span className="text-neutral-400">
                                No thumbnail
                            </span>
                        </div>
                    )}

                    {/* Play button for videos */}
                    {isVideo && (
                        <div className="absolute inset-0 grid place-items-center">
                            <div className="text-white border-none rounded-full w-12 h-12 flex items-center justify-center bg-black/60">
                                <FaRegCirclePlay size={28} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right side - Content */}
                <div className="flex-1 p-4 flex flex-col">
                    {/* Progress indicator */}
                    {card.progress > 0 && (
                        <div className="flex items-center gap-1 py-1 px-3 mb-3 rounded-full bg-[#FFCB53]/20 text-xs text-yellow-400 w-fit">
                            <IoTime size={12} />
                            <span>In Progress - {card.progress}%</span>
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-white text-base mb-3">
                        {hasNumberPrefix
                            ? card.title
                            : isVideo
                            ? card.title
                            : `${card.title}`}
                    </h3>

                    {/* Course info with icon */}
                    <div className="mt-auto">
                        <div className="flex items-center flex-wrap gap-y-2 mb-3">
                            {/* Course badge or Author name for Flashcards */}
                            {isFlashcard && card.authorName ? (
                                <div className="flex items-center gap-2 mr-3">
                                    {card.authorPhoto ? (
                                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                            <Image
                                                src={card.authorPhoto}
                                                alt={card.authorName}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-700 text-white text-xs">
                                            {card.authorName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-neutral-400 text-xs truncate max-w-[84px]">
                                        {card.authorName}
                                    </span>
                                </div>
                            ) : (
                                card.courseBadge && (
                                    <div className="flex items-center gap-1 mr-3">
                                        <FaGraduationCap
                                            size={14}
                                            className="text-indigo-400"
                                        />
                                        <span className="text-neutral-400 text-xs truncate max-w-[84px]">
                                            {card.courseBadge}
                                        </span>
                                    </div>
                                )
                            )}

                            {/* Separator */}
                            {((isFlashcard &&
                                card.authorName &&
                                card.cardCount) ||
                                (!isFlashcard &&
                                    card.courseBadge &&
                                    card.chapterBadge)) && (
                                <span className="mx-2 text-neutral-500">|</span>
                            )}

                            {/* Card count for Flashcards, Problem count for Exercise, or Chapter badge for others */}
                            {isFlashcard && card.cardCount ? (
                                <div className="flex items-center gap-1">
                                    <Cards />
                                    <span className="text-neutral-400 text-xs truncate max-w-[84px]">
                                        {card.cardCount} Cards
                                    </span>
                                </div>
                            ) : (
                                card.chapterBadge && (
                                    <div className="flex items-center gap-1">
                                        <BiListUl
                                            size={14}
                                            className="text-indigo-400"
                                        />
                                        <span className="text-neutral-400 text-xs truncate max-w-[84px]">
                                            {card.chapterBadge}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Category badge */}
                        <div>
                            <span
                                className="text-xs text-white rounded-full px-3 py-1 inline-block"
                                style={{
                                    backgroundColor: getColorForCategory(
                                        card.category as CategoryType
                                    )
                                }}>
                                {card.category}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// Helper function to get the right color for each category type
const getColorForCategory = (category: CategoryType): string => {
    const colorMap: Record<CategoryType, string> = {
        Video: '#333333',
        Astronotes: '#CC009E',
        'Textbook Solution': '#00B78B',
        'Bank Soal': '#0083FF',
        Exercise: '#3B82F6',
        Flashcard: '#F59E0B'
    };

    return colorMap[category] || '#4B5563'; // Default gray if category not found
};

export default LearningCard;
