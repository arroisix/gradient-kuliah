import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { FaGraduationCap, FaBookmark, FaRegStickyNote } from 'react-icons/fa';
import { BiSolidStar } from 'react-icons/bi';
import { TbCards } from 'react-icons/tb';
import { useTracker } from 'tracker/tracker';

interface ContentCardProps {
    id: string;
    title: string;
    category: string;
    thumbnail: string | null;
    href: string;
    courseName?: string;
    chapterName?: string;
    authorName?: string;
    cardCount?: string | number;
    problemCount?: string | number;
    rating?: number;
    badgeText?: string;
    badgeColor?: string;
    isTrending?: boolean;
    isBaru?: boolean;
    onClick?: () => void;
    isMajorClass?: boolean;
    hasTwoLineCards?: boolean; // New prop to indicate if section has any two-line titles
}

type CategoryType =
    | 'Video'
    | 'Kelas'
    | 'Astronotes'
    | 'Textbook Solution'
    | 'Bank Soal'
    | 'Kuis'
    | 'Flashcard';

const ContentCard: React.FC<ContentCardProps> = ({
    id,
    title,
    category,
    thumbnail,
    href,
    courseName,
    chapterName,
    authorName,
    cardCount,
    problemCount,
    rating,
    badgeText,
    badgeColor,
    isTrending = false,
    isBaru = false,
    isMajorClass = false,
    hasTwoLineCards = false,
    onClick
}) => {
    const tracker = useTracker();
    const isVideo =
        (category === 'Video' || category === 'Kelas') && !isMajorClass;

    const handleClick = () => {
        tracker?.genericTrack('Click Content Card', {
            id,
            title,
            category,
            courseName,
            isTrending,
            isBaru
        });

        if (onClick) onClick();
    };

    const isLongCourseName = courseName && courseName.length > 20;
    const isLongChapterName = chapterName && chapterName.length > 20;
    const shouldUseStackedLayout = isLongCourseName || isLongChapterName;

    return (
        <Link
            href={href}
            className="block relative rounded-lg transition-colors overflow-hidden h-full bg-[#121212] border border-[#666666] border-opacity-50"
            onClick={handleClick}>
            {isTrending && (
                <div
                    className="absolute top-2 left-2 z-10 text-white text-xs py-1 px-3 rounded-full flex items-center gap-1"
                    style={{
                        background:
                            'linear-gradient(90deg, #36236A 0%, #6C5096 65%, #494BA0 90%)'
                    }}>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Trending
                </div>
            )}

            {isBaru && (
                <div
                    className="absolute top-2 left-2 z-10 text-white text-xs py-1 px-3 rounded-full"
                    style={{ backgroundColor: '#E9202A' }}>
                    Baru
                </div>
            )}

            <div className="relative w-full aspect-video">
                {thumbnail ? (
                    <Image
                        src={thumbnail}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
                        <span className="text-neutral-400">No thumbnail</span>
                    </div>
                )}

                {isVideo && !isBaru && (
                    <div className="absolute inset-0 grid place-items-center">
                        <div className="text-white border-none rounded-full w-12 h-12 flex items-center justify-center bg-black/60">
                            <FaRegCirclePlay size={28} />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col justify-between">
                <div className="flex flex-col">
                    {!isMajorClass && !isBaru && (
                        <div
                            className="rounded-full text-xs text-white font-medium px-3 py-1 mb-2 w-fit"
                            style={{
                                backgroundColor:
                                    badgeColor ||
                                    getColorForCategory(
                                        category as CategoryType
                                    )
                            }}>
                            {badgeText || category}
                        </div>
                    )}

                    <h3
                        className={`font-semibold text-white text-base line-clamp-2 mb-4 ${
                            hasTwoLineCards ? 'min-h-[48px]' : ''
                        }`}>
                        {title}
                    </h3>
                </div>

                {!isBaru && (
                    <div className="flex flex-col gap-2">
                        {!shouldUseStackedLayout &&
                            (courseName ||
                                chapterName ||
                                cardCount ||
                                problemCount) && (
                                <div className="flex items-center text-[12px] text-neutral-400 overflow-hidden">
                                    {courseName && (
                                        <>
                                            <FaGraduationCap
                                                size={14}
                                                className="text-indigo-400 mr-2 flex-shrink-0"
                                            />
                                            <span className="truncate">
                                                {courseName}
                                            </span>
                                        </>
                                    )}

                                    {courseName &&
                                        (chapterName ||
                                            cardCount ||
                                            problemCount) && (
                                            <span className="mx-2 flex-shrink-0">
                                                |
                                            </span>
                                        )}

                                    {chapterName && (
                                        <>
                                            <FaBookmark
                                                size={14}
                                                className="text-indigo-400 mr-2 flex-shrink-0"
                                            />
                                            <span className="truncate">
                                                {chapterName}
                                            </span>
                                        </>
                                    )}

                                    {!chapterName && cardCount && (
                                        <>
                                            <TbCards
                                                size={14}
                                                className="text-indigo-400 mr-2 flex-shrink-0"
                                            />
                                            <span className="truncate">
                                                {cardCount} Cards
                                            </span>
                                        </>
                                    )}

                                    {!chapterName && problemCount && (
                                        <>
                                            <TbCards
                                                size={14}
                                                className="text-indigo-400 mr-2 flex-shrink-0"
                                            />
                                            <span className="truncate">
                                                {problemCount} Soal
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}

                        {shouldUseStackedLayout && (
                            <>
                                {courseName && (
                                    <div className="flex items-center text-[12px] text-neutral-400">
                                        <FaGraduationCap
                                            size={14}
                                            className="text-indigo-400 mr-2 flex-shrink-0"
                                        />
                                        <span className="truncate max-w-full">
                                            {courseName}
                                        </span>
                                    </div>
                                )}

                                {chapterName && (
                                    <div className="flex items-center text-[12px] text-neutral-400">
                                        <span className="mr-2 flex-shrink-0">
                                            |
                                        </span>
                                        <FaBookmark
                                            size={14}
                                            className="text-indigo-400 mr-2 flex-shrink-0"
                                        />
                                        <span className="truncate max-w-full">
                                            {chapterName}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}

                        {shouldUseStackedLayout && cardCount && (
                            <div className="flex items-center text-[12px] text-neutral-400">
                                <span className="mr-2 flex-shrink-0">|</span>
                                <TbCards
                                    size={14}
                                    className="text-indigo-400 mr-2 flex-shrink-0"
                                />
                                <span className="truncate max-w-full">
                                    {cardCount} Cards
                                </span>
                            </div>
                        )}

                        {shouldUseStackedLayout && problemCount && (
                            <div className="flex items-center text-[12px] text-neutral-400">
                                <span className="mr-2 flex-shrink-0">|</span>
                                <TbCards
                                    size={14}
                                    className="text-indigo-400 mr-2 flex-shrink-0"
                                />
                                <span className="truncate max-w-full">
                                    {problemCount} Soal
                                </span>
                            </div>
                        )}

                        {authorName && (
                            <div className="flex items-center text-[12px] text-neutral-400">
                                <span className="mr-2 flex-shrink-0">|</span>
                                <FaRegStickyNote
                                    size={14}
                                    className="text-indigo-400 mr-2 flex-shrink-0"
                                />
                                <span className="truncate max-w-full">
                                    {authorName}
                                </span>
                            </div>
                        )}

                        {rating && (
                            <div className="flex items-center text-[12px]">
                                <span className="mr-2 flex-shrink-0">|</span>
                                <BiSolidStar
                                    size={16}
                                    className="text-yellow-400 mr-1 flex-shrink-0"
                                />
                                <span className="text-neutral-300">
                                    {rating.toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

const getColorForCategory = (category: CategoryType): string => {
    const colorMap: Record<CategoryType, string> = {
        Video: '#333333',
        Kelas: '#333333',
        Astronotes: '#CC009E',
        'Textbook Solution': '#00B78B',
        'Bank Soal': '#0083FF',
        Kuis: '#3B82F6',
        Flashcard: '#F59E0B'
    };

    return colorMap[category] || '#4B5563';
};

export default ContentCard;
