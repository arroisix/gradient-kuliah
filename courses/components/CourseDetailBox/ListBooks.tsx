import Skeleton from 'commons/components/elements/Skeleton';
import { CDN_URL } from 'commons/constants';
import { getBookBaseHref } from 'courses/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useTracker } from 'tracker/tracker';

export const ListBooks = ({
    books,
    isLoading
}: {
    books: Book[];
    isLoading: boolean;
}): JSX.Element => {
    const tracker = useTracker();

    return (
        <div className="flex flex-col gap-[14px]">
            {isLoading && <Skeleton className="h-[60px] !m-0" repeat={3} />}
            {books?.map(
                ({
                    book_id,
                    title,
                    authors,
                    rating,
                    book_cover_url,
                    slug,
                    category
                }) => (
                    <Link
                        href={`${getBookBaseHref(category)}/${slug}`}
                        className="flex items-center gap-5 cursor-pointer"
                        key={book_id}
                        onClick={() => {
                            tracker?.genericTrack('Click Book Item', {
                                'Course Slug': slug,
                                'Book Title': title
                            });
                        }}
                        aria-hidden>
                        <div
                            className={
                                'relative flex-none border rounded-md border-neutral-700 aspect-[256/364] w-20'
                            }>
                            <Image
                                src={
                                    book_cover_url ||
                                    `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                                }
                                alt={title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded"
                            />
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <span className="inline-block text-lg font-body text-neutral-200">
                                {title}
                            </span>
                            <div>
                                {authors && (
                                    <span className="inline-block text-base font-body text-neutral-600">
                                        {`oleh ${authors}`}
                                    </span>
                                )}
                                {rating !== 0 && (
                                    <span className="flex items-center gap-[2px] font-body text-xs text-neutral-600">
                                        <AiFillStar />
                                        {+rating.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                )
            )}
        </div>
    );
};

export default ListBooks;
