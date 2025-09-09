import Skeleton from 'commons/components/elements/Skeleton';
import { CDN_URL } from 'commons/constants';
import { getBookBaseHref } from 'courses/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { IoTime } from 'react-icons/io5';
import { useTracker } from 'tracker/tracker';

export const ListBooks = ({
    books,
    isLoading,
    horizontal = false
}: {
    books: Book[];
    isLoading: boolean;
    horizontal?: boolean;
}): JSX.Element => {
    const tracker = useTracker();

    const categoryColorMap: Record<string, string> = {
        Video: '#333333',
        Kelas: '#333333',
        Astronotes: '#CC009E',
        'Textbook Solution': '#00B78B',
        'Bank Soal': '#0083FF',
        Kuis: '#3B82F6',
        Flashcard: '#F59E0B',
        Textbook: '#00B78B',
        Catatan: '#CC009E'
    };

    const getColorForCategory = (cat?: string): string =>
        (cat && categoryColorMap[cat]) || '#333333';

    if (horizontal) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700">
                {isLoading && (
                    <Skeleton
                        className="h-[160px] w-[280px] flex-none rounded-lg !m-0"
                        repeat={3}
                    />
                )}
                {books?.map((book) => {
                    const {
                        book_id,
                        title,
                        authors,
                        rating,
                        book_cover_url,
                        slug,
                        category
                    } = book as any;
                    const percentage_progress =
                        (book as any).percentage_progress ?? 0;
                    const hasProgress =
                        percentage_progress > 0 && percentage_progress < 100;
                    const isCompleted = percentage_progress === 100;
                    return (
                        <Link
                            key={book_id}
                            href={`${getBookBaseHref(category)}/${slug}`}
                            onClick={() =>
                                tracker?.genericTrack('Click Book Item', {
                                    'Book Title': title,
                                    Category: category
                                })
                            }
                            className="group relative min-w-[320px] max-w-[320px] flex-none snap-start rounded-xl border border-neutral-700 bg-[#1A1A1A] p-6 hover:border-neutral-500 transition-colors">
                            <div className="flex gap-5">
                                <div className="relative w-[120px] h-[160px] flex-none rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
                                    <Image
                                        src={
                                            book_cover_url ||
                                            `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                                        }
                                        alt={title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Mini progress bar */}
                                    {hasProgress && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-700/60">
                                            <div
                                                className="h-full bg-amber-400"
                                                style={{
                                                    width: `${percentage_progress}%`
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col w-full">
                                    {(hasProgress || isCompleted) && (
                                        <div className="flex items-center gap-1 py-1 px-3 mb-2 rounded-full bg-[#FFCB53]/20 text-xs text-yellow-400 w-fit self-start">
                                            <IoTime size={12} />
                                            <span>
                                                {isCompleted
                                                    ? 'Completed'
                                                    : `In Progress - ${percentage_progress}%`}
                                            </span>
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold text-white leading-snug line-clamp-3 mb-4">
                                        {title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className="text-sm text-white font-medium px-4 py-2 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    getColorForCategory(
                                                        category
                                                    )
                                            }}>
                                            {category}
                                        </span>
                                        {authors && (
                                            <span className="text-[11px] text-neutral-400 line-clamp-1">
                                                oleh {authors}
                                            </span>
                                        )}
                                        {rating !== 0 && rating != null && (
                                            <span className="flex items-center gap-1 text-[11px] text-neutral-300">
                                                <AiFillStar
                                                    className="text-yellow-400"
                                                    size={12}
                                                />
                                                {+rating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }

    // Vertical (legacy) list
    return (
        <div className="flex flex-col gap-[12px]">
            {isLoading && <Skeleton className="h-[84px] !m-0" repeat={3} />}
            {books?.map(
                ({
                    book_id,
                    title,
                    // authors,
                    // rating,
                    book_cover_url,
                    slug,
                    category
                }) => (
                    <Link
                        href={`${getBookBaseHref(category)}/${slug}`}
                        className="flex items-center gap-4 cursor-pointer rounded-xl border border-neutral-700 bg-[#2C2C2C] p-3 hover:border-neutral-500 transition-colors"
                        key={book_id}
                        onClick={() => {
                            tracker?.genericTrack('Click Book Item', {
                                'Course Slug': slug,
                                'Book Title': title
                            });
                        }}>
                        <div className="relative flex-none w-14 h-[84px] overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800">
                            <Image
                                src={
                                    book_cover_url ||
                                    `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                                }
                                alt={title}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div className="flex flex-col gap-[6px] min-w-0">
                            <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
                                {title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                                {category && (
                                    <span
                                        className="text-[10px] sm:text-xs text-white font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                                        style={{
                                            backgroundColor:
                                                getColorForCategory(category)
                                        }}>
                                        {category}
                                    </span>
                                )}
                                {/* {authors && (
                                    <span className="text-[11px] text-neutral-400 line-clamp-1">
                                        oleh {authors}
                                    </span>
                                )}
                                {rating !== 0 && rating != null && (
                                    <span className="flex items-center gap-[2px] text-[11px] text-neutral-300">
                                        <AiFillStar
                                            className="text-yellow-400"
                                            size={12}
                                        />
                                        {+rating.toFixed(1)}
                                    </span>
                                )} */}
                            </div>
                        </div>
                    </Link>
                )
            )}
        </div>
    );
};

export default ListBooks;
