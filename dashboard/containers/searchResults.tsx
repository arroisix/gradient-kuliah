import Sort from 'commons/components/elements/Sort';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import ResultsTabs from 'dashboard/components/Search/SearchResults/ResultsTabs';
import SearchByCourse from 'dashboard/components/Search/SearchResults/SearchByCourse';
import { useRouter } from 'next/router';
import React from 'react';
import SearchResultsSection from '../components/Search/SearchResults/SearchResultsSection';
import { useSearchQuery } from 'commons/redux/api/searchApi';
import SearchResultsCarousel from 'dashboard/components/Search/SearchResults/SearchResultsCarousel';
import Paginator from 'commons/components/elements/Paginator';
import { cn } from 'commons/utils';

const SORT_OPTIONS = [
    { value: 'relevant', label: 'Paling Relevan' },
    { value: 'latest', label: 'Terakhir Dirilis' },
    { value: 'popular', label: 'Paling Populer' }
];

const SearchResults = ({
    results
}: {
    results?: SearchResults<SearchDocument>;
}): JSX.Element => {
    const router = useRouter();
    const {
        q,
        keywords,
        type,
        course,
        sort,
        page: pageParam
    } = router.query as {
        q: string;
        keywords?: string;
        type: string;
        course: string;
        sort: string;
        page: string;
    };
    const page = parseInt(pageParam ?? '1');
    const paginationParams =
        type === 'all'
            ? { page }
            : type === 'community'
            ? { primary_page: page }
            : {
                  primary_limit: 100,
                  secondary_page: page
              };

    const getTotalPages = (
        data: SearchResults<SearchDocument> | undefined
    ): number => {
        const resultObj = data?.results.slice(-1).pop();
        return Math.ceil((resultObj?.found ?? 0) / 10);
    };

    const {
        resultCarousel: resultCarouselQuery,
        result: resultQuery,
        totalPages: totalPagesQuery,
        isFetching
    } = useSearchQuery(
        {
            q,
            type,
            course,
            sort,
            ...paginationParams
        },
        {
            skip: !q,
            selectFromResult: ({ data, ...rest }) => ({
                ...rest,
                resultCarousel: data?.results?.[0],
                result: data?.results.slice(-1).pop(),
                totalPages: getTotalPages(data)
            })
        }
    );
    const resultCarousel = resultCarouselQuery ?? results?.results?.[0];
    const result = resultQuery ?? results?.results.slice(-1).pop();
    const totalPages = totalPagesQuery || getTotalPages(results);

    return (
        <div>
            <Breadcrumb nextItem={{ name: `"${keywords ?? q}"` }} />
            <ResultsTabs />
            <div className="flex w-full gap-4 py-2 md:w-max">
                <SearchByCourse />
                <Sort options={SORT_OPTIONS} defaultSelected="relevant" />
            </div>
            <SearchResultsCarousel
                result={resultCarousel}
                isLoading={router.isFallback || isFetching}
            />
            <SearchResultsSection
                result={result}
                isLoading={router.isFallback || isFetching}
            />
            <Paginator
                totalPages={totalPages}
                hasNextPage={page < totalPages}
                hasPreviousPage={page != 1}
                className={cn(
                    result?.found === 0 && 'hidden',
                    'justify-center'
                )}
                scroll
            />
        </div>
    );
};

export default SearchResults;
