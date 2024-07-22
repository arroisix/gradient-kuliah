import React from 'react';
import ProductCard from 'commons/components/elements/ProductCard';
import { getBookBaseHref } from 'courses/utils';
import Skeleton from 'commons/components/elements/Skeleton';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

type RelatedBooksSectionProps = {
    title: string;
    isLoading?: boolean;
    books?: Astronote[];
    orientation?: 'horizontal' | 'vertical';
};

const RelatedBooksSection = ({
    title,
    isLoading,
    books,
    orientation = 'vertical'
}: RelatedBooksSectionProps): JSX.Element => {
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    if (!isLoading && !books) return <></>;

    const getHref = (book: Astronote): string => {
        const baseHref = `${getBookBaseHref(book.category)}/${book.slug}`;

        if (book.category == 'Catatan') {
            return parseInt(book.latest_page ?? '0')
                ? `${baseHref}/${book.latest_page}`
                : baseHref;
        } else {
            return book.latest_problem !== '0'
                ? `${baseHref}/${book.latest_problem}`
                : baseHref;
        }
    };

    return (
        <div
            className={cn(
                'flex flex-col w-screen gap-6 px-4 lg:px-4 py-5 -ml-4 lg:ml-0 lg:w-full bg-graphite-900 lg:rounded-box xl:px-5 xl:py-6',
                isSubscribed && 'md:-ml-8 md:px-8',
                orientation === 'horizontal' &&
                    isSubscribed &&
                    'sm:-ml-8 md:w-full',
                orientation === 'vertical' &&
                    isSubscribed &&
                    'md:w-[calc(100vw-250px)]'
            )}>
            <h2 className="font-bold">{title}</h2>
            <div
                className={cn(
                    'grid gap-4',
                    orientation === 'vertical' ? 'grid-cols-1' : 'grid-cols-3'
                )}>
                {isLoading && (
                    <Skeleton
                        isCustomSize
                        repeat={3}
                        className="w-full rounded-lg h-28 animate-pulse"
                    />
                )}
                {books?.map((book) => (
                    <ProductCard
                        key={book.id}
                        orientation="horizontal"
                        href={getHref(book)}
                        category={book.category ?? ''}
                        eventName="Test"
                        product={{
                            title: book.title,
                            thumbnail: book.book_cover_url,
                            inProgress: book?.in_progress ?? false,
                            rating: book.rating,
                            latestProgress: book?.percentage_progress ?? 0,
                            latestChapter: book.last_chapter_read
                        }}
                        className="w-full"
                        imageClassname="min-w-16"
                    />
                ))}
            </div>
        </div>
    );
};

export default RelatedBooksSection;
