import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetEntrypointBooksQuery } from 'courses/redux/api/astronotesApi';
import { getBookBaseHref } from 'courses/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from 'commons/components/elements/ProductCard';

const ContinueReadingSection = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    const { data: astronotes, isLoading } = useGetEntrypointBooksQuery(
        { limit: 10 },
        { skip: !isAuthenticated }
    );
    const { isMobileBreakpoints } = useWindowBreakpoints();

    if (
        isLoading ||
        !astronotes ||
        !astronotes?.data?.some(
            (book) => book.in_progress && book.percentage_progress !== 100
        )
    )
        return <></>;

    const getHref = (book: Astronote): string => {
        return `${getBookBaseHref(book.category_name)}/${book.slug}/${
            book.category_name === 'Catatan'
                ? book.latest_page
                : book.latest_problem
        }`;
    };

    const getProduct = (book: Astronote): Product => ({
        title: book.title,
        thumbnail: book.book_cover_url,
        inProgress: book?.in_progress ?? false,
        latestProgress: book?.percentage_progress ?? 0,
        latestChapter: book.last_chapter_read,
        authors: book.authors,
        rating: book.rating
    });

    return (
        <div className="relative pt-6 pb-4 mb-6 sm:pb-6 space-y-4 z-[1] overflow-x-visible">
            <div className="absolute h-full -z-[1] -inset-x-full bg-neutral-900 top-0 "></div>
            <b>Terakhir Dibaca</b>
            <div
                className={cn(
                    'w-screen relative gap-4 carousel carousel-center right-4 md:right-8 lg:right-12',
                    isSubscribed
                        ? 'md:w-[calc(100vw-250px)] min-[1786px]:-inset-x-[calc((100vw-250px-1536px)/2)]'
                        : 'md:w-screen min-[1786px]:-inset-x-[calc((100vw-1536px)/2)]'
                )}>
                {astronotes.data.flatMap((book) =>
                    book.in_progress && book.percentage_progress !== 100 ? (
                        <div
                            className={cn(
                                'carousel-item first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8 lg:first:ml-12 lg:last:mr-12',
                                isSubscribed
                                    ? 'min-[1786px]:first:ml-[calc((100vw-250px-1536px)/2)] min-[1786px]:last:mr-[calc((100vw-250px-1536px)/2)]'
                                    : 'min-[1786px]:first:ml-[calc((100vw-1536px)/2)] min-[1786px]:last:mr-[calc((100vw-1536px)/2)]'
                            )}>
                            <ProductCard
                                key={book.id}
                                href={getHref(book)}
                                orientation={
                                    isMobileBreakpoints
                                        ? 'vertical'
                                        : 'horizontal'
                                }
                                category={book.category_name}
                                product={getProduct(book)}
                                className={cn(
                                    isMobileBreakpoints
                                        ? 'w-48'
                                        : 'flex-none w-[348px]'
                                )}
                                eventName="Click Book Item on Library Page"
                                eventPayload={{ 'Book Slug': book.slug }}
                                imageClassname="sm:min-w-20"
                            />
                        </div>
                    ) : (
                        []
                    )
                )}
            </div>
        </div>
    );
};

export default ContinueReadingSection;
