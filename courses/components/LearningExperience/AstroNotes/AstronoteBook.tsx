import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { useTracker } from 'tracker/tracker';
import { cn } from 'commons/utils';
import { CDN_URL } from 'commons/constants';
import { IoTime } from 'react-icons/io5';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { getBookBaseHref } from 'courses/utils';
import { FaRegCirclePlay } from 'react-icons/fa6';

const AstronoteBook = ({
    slug,
    book_cover_url,
    title,
    authors,
    rating,
    education_level,
    in_progress,
    latest_page,
    category_name,
    eventName = 'Click Book Item on Library Page',
    eventPayload
}: Astronote & {
    eventName?: string;
    eventPayload?: Record<string, unknown>;
}): JSX.Element => {
    const tracker = useTracker();
    const baseHref = `${getBookBaseHref(category_name)}/${slug}`;

    return (
        <Link
            className="flex flex-col h-full cursor-pointer"
            href={in_progress ? `${baseHref}/${latest_page || 1}` : baseHref}
            onClick={() => {
                tracker?.genericTrack(eventName, {
                    'Book Slug': slug,
                    ...eventPayload
                });
            }}
            aria-hidden>
            <div className="aspect-[256/364] relative w-full border rounded border-neutral-700">
                <Image
                    src={
                        book_cover_url ||
                        'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                    }
                    layout="fill"
                    className="rounded"
                    loading="lazy"
                    unoptimized
                />
            </div>
            <div className="flex flex-col flex-1 mt-4 mb-2">
                <p className="font-body text-neutral-200">{title}</p>
                <div className="space-y-1">
                    {authors && (
                        <span className="text-sm font-body text-neutral-600">
                            {`oleh ${authors}`}
                        </span>
                    )}
                    {rating > 0 && (
                        <span className="flex items-center gap-1 text-xs font-body text-neutral-600 leading-2">
                            <AiFillStar />
                            {rating.toFixed(1)}
                        </span>
                    )}
                </div>
            </div>
            {education_level && (
                <div className="flex items-center h-auto gap-1 px-3 py-1 text-sm font-medium rounded-full font-body w-min bg-accent-purple">
                    <HiOutlineAcademicCap size={20} /> {education_level}
                </div>
            )}
        </Link>
    );
};

export const AstronoteBookCard = ({
    eventName = 'Click Book Item on Library Page',
    eventPayload,
    orientation = 'horizontal',
    type = 'book',
    href,
    className,
    imageClassname,
    isHeading = false,
    ...book
}: Astronote &
    PropsWithClassName & {
        type?: ClassProgress['type'];
        orientation?: 'horizontal' | 'vertical';
        href: string;
        imageClassname?: string;
        eventName?: string;
        eventPayload?: Record<string, unknown>;
        isHeading?: boolean;
    }): JSX.Element => {
    const tracker = useTracker();

    const authors = book.authors ?? [];
    const categoryLabel: { [key: string]: string } = {
        Catatan: 'Astronotes',
        Textbook: 'Textbook Solution',
        'Bank Soal': 'Bank Soal',
        [type]: type
    };

    const Info = (): JSX.Element => (
        <>
            <p
                className={cn(
                    'w-full mt-1 text-xs truncate',
                    authors.length === 0 && 'hidden'
                )}>
                {book.authors?.map((author, index) => (
                    <React.Fragment key={index}>
                        {author.trim()}
                        {index < authors.length - 1 && ', '}
                    </React.Fragment>
                ))}
            </p>
            <p
                className={cn(
                    'mt-2 space-x-4 text-xs text-neutral-500',
                    !(book.isbn && book.rating) && 'hidden'
                )}>
                <span className={cn(!book.isbn && 'hidden')}>
                    ISBN: {book.isbn}
                </span>
                <span
                    className={cn(
                        'inline-flex gap-1',
                        !book.rating && 'invisible'
                    )}>
                    <AiFillStar size={12} />
                    {book.rating.toFixed(1)}
                </span>
            </p>
            <div className="grow min-h-2"></div>
        </>
    );

    const Progress = (): JSX.Element => (
        <>
            <p
                className={cn(
                    'pt-2 font-sans text-xs text-neutral-200 line-clamp-1',
                    (!book.last_chapter_read ||
                        book.percentage_progress == 100) &&
                        'hidden'
                )}>
                {book.last_chapter_read}
            </p>
            <div className="grow min-h-2"></div>
        </>
    );

    const BookTitleLabel = isHeading ? 'h2' : 'p';

    return (
        <Link
            href={href}
            onClick={() => tracker?.genericTrack(eventName, eventPayload)}
            className={cn(
                'flex gap-4 p-3 bg-graphite-800 border rounded-lg border-graphite-600/50 shadow-md shadow-black/25',
                orientation == 'vertical' &&
                    'flex-col w-40 items-center flex-none',
                className
            )}>
            <div
                className={cn(
                    'relative flex-none border rounded-md border-neutral-700',
                    orientation == 'vertical' && 'w-24',
                    type !== 'video' ? 'aspect-[256/364]' : 'aspect-square',
                    imageClassname
                )}>
                <Image
                    src={
                        book.book_cover_url ||
                        `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                    }
                    alt={book.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                />
                {type === 'video' && (
                    <div className="absolute inset-0 grid place-items-center">
                        <div className="text-white border-none btn btn-circle bg-graphite-900/60">
                            <FaRegCirclePlay size={32} />
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full overflow-hidden font-body grow">
                <p
                    hidden={!book.in_progress}
                    className={cn(
                        !book.in_progress ? 'hidden' : 'flex',
                        'items-center text-xs mb-2',
                        book.percentage_progress == 100
                            ? 'text-[#282b29]'
                            : 'text-accent-yellow items-center pl-1 pr-2 py-0.5 font-medium rounded bg-accent-yellow/25 w-fit'
                    )}>
                    {book.percentage_progress == 100 ? (
                        <>
                            <TbCircleCheckFilled size={12} className="mr-1" />
                            Completed
                        </>
                    ) : (
                        <>
                            <IoTime size={12} className="mr-1" /> In Progress -{' '}
                            {book.percentage_progress}%
                        </>
                    )}
                </p>

                <BookTitleLabel className="font-sans text-sm font-bold text-balance line-clamp-2">
                    {book.title}
                </BookTitleLabel>
                {book.in_progress ? <Progress /> : <Info />}
                <div
                    className={cn(
                        'rounded-full text-xs w-fit text-white font-semibold px-3 py-1 bg-neutral-700',
                        {
                            'bg-[#00B78B]': book.category_name === 'Textbook',
                            'bg-[#CC009E]':
                                book.category_name === 'Catatan' ||
                                book.category_name === 'Astronotes',
                            'bg-[#0083FF]': book.category_name === 'Bank Soal'
                        }
                    )}>
                    {type !== 'video'
                        ? categoryLabel[book.category_name]
                        : 'Video'}
                </div>
            </div>
        </Link>
    );
};

export default AstronoteBook;
