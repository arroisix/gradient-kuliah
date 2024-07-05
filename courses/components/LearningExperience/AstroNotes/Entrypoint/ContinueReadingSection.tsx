import React from 'react';
import { AstronoteBookCard } from '../AstronoteBook';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { useGetEntrypointBooksQuery } from 'courses/redux/api/astronotesApi';
import { useSelector } from 'react-redux';
import { getBookBaseHref } from 'courses/utils';

const ContinueReadingSection = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: astronotes, isLoading } = useGetEntrypointBooksQuery(
        { limit: 10 },
        { skip: !isAuthenticated }
    );
    const { isMobileBreakpoints } = useWindowBreakpoints();

    if (
        isLoading ||
        !astronotes ||
        !astronotes?.books.some(
            (book) => book.in_progress && book.percentage_progress !== 100
        )
    )
        return <></>;

    return (
        <div className="relative pt-6 pb-4 mb-6 sm:pb-6 space-y-4 z-[1] overflow-x-visible">
            <div className="absolute h-full -z-[1] -inset-x-full bg-neutral-900 top-0 "></div>
            <b>Terakhir Dibaca</b>
            <div className="w-screen relative md:w-[calc(100vw-250px)] gap-4 carousel carousel-center right-4 md:right-8 xl:right-12 2xl:-inset-x-[calc((100vw-250px-1536px)/2)]">
                {astronotes.books.flatMap((book) =>
                    book.in_progress && book.percentage_progress !== 100 ? (
                        <div className="carousel-item first:ml-4 last:mr-4 md:first:ml-8 md:last:mr-8 xl:first:ml-12 xl:last:mr-12 2xl:first:ml-[calc((100vw-250px-1536px)/2)] 2xl:last:mr-[calc((100vw-250px-1536px)/2)]">
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
