import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { FaGraduationCap, FaBookmark, FaRegStickyNote } from 'react-icons/fa';
import { BiSolidStar } from 'react-icons/bi';
import { TbCards } from 'react-icons/tb';
import { useTracker } from 'tracker/tracker';

// Define props for our content card
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
    onClick?: () => void;
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
    onClick
}) => {
    const tracker = useTracker();
    const isVideo = category === 'Video' || category === 'Kelas';

    // Handle card click with tracking
    const handleClick = () => {
        tracker?.genericTrack('Click Content Card', {
            id,
            title,
            category,
            courseName,
            isTrending
        });

        if (onClick) onClick();
    };

    return (
        <Link
            href={href}
            className="block relative rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors overflow-hidden h-full"
            onClick={handleClick}>
            {/* Trending Badge (if applicable) */}
            {isTrending && (
                <div className="absolute top-2 left-2 z-10 bg-purple-700 text-white text-xs py-1 px-3 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Trending
                </div>
            )}

            {/* Thumbnail with proper aspect ratio */}
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

                {/* Category badge */}
                <div
                    className="absolute bottom-2 left-2 z-10 rounded-full text-xs text-white font-semibold px-3 py-1"
                    style={{
                        backgroundColor:
                            badgeColor ||
                            getColorForCategory(category as CategoryType)
                    }}>
                    {badgeText || category}
                </div>

                {/* Play button for videos */}
                {isVideo && (
                    <div className="absolute inset-0 grid place-items-center">
                        <div className="text-white border-none rounded-full w-12 h-12 flex items-center justify-center bg-black/60">
                            <FaRegCirclePlay size={28} />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col min-h-[120px]">
                {/* Title */}
                <h3 className="font-bold text-white text-lg mb-3 line-clamp-2">
                    {title}
                </h3>

                {/* Course info */}
                {courseName && (
                    <div className="flex items-center text-sm mb-2">
                        <FaGraduationCap
                            size={14}
                            className="text-indigo-400 mr-2"
                        />
                        <span className="text-neutral-400">{courseName}</span>
                    </div>
                )}

                {/* Chapter info */}
                {chapterName && (
                    <div className="flex items-center text-sm mb-2">
                        <FaBookmark
                            size={14}
                            className="text-indigo-400 mr-2"
                        />
                        <span className="text-neutral-400">{chapterName}</span>
                    </div>
                )}

                {/* Author info (for books/notes) */}
                {authorName && (
                    <div className="flex items-center text-sm mb-2">
                        <FaRegStickyNote
                            size={14}
                            className="text-indigo-400 mr-2"
                        />
                        <span className="text-neutral-400">{authorName}</span>
                    </div>
                )}

                {/* Card count (for flashcards) */}
                {cardCount && (
                    <div className="flex items-center text-sm mb-2">
                        <TbCards size={14} className="text-indigo-400 mr-2" />
                        <span className="text-neutral-400">
                            {cardCount} Cards
                        </span>
                    </div>
                )}

                {/* Problem count (for quizzes/bank soal) */}
                {problemCount && (
                    <div className="flex items-center text-sm mb-2">
                        <TbCards size={14} className="text-indigo-400 mr-2" />
                        <span className="text-neutral-400">
                            {problemCount} Soal
                        </span>
                    </div>
                )}

                {/* Rating (if available) */}
                {rating && (
                    <div className="flex items-center text-sm mt-auto">
                        <BiSolidStar
                            size={16}
                            className="text-yellow-400 mr-1"
                        />
                        <span className="text-neutral-300">
                            {rating.toFixed(1)}
                        </span>
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
