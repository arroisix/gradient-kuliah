import Sort from 'commons/components/elements/Sort';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
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
        page: pageParam,
        locked,
        from_search_bar
    } = router.query as {
        q: string;
        keywords?: string;
        type: string;
        course: string;
        sort: string;
        page: string;
        locked?: string;
        from_search_bar?: string;
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

    // Add reclassify parameter when search comes from search bar
    const searchParams = {
        q,
        type,
        course,
        sort,
        ...paginationParams,
        // Only reclassify if it's from search bar and no type is locked
        reclassify: from_search_bar === 'true' && !locked
    };

    const {
        resultCarousel: resultCarouselQuery,
        result: resultQuery,
        totalPages: totalPagesQuery,
        detectedType: detectedType,
        isFetching
    } = useSearchQuery(searchParams, {
        skip: !q,
        selectFromResult: ({ data, ...rest }) => ({
            ...rest,
            resultCarousel: data?.results?.[0],
            result: data?.results.slice(-1).pop(),
            totalPages: getTotalPages(data),
            detectedType: data?.detected_type
        })
    });

    const resultCarousel = resultCarouselQuery ?? results?.results?.[0];
    const result = resultQuery ?? results?.results.slice(-1).pop();
    const totalPages = totalPagesQuery || getTotalPages(results);

    const [isSummaryEmpty, setIsSummaryEmpty] = useState(false);

    const prevQRef = useRef<string | undefined>(undefined);
    const [hasRedirected, setHasRedirected] = useState(false);
    const lastClassifiedQRef = useRef<string | null>(null);

    const isInitialReclassificationFlow =
        from_search_bar === 'true' && !locked && (!type || type === 'all');

    const awaitingRedirect =
        !!detectedType &&
        detectedType !== 'all' &&
        router.query.type !== detectedType;

    // While waiting for classification (and not resolved to 'all'), defer showing result UI
    const shouldDeferUI =
        isInitialReclassificationFlow &&
        (isFetching || !detectedType || awaitingRedirect);

    useEffect(() => {
        if (!isFetching && detectedType) {
            // Update which query this detectedType belongs to once fetch completes
            lastClassifiedQRef.current = q;
        }
    }, [isFetching, detectedType, q]);

    // Track query changes but don't clean from_search_bar immediately
    useEffect(() => {
        if (!q) return;

        const prevQ = prevQRef.current;
        if (prevQ !== undefined && prevQ !== q) {
            // Reset redirect flag for new query
            setHasRedirected(false);
        }
        prevQRef.current = q;
    }, [q]);

    // Update URL with detected type when reclassification happens
    useEffect(() => {
        const currentType = router.query.type as string | undefined;
        const currentLocked = router.query.locked;
        const fromSearchBar = router.query.from_search_bar;

        if (
            !isFetching &&
            lastClassifiedQRef.current === q &&
            detectedType &&
            detectedType !== 'all' &&
            detectedType !== currentType &&
            q &&
            fromSearchBar === 'true' &&
            !currentLocked &&
            !hasRedirected // Prevent multiple redirects
        ) {
            router.replace(
                {
                    query: {
                        ...router.query,
                        type: detectedType,
                        page: 1,
                        locked: 1,
                        from_search_bar: undefined // Remove the flag
                    }
                },
                undefined,
                { shallow: true }
            );
            setHasRedirected(true);
        } else if (
            !isFetching &&
            detectedType === 'all' &&
            fromSearchBar === 'true'
        ) {
            // No redirection needed; allow UI render
            setHasRedirected(true);
        }
    }, [detectedType, q, router, hasRedirected, isFetching]);

    // Clean from_search_bar flag when no reclassification is needed
    useEffect(() => {
        const fromSearchBar = router.query.from_search_bar;
        const currentType = router.query.type as string | undefined;

        // If we have a response and detected type is 'all', or if type already matches, clean the flag
        if (
            !isFetching &&
            lastClassifiedQRef.current === q &&
            fromSearchBar === 'true' &&
            detectedType &&
            (detectedType === 'all' || detectedType === currentType) &&
            !hasRedirected
        ) {
            const { ...data } = router.query;
            router.replace({ query: data }, undefined, { shallow: true });
        }
    }, [detectedType, router, hasRedirected]);

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
                {shouldDeferUI ? (
                    <div className="h-[42px] w-52 bg-[#2C2C2C] rounded-full animate-pulse" />
                ) : (
                    <SearchByType />
                )}
                <Sort
                    options={SORT_OPTIONS}
                    iconOnly
                    defaultSelected="relevant"
                    className={
                        shouldDeferUI ? 'opacity-0 pointer-events-none' : ''
                    }
                />
            </div>
            <SearchResultsCarousel
                result={resultCarousel}
                isLoading={router.isFallback || isFetching || shouldDeferUI}
            />
            <SearchResultsSection
                result={result}
                isLoading={router.isFallback || isFetching || shouldDeferUI}
            />
            {!shouldDeferUI && (
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
            )}
        </div>
    );
};

export default SearchResults;
