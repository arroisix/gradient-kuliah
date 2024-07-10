import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetEntrypointBooksQuery } from 'courses/redux/api/astronotesApi';
import { getBookBaseHref } from 'courses/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { AstronoteBookCard } from '../AstronoteBook';

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

    return (
        <div className="relative pt-6 pb-4 mb-6 sm:pb-6 space-y-4 z-[1] overflow-x-visible">
            <div className="absolute h-full -z-[1] -inset-x-full bg-neutral-900 top-0 "></div>
            <b>Terakhir Dibaca</b>
            <div
                className={cn(
                    'w-screen relative gap-4 carousel carousel-center right-4 md:right-8 lg:right-24',
                    isSubscribed
                        ? 'md:w-[calc(100vw-250px)] min-[1786px]:-inset-x-[calc((100vw-250px-1536px)/2)]'
                        : 'md:w-screen min-[1786px]:-inset-x-[calc((100vw-1536px)/2)]'
                )}>
                {astronotes.data.flatMap((book) =>
                    book.in_progress && book.percentage_progress !== 100 ? (
                        <div
                            className={cn(
                                'carousel-item first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8 lg:first:ml-24 lg:last:mr-24',
                                isSubscribed
                                    ? 'min-[1786px]:first:ml-[calc((100vw-250px-1536px)/2)] min-[1786px]:last:mr-[calc((100vw-250px-1536px)/2)]'
                                    : 'min-[1786px]:first:ml-[calc((100vw-1536px)/2)] min-[1786px]:last:mr-[calc((100vw-1536px)/2)]'
                            )}>
                            <AstronoteBookCard
                                orientation={
                                    isMobileBreakpoints
                                        ? 'vertical'
                                        : 'horizontal'
                                }
                                className={cn(
                                    !isMobileBreakpoints &&
                                        'flex-none w-[348px]'
                                )}
                                imageClassname="min-w-20 min-h-24"
                                href={`${getBookBaseHref(book.category_name)}/${
                                    book.slug
                                }/${
                                    book.category === 'Catatan'
                                        ? book.latest_page
                                        : book.latest_problem
                                }`}
                                key={book.id}
                                {...book}
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
