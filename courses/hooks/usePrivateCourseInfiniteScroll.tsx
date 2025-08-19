import { useCallback, useEffect, useRef, useState } from 'react';
import {
    useGetPrivateListCoursesV2Query,
    useLazyGetPrivateListCoursesV2Query
} from 'courses/redux/api/privateCourseV2Api';

type Params = Omit<FilterCourseQueryParams, 'page' | 'limit'> & {
    page?: number;
    limit?: number;
    search?: string;
};

const DEFAULT_LIMIT = 6;

const usePrivateCourseInfiniteScroll = (
    params: Params,
    options?: { skip?: boolean }
): BaseInfiniteScrollHook<Course> & { hasMore: boolean } => {
    const page1Params = {
        ...params,
        page: 1,
        limit: params.limit ?? DEFAULT_LIMIT
    };

    // initial private query — respect skip (e.g. unauthenticated)
    const { data: initialData, isLoading: isInitialLoading } =
        useGetPrivateListCoursesV2Query(page1Params, {
            skip: !!options?.skip
        });

    const [
        fetchNext,
        { data: nextPageData, isLoading: isNextLoading, isFetching }
    ] = useLazyGetPrivateListCoursesV2Query();

    const anchor = useRef<HTMLDivElement | null>(null);
    const [allData, setAllData] = useState<
        ListResponseData<Course> | undefined
    >(initialData);
    const [hasMore, setHasMore] = useState(false);
    const isLoading = isNextLoading || isFetching;

    // if skipped, return a stable empty shape (anchor still usable)
    useEffect(() => {
        setAllData(initialData);
    }, [initialData]);

    useEffect(() => {
        if (!nextPageData) return;
        setAllData((prev) => {
            if (!prev) return nextPageData;
            return {
                count_items: nextPageData.count_items,
                previous_page: prev.previous_page,
                next_page: nextPageData.next_page,
                data: [...prev.data, ...nextPageData.data]
            } as ListResponseData<Course>;
        });
    }, [nextPageData]);

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
        } as FilterCourseQueryParams);
    }, [allData, fetchNext, params]);

    // intersection observer (guarded)
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
                // ignore
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

export default usePrivateCourseInfiniteScroll;
