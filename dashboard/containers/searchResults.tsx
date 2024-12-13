import Sort from 'commons/components/elements/Sort';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import SearchResultsSection from '../components/Search/SearchResults/SearchResultsSection';
import { useSearchQuery } from 'commons/redux/api/searchApi';
import SearchResultsCarousel from 'dashboard/components/Search/SearchResults/SearchResultsCarousel';
import Paginator from 'commons/components/elements/Paginator';
import { cn } from 'commons/utils';
import SearchSummary from '../../copilot/components/SearchSummary/SearchSummary';
import CopilotEntrypoint from '../../copilot/components/CopilotEntrypoint';
import SearchByType from '../components/Search/SearchResults/SearchByType';

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
        !type || type === 'all'
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

    const [isSummaryEmpty, setIsSummaryEmpty] = useState(false);

    return (
        <div>
            <Breadcrumb nextItem={{ name: `"${keywords ?? q}"` }} />

            {isSummaryEmpty ? (
                <CopilotEntrypoint
                    text="Mau dapet jawaban yang
lebih akurat?"
                />
            ) : (
                <SearchSummary onSummaryFetched={setIsSummaryEmpty} />
            )}

            <div className="flex w-full gap-4 md:w-max">
                <SearchByType />
                <Sort
                    options={SORT_OPTIONS}
                    iconOnly
                    defaultSelected="relevant"
                />
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
                eventPayload={{
                    Keyword: keywords ?? q
                }}
            />
        </div>
    );
};

export default SearchResults;
