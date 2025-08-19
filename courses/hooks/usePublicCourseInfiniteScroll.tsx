import { useCallback, useEffect, useRef, useState } from 'react';
import {
    useGetPublicListCoursesV2Query,
    useLazyGetPublicListCoursesV2Query
} from 'courses/redux/api/publicCourseV2Api';

type Params = Omit<FilterCourseQueryParams, 'page' | 'limit'> & {
    page?: number;
    limit?: number;
    search?: string;
};

const DEFAULT_LIMIT = 6;

const usePublicCourseInfiniteScroll = (
    params: Params
): BaseInfiniteScrollHook<Course> & { hasMore: boolean } => {
    const page1Params = {
        ...params,
        page: 1,
        limit: params.limit ?? DEFAULT_LIMIT
    };
    const { data: initialData, isLoading: isInitialLoading } =
        useGetPublicListCoursesV2Query(page1Params);

    const [
        fetchNext,
        { data: nextPageData, isLoading: isNextLoading, isFetching }
    ] = useLazyGetPublicListCoursesV2Query();

    const anchor = useRef<HTMLDivElement | null>(null);
    const [allData, setAllData] = useState<
        ListResponseData<Course> | undefined
    >(initialData);
    const [hasMore, setHasMore] = useState(false);
    const isLoading = isNextLoading || isFetching;

    // initialize / replace when initial data changes (e.g. new search/section)
    useEffect(() => {
        setAllData(initialData);
    }, [initialData]);

    // append next page when it arrives
    useEffect(() => {
        if (!nextPageData) return;
        setAllData((prev) => {
            if (!prev) return nextPageData;
            const mergedData = {
                count_items: nextPageData.count_items,
                previous_page: prev.previous_page,
                next_page: nextPageData.next_page,
                data: [...prev.data, ...nextPageData.data]
            } as ListResponseData<Course>;
            return mergedData;
        });
    }, [nextPageData]);

    // hasMore logic
    useEffect(() => {
        if (!allData) {
            setHasMore(false);
            return;
        }
        const loadedCount = allData.data?.length ?? 0;
        setHasMore(
            allData.next_page !== null &&
                loadedCount < (allData.count_items ?? 0)
        );
    }, [allData]);

    const loadMore = useCallback((): void => {
        if (!allData?.next_page) return;
        fetchNext({
            ...params,
            page: allData.next_page,
            limit: params.limit ?? DEFAULT_LIMIT
        });
    }, [allData, fetchNext, params]);

    // intersection observer to auto load when anchor is visible
    useEffect(() => {
        const el = anchor.current;
        if (
            !el ||
            typeof window === 'undefined' ||
            !('IntersectionObserver' in window) ||
            !(el instanceof Element)
        )
            return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && hasMore && !isLoading) {
                        loadMore();
                    }
                });
            },
            { rootMargin: '200px' }
        );

        observer.observe(el);
        return () => {
            try {
                observer.unobserve(el);
            } catch (e) {
                // ignore if already disconnected
            }
            observer.disconnect();
        };
    }, [hasMore, isLoading, loadMore]);

    return {
        allData,
        isAllLoading: isInitialLoading,
        isLoading: isInitialLoading || isLoading,
        anchor,
        loadMore,
        hasMore
    };
};

export default usePublicCourseInfiniteScroll;
