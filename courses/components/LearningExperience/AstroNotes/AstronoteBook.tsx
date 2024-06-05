import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { useTracker } from 'tracker/tracker';
import { cn } from 'commons/utils';
import { CDN_URL } from 'commons/constants';
import { IoTime } from 'react-icons/io5';
import { TbCircleCheckFilled } from 'react-icons/tb';

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
    const router = useRouter();

    const getBaseHref = () => {
        if (category_name.toLowerCase() === 'textbook') {
            return `/perpustakaan/textbook/${slug}`;
        } else if (category_name.toLowerCase() === 'catatan') {
            return `/perpustakaan/astronotes/${slug}`;
        } else {
            return `/perpustakaan/bank-soal/${slug}`;
        }
    };

    return (
        <div
            className="flex flex-col h-full cursor-pointer"
            onClick={() => {
                tracker?.genericTrack(eventName, {
                    'Book Slug': slug,
                    ...eventPayload
                });

                if (in_progress)
                    router.push(`${getBaseHref()}/${latest_page || 1}`);
                else router.push(getBaseHref());
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
        </div>
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
    ...book
}: Astronote &
    PropsWithClassName & {
        type?: 'video' | 'book' | 'textbook';
        orientation?: 'horizontal' | 'vertical';
        href: string;
        imageClassname?: string;
        eventName?: string;
        eventPayload?: Record<string, unknown>;
    }): JSX.Element => {
    const tracker = useTracker();

    const Info = (): JSX.Element => (
        <>
            <p
                className={cn(
                    'w-full mt-1 text-xs truncate',
                    !book.authors && 'hidden'
                )}>
                {book.authors}
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
            <div className="grow"></div>
            <div
                className={cn(
                    'rounded-full px-3 py-2 font-bold w-fit text-xs bg-neutral-800',
                    {
                        'bg-[#D05140]': book.category_name === 'Textbook',
                        'bg-[#953EAA]': book.category_name === 'Astronotes',
                        'bg-[#4B93E8]': book.category_name === 'Bank Soal'
                    }
                )}>
                {book.category_name === 'Textbook'
                    ? 'Textbook Solution'
                    : book.category_name}
            </div>
        </>
    );

    const Progress = (): JSX.Element => (
        <>
            <p
                className={cn(
                    'pt-2 font-sans text-xs text-neutral-400',
                    (!book.last_chapter_read ||
                        book.percentage_progress == 100) &&
                        'hidden'
                )}>
                Bab: {book.last_chapter_read}
            </p>
            <div className="grow"></div>
            <div className="flex items-center w-full gap-2 mt-2 text-xs text-neutral-400">
                <progress
                    className="grow progress progress-primary"
                    value={book.percentage_progress}
                    max={100}></progress>
                {book.percentage_progress}%
            </div>
        </>
    );

    return (
        <Link
            href={href}
            onClick={() => tracker?.genericTrack(eventName, eventPayload)}
            className={cn(
                'flex gap-4 p-3 bg-black border rounded-lg border-neutral-700 shadow-md shadow-black/25',
                orientation == 'vertical' &&
                    'flex-col w-[150px] items-center flex-none',
                className
            )}>
            <div
                className={cn(
                    'relative flex-none border rounded-md border-neutral-700',
                    orientation == 'vertical' && 'w-24',
                    type !== 'video' ? 'aspect-[256/364]' : 'aspect-[7/8]',
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
            </div>
            <div className="flex flex-col overflow-hidden font-body grow">
                <p
                    className={cn(
                        'flex items-center pb-2 text-xs',
                        !book.in_progress && 'hidden',
                        book.percentage_progress == 100
                            ? 'text-[#43B75D]'
                            : 'text-accent-yellow'
                    )}>
                    {book.percentage_progress == 100 ? (
                        <>
                            <TbCircleCheckFilled size={12} className="mr-1" />
                            Completed
                        </>
                    ) : (
                        <>
                            <IoTime size={12} className="mr-1" /> In Progress
                        </>
                    )}
                </p>

                <p className="font-sans text-sm font-bold">{book.title}</p>
                {book.in_progress ? <Progress /> : <Info />}
            </div>
        </Link>
    );
};

export default AstronoteBook;
