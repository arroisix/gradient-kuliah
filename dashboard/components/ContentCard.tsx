import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { FaGraduationCap, FaBookmark, FaListUl } from 'react-icons/fa';
import { BiSolidStar } from 'react-icons/bi';
import Cards from 'flashcard/assets/Cards';
import FlashcardLargeIcon from 'dashboard/assets/FlashcardLargeIcon';
import KuisCover from '../assets/KuisCover';
import Fire from '../assets/Fire';

interface ContentCardProps {
    id: string;
    title: string;
    category: string;
    thumbnail: string | null;
    href: string;
    courseName?: string;
    chapterName?: string;
    authorName?: string;
    authorPhoto?: string;
    cardCount?: string | number;
    problemCount?: string | number;
    rating?: number;
    badgeText?: string;
    badgeColor?: string;
    isTrending?: boolean;
    isBaru?: boolean;
    onClick?: () => void;
    isMajorClass?: boolean;
    hasTwoLineCards?: boolean;
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
    title,
    category,
    thumbnail,
    href,
    courseName,
    chapterName,
    authorName,
    authorPhoto,
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
    const isVideo =
        (category === 'Video' || category === 'Kelas') && !isMajorClass;
    const isFlashcard = category === 'Flashcard';
    const isKuis = category === 'Kuis';
    const isBookType =
        category === 'Astronotes' ||
        category === 'Textbook Solution' ||
        category === 'Bank Soal';

    const isLongCourseName = courseName && courseName.length > 30;
    const isLongChapterName = chapterName && chapterName.length > 30;
    const isLongAuthorName = authorName && authorName.length > 30;
    const shouldUseStackedLayout =
        isLongCourseName || isLongChapterName || isLongAuthorName;

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="block relative rounded-lg transition-colors overflow-hidden h-full bg-[#121212] border border-[#666666] border-opacity-50">
            {isTrending && (
                <div
                    className="absolute top-2 left-2 z-10 text-white text-xs py-1 px-3 rounded-full flex items-center gap-1"
                    style={{
                        background:
                            'linear-gradient(90deg, #36236A 0%, #6C5096 65%, #494BA0 90%)'
                    }}>
                    <Fire />
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

            <div className="relative w-full aspect-video bg-[#222222]">
                {thumbnail ? (
                    isBookType ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src={thumbnail}
                                alt={title}
                                className="h-[80%] rounded-lg w-auto object-contain"
                                style={{ maxWidth: '60%' }}
                            />
                        </div>
                    ) : (
                        <Image
                            src={thumbnail}
                            alt={title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                        />
                    )
                ) : isFlashcard ? (
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                        <FlashcardLargeIcon />
                    </div>
                ) : isKuis ? (
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                        <KuisCover />
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
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
                                authorName ||
                                cardCount ||
                                problemCount) && (
                                <div className="flex items-center text-[12px] text-neutral-400 overflow-hidden">
                                    {courseName && (
                                        <>
                                            {category != 'Astronotes' && (
                                                <FaGraduationCap
                                                    size={14}
                                                    className="text-indigo-400 mr-2 flex-shrink-0"
                                                />
                                            )}
                                            <span className="truncate">
                                                {courseName}
                                            </span>
                                        </>
                                    )}

                                    {courseName &&
                                        (chapterName ||
                                            authorName ||
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

                                    {chapterName &&
                                        (authorName ||
                                            cardCount ||
                                            problemCount) && (
                                            <span className="mx-2 flex-shrink-0">
                                                |
                                            </span>
                                        )}

                                    {!shouldUseStackedLayout &&
                                        isFlashcard &&
                                        authorName && (
                                            <>
                                                <div className="flex items-center overflow-hidden">
                                                    {authorPhoto ? (
                                                        <img
                                                            src={authorPhoto}
                                                            alt={authorName}
                                                            className="w-5 h-5 rounded-full flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-[#5F2BCE] flex items-center justify-center text-white text-xs flex-shrink-0">
                                                            {authorName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                '?'}
                                                        </div>
                                                    )}
                                                    <span className="truncate ml-2">
                                                        {authorName}
                                                    </span>
                                                </div>
                                                {(cardCount ||
                                                    problemCount) && (
                                                    <span className="mx-2 flex-shrink-0">
                                                        |
                                                    </span>
                                                )}
                                            </>
                                        )}

                                    {!shouldUseStackedLayout && cardCount && (
                                        <>
                                            <div className="mr-1">
                                                <Cards />
                                            </div>
                                            <span className="truncate">
                                                {cardCount} Cards
                                            </span>
                                        </>
                                    )}

                                    {!shouldUseStackedLayout && problemCount && (
                                        <>
                                            <FaListUl
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
                                        {category != 'Astronotes' && (
                                            <FaGraduationCap
                                                size={14}
                                                className="text-indigo-400 mr-2 flex-shrink-0"
                                            />
                                        )}
                                        <span className="truncate max-w-full">
                                            {courseName}
                                        </span>
                                    </div>
                                )}

                                {chapterName && (
                                    <div className="flex items-center text-[12px] text-neutral-400">
                                        {courseName && (
                                            <span className="mr-2 flex-shrink-0">
                                                |
                                            </span>
                                        )}
                                        <FaBookmark
                                            size={14}
                                            className="text-indigo-400 mr-2 flex-shrink-0"
                                        />
                                        <span className="truncate max-w-full">
                                            {chapterName}
                                        </span>
                                    </div>
                                )}

                                {isFlashcard && authorName && (
                                    <div className="flex items-center text-[12px] text-neutral-400">
                                        {(courseName || chapterName) && (
                                            <span className="mr-2 flex-shrink-0">
                                                |
                                            </span>
                                        )}
                                        <div className="flex items-center">
                                            {authorPhoto ? (
                                                <img
                                                    src={authorPhoto}
                                                    alt={authorName}
                                                    className="w-5 h-5 rounded-full flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-[#5F2BCE] flex items-center justify-center text-white text-xs flex-shrink-0">
                                                    {authorName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                            <span className="truncate ml-2 max-w-full">
                                                {authorName}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {cardCount && (
                                    <div className="flex items-center text-[12px] text-neutral-400">
                                        {(courseName ||
                                            chapterName ||
                                            (isFlashcard && authorName)) && (
                                            <span className="mr-2 flex-shrink-0">
                                                |
                                            </span>
                                        )}
                                        <div className="mr-1">
                                            <Cards />
                                        </div>
                                        <span className="truncate max-w-full">
                                            {cardCount} Cards
                                        </span>
                                    </div>
                                )}

                                {problemCount && (
                                    <div className="flex items-center text-[12px] text-neutral-400">
                                        {(courseName ||
                                            chapterName ||
                                            (isFlashcard && authorName)) && (
                                            <span className="mr-2 flex-shrink-0">
                                                |
                                            </span>
                                        )}
                                        <FaListUl
                                            size={14}
                                            className="text-indigo-400 mr-2 flex-shrink-0"
                                        />
                                        <span className="truncate max-w-full">
                                            {problemCount} Soal
                                        </span>
                                    </div>
                                )}
                            </>
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
