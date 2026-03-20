import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetPublicListCourseClusterQuery } from 'courses/redux/api/publicCourseApi';
import { useGetPrivateListCourseClusterQuery } from 'courses/redux/api/privateCourseApi';
import {
    getCurrentUser,
    getIsAuthenticated
} from 'authentication/redux/selectors/userSelector';
import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import Skeleton from 'commons/components/elements/Skeleton';
import CourseEntrypointTabs from 'courses/components/CourseEntrypoint/Tabs';
import { useRouter } from 'next/router';
import {
    useGetPublicListCoursesV3Query,
    useLazyGetPublicListCoursesV3Query
} from 'courses/redux/api/publicCourseV3Api';
import {
    useGetPrivateListCoursesV3Query,
    useLazyGetPrivateListCoursesV3Query
} from 'courses/redux/api/privateCourseV3Api';
import { cn } from 'commons/utils';
import CourseList from 'courses/components/CourseEntrypoint/CourseList';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { BiSearch } from 'react-icons/bi';
import Link from 'next/link';
import { MdClose, MdFileDownload } from 'react-icons/md';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useWindowSize } from 'usehooks-ts';

const AUTH_MAJOR_TAB_VALUE = '';
const normalizeTabValue = (value?: string): string =>
    (value ?? '').trim().toLowerCase();

const ClassContainer = ({
    courses
}: {
    courses: ListResponseData<CourseV3>;
}): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const currentUser = useSelector(getCurrentUser) as User & {
        major?: string;
        major_name?: string;
    };
    const { data: profile } = useGetProfileQuery(
        {},
        { skip: !isAuthenticated }
    );
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [
        hasPassedSubscriptionBannerDelay,
        setHasPassedSubscriptionBannerDelay
    ] = useState(false);
    const { tab: rawCurrentTab } = router.query as {
        tab?: string | string[];
    };
    const currentTab = Array.isArray(rawCurrentTab)
        ? rawCurrentTab[0]
        : rawCurrentTab;
    const isUserAuthenticated = isAuthenticated || !!currentUser?.id;
    const isSearching = debouncedSearchTerm.trim().length > 0;
    const hasSearchValue = searchTerm.trim().length > 0;
    const shouldUsePrivateSearch = isSearching && isUserAuthenticated;
    const usePrivateCoursesApi = isSearching
        ? shouldUsePrivateSearch
        : isUserAuthenticated;
    const { width } = useWindowSize();
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const { isLoading: isLoadingCourseSubscription, is_subscribed } =
        useCourseSubscription();

    const clearSearch = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [searchTerm]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setHasPassedSubscriptionBannerDelay(true);
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, []);

    const {
        data: publicCourseClusterData,
        isLoading: isLoadingPublicCourseCluster
    } = useGetPublicListCourseClusterQuery(void 0, {
        skip: isUserAuthenticated
    });
    const {
        data: privateCourseClusterData,
        isLoading: isLoadingPrivateCourseCluster
    } = useGetPrivateListCourseClusterQuery(void 0, {
        skip: !isUserAuthenticated
    });
    const {
        data: privateMajorCourses,
        isLoading: isLoadingPrivateMajorCourses
    } = useGetPrivateListCoursesV3Query(
        {
            page: 1,
            limit: 8,
            category: '',
            search: debouncedSearchTerm || undefined
        },
        {
            skip: !router.isReady || !isUserAuthenticated || isSearching
        }
    );

    const courseClusterData = isUserAuthenticated
        ? privateCourseClusterData
        : publicCourseClusterData;
    const isLoadingCourseCluster = isUserAuthenticated
        ? isLoadingPrivateCourseCluster
        : isLoadingPublicCourseCluster;
    const privateMajorPayload =
        privateMajorCourses as ListResponseData<CourseV3> & {
            major?: string;
            major_name?: string;
            user_major?: string;
            data?: Array<CourseV3 & { major?: string; major_name?: string }>;
        };
    const majorCategory =
        profile?.major ||
        privateMajorPayload?.major ||
        privateMajorPayload?.major_name ||
        privateMajorPayload?.user_major ||
        privateMajorPayload?.data?.[0]?.major ||
        privateMajorPayload?.data?.[0]?.major_name ||
        currentUser?.major ||
        currentUser?.major_name ||
        '';
    const courseTabs = useMemo(() => {
        const clusterTabs = (courseClusterData?.data ?? []).map((item) => ({
            value: item.name,
            label: item.name
        }));

        if (!isUserAuthenticated || !majorCategory) {
            return clusterTabs;
        }

        return [
            { value: AUTH_MAJOR_TAB_VALUE, label: majorCategory },
            ...clusterTabs.filter((tab) => tab.value !== majorCategory)
        ];
    }, [courseClusterData, isUserAuthenticated, majorCategory]);

    const hasResolvedDefaultCategory = useMemo(() => {
        if (currentTab) return true;

        return isUserAuthenticated
            ? !!(majorCategory || courseClusterData?.data?.[0]?.name)
            : !!courseClusterData?.data?.[0]?.name;
    }, [currentTab, isUserAuthenticated, majorCategory, courseClusterData]);

    const activeCategory = useMemo(
        () =>
            currentTab ||
            (isUserAuthenticated
                ? courseTabs[0]?.value ||
                  majorCategory ||
                  (courseClusterData?.data?.[0]?.name ?? '')
                : courseClusterData?.data?.[0]?.name ?? ''),
        [
            currentTab,
            isUserAuthenticated,
            courseTabs,
            majorCategory,
            courseClusterData
        ]
    );
    const firstTabValue = courseTabs[0]?.value ?? '';
    const isMajorTabByName =
        !!majorCategory &&
        normalizeTabValue(activeCategory) === normalizeTabValue(majorCategory);
    const mappedCategory =
        isUserAuthenticated &&
        (activeCategory === AUTH_MAJOR_TAB_VALUE ||
            isMajorTabByName ||
            (!!firstTabValue && activeCategory === firstTabValue))
            ? ''
            : activeCategory;

    useEffect(() => {
        if (
            !router.isReady ||
            !isUserAuthenticated ||
            !currentTab ||
            currentTab === AUTH_MAJOR_TAB_VALUE ||
            !isMajorTabByName
        ) {
            return;
        }

        router.replace(
            {
                query: {
                    ...router.query,
                    tab: AUTH_MAJOR_TAB_VALUE,
                    page: 1
                }
            },
            undefined,
            { shallow: true, scroll: false }
        );
    }, [router, isUserAuthenticated, currentTab, isMajorTabByName]);
    const shouldUsePrivateMajorCourses =
        isUserAuthenticated && !isSearching && mappedCategory === '';

    const initialQueryArgs = useMemo(
        () => ({
            page: 1,
            limit: 8,
            category: isSearching ? undefined : mappedCategory,
            search: debouncedSearchTerm || undefined
        }),
        [mappedCategory, debouncedSearchTerm, isSearching]
    );

    const {
        data: publicListCourses,
        isLoading: isLoadingPublicListCourses,
        isFetching: isFetchingPublicListCourses
    } = useGetPublicListCoursesV3Query(initialQueryArgs, {
        skip:
            !router.isReady ||
            isUserAuthenticated ||
            shouldUsePrivateSearch ||
            (!isSearching && !hasResolvedDefaultCategory) ||
            (!isSearching && !mappedCategory)
    });
    const {
        data: privateListCourses,
        isLoading: isLoadingPrivateListCourses,
        isFetching: isFetchingPrivateListCourses
    } = useGetPrivateListCoursesV3Query(initialQueryArgs, {
        skip:
            !router.isReady ||
            (isSearching ? !shouldUsePrivateSearch : !isUserAuthenticated) ||
            (!isSearching && !hasResolvedDefaultCategory) ||
            shouldUsePrivateMajorCourses
    });

    const [fetchPublicCourses, { isFetching: isFetchingMorePublicCourses }] =
        useLazyGetPublicListCoursesV3Query();
    const [fetchPrivateCourses, { isFetching: isFetchingMorePrivateCourses }] =
        useLazyGetPrivateListCoursesV3Query();

    const listCourses =
        (usePrivateCoursesApi
            ? shouldUsePrivateMajorCourses
                ? privateMajorCourses
                : privateListCourses
            : publicListCourses) ??
        (!isUserAuthenticated && !currentTab ? courses : undefined);
    const isLoadingCourses = usePrivateCoursesApi
        ? shouldUsePrivateMajorCourses
            ? isLoadingPrivateMajorCourses
            : isLoadingPrivateListCourses
        : isLoadingPublicListCourses;
    const isFetchingCourses = usePrivateCoursesApi
        ? shouldUsePrivateMajorCourses
            ? false
            : isFetchingPrivateListCourses
        : isFetchingPublicListCourses;
    const isFetchingMoreCourses = usePrivateCoursesApi
        ? isFetchingMorePrivateCourses
        : isFetchingMorePublicCourses;

    const [allCourses, setAllCourses] = useState<
        ListResponseData<CourseV3> | undefined
    >(listCourses);

    useEffect(() => {
        setAllCourses(listCourses);
    }, [listCourses, isUserAuthenticated, activeCategory]);

    const hasMore = useMemo(() => {
        if (!allCourses) return false;
        const loadedCount = allCourses.data?.length ?? 0;
        return (
            !!allCourses.next_page &&
            loadedCount < (allCourses.count_items ?? 0)
        );
    }, [allCourses]);

    const loadMore = useCallback(async (): Promise<void> => {
        if (!hasMore || !allCourses?.next_page || isFetchingMoreCourses) {
            return;
        }

        const nextPageArgs = {
            page: allCourses.next_page,
            limit: 8,
            category: isSearching ? undefined : mappedCategory,
            search: debouncedSearchTerm || undefined
        };

        const response = usePrivateCoursesApi
            ? await fetchPrivateCourses(nextPageArgs).unwrap()
            : await fetchPublicCourses(nextPageArgs).unwrap();

        setAllCourses((prev) => {
            if (!prev) return response;

            return {
                ...response,
                data: [...prev.data, ...response.data]
            };
        });
    }, [
        hasMore,
        allCourses,
        isFetchingMoreCourses,
        isSearching,
        mappedCategory,
        debouncedSearchTerm,
        usePrivateCoursesApi,
        fetchPrivateCourses,
        fetchPublicCourses
    ]);

    const groupedSearchCourses = useMemo(() => {
        if (!isSearching || !allCourses?.data?.length) return [];

        const groupedCourses = new Map<string, CourseV3[]>();

        allCourses.data.forEach((course) => {
            const clusters =
                Array.isArray(course.clusters) && course.clusters.length > 0
                    ? [...new Set(course.clusters)]
                    : ['Lainnya'];

            clusters.forEach((clusterName) => {
                if (!groupedCourses.has(clusterName)) {
                    groupedCourses.set(clusterName, []);
                }

                groupedCourses.get(clusterName)?.push(course);
            });
        });

        return Array.from(groupedCourses.entries()).map(
            ([cluster, courses]) => ({
                cluster,
                courses
            })
        );
    }, [isSearching, allCourses]);

    useEffect(() => {
        const anchorElement = anchorRef.current;

        if (
            !anchorElement ||
            typeof window === 'undefined' ||
            !(anchorElement instanceof Element) ||
            !('IntersectionObserver' in window)
        ) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        entry.isIntersecting &&
                        hasMore &&
                        !isFetchingMoreCourses
                    ) {
                        loadMore();
                    }
                });
            },
            { rootMargin: '220px' }
        );

        observer.observe(anchorElement);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, isFetchingMoreCourses, loadMore]);

    const isLoading =
        (isSearching ? false : isLoadingCourseCluster) || isLoadingCourses;

    return (
        <div className="w-full min-h-[calc(100vh-64px)] relative">
            <div className="z-20 relative">
                <div className="hidden lg:flex flex-row justify-between">
                    <h1 className="text-white font-bold text-2xl leading-tight mb-6">
                        Kelas
                    </h1>

                    <div className="flex flex-row gap-4">
                        <label className="flex items-center w-full gap-2 rounded-full input input-sm bg-[#333333] text-[#666666]">
                            <BiSearch size={20} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#222222] border-none focus:ring-0 text-white placeholder:text-[#666666]"
                                placeholder="Cari kelas"
                            />
                            <div className="h-[18px] w-[18px] shrink-0 flex items-center justify-center">
                                {hasSearchValue && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="text-[#B6A6F3] hover:text-white transition-colors"
                                        aria-label="Reset search">
                                        <MdClose size={18} />
                                    </button>
                                )}
                            </div>
                        </label>

                        <Link
                            href="/kelas/downloads"
                            className="w-[42px] h-[34px] bg-[#333333] rounded-full flex items-center justify-center">
                            <MdFileDownload size={16} className="text-white" />
                        </Link>
                    </div>
                </div>

                <div className="lg:hidden flex flex-col gap-4 mb-6">
                    <h1 className="text-white font-bold text-2xl leading-tight">
                        Kelas
                    </h1>

                    {!isSearching && (
                        <div className="w-full">
                            {isLoadingCourseCluster || !courseTabs.length ? (
                                <Skeleton className="w-full h-[46px]" />
                            ) : (
                                <CourseEntrypointTabs
                                    tabs={courseTabs}
                                    defaultTab={courseTabs[0].value}
                                />
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <label className="flex items-center flex-1 h-[38px] gap-2 px-3 rounded-full bg-[#222222] text-[#666666]">
                            <BiSearch size={20} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 text-white placeholder:text-[#666666]"
                                placeholder="Cari kelas"
                            />
                            <div className="h-[18px] w-[18px] shrink-0 flex items-center justify-center">
                                {hasSearchValue && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="text-[#B6A6F3] hover:text-white transition-colors"
                                        aria-label="Reset search">
                                        <MdClose size={18} />
                                    </button>
                                )}
                            </div>
                        </label>

                        <Link
                            href="/kelas/downloads"
                            className="w-[38px] h-[38px] bg-[#333333] rounded-full flex items-center justify-center shrink-0">
                            <MdFileDownload size={16} className="text-white" />
                        </Link>
                    </div>
                </div>
            </div>

            {!isSearching && (
                <div className="hidden lg:block w-full mb-6 z-10 relative">
                    {isLoadingCourseCluster || !courseTabs.length ? (
                        <Skeleton className="w-full h-[46px]" />
                    ) : (
                        <CourseEntrypointTabs
                            tabs={courseTabs}
                            defaultTab={courseTabs[0].value}
                        />
                    )}
                </div>
            )}

            <div className="w-full z-10 relative">
                {isLoading || !allCourses || isFetchingCourses ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 grid-rows-2 gap-6">
                        <Skeleton
                            repeat={
                                width < 1024
                                    ? 2
                                    : width < 1280
                                    ? 3
                                    : width < 1536
                                    ? 4
                                    : width < 1920
                                    ? 5
                                    : 6
                            }
                            className="w-full h-[calc(32vh)] md:h-[calc(60vh)] lg:h-[calc(38vh)] xl:h-[calc(42vh)] 2xl:h-[calc(38vh)] 3xl:h-[calc(34vh)]"
                        />
                    </div>
                ) : (
                    <>
                        {isSearching ? (
                            (allCourses.data?.length ?? 0) > 0 ? (
                                <div className="flex flex-col gap-6">
                                    <span className="text-[#999999] text-sm">
                                        Hasil pencarian untuk &quot;{searchTerm}
                                        &quot;
                                    </span>

                                    <div className="flex flex-col gap-6">
                                        {groupedSearchCourses.map((group) => (
                                            <div
                                                key={group.cluster}
                                                className="flex flex-col gap-4">
                                                <h2 className="text-white text-sm font-semibold">
                                                    {group.cluster}
                                                </h2>
                                                <CourseList
                                                    courses={group.courses}
                                                    highlightQuery={
                                                        debouncedSearchTerm
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-[calc(100vh-268px)] flex flex-col items-center justify-center gap-6">
                                    <div className="w-[120px] aspect-square relative">
                                        <Image
                                            src={`${CDN_URL}/assets/course-entrypoint-empty-state.png`}
                                            alt="Course Entrypoint Empty State"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h2 className="text-white text-xl font-bold text-center">
                                            Kelas Tidak Ditemukan
                                        </h2>
                                        <p className="text-[#999999] text-center">
                                            Coba gunakan kata kunci lain atau
                                            cari topik yang lebih umum.
                                        </p>
                                    </div>
                                </div>
                            )
                        ) : (
                            <CourseList courses={allCourses.data ?? []} />
                        )}

                        {isFetchingMoreCourses && (
                            <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 grid-rows-2 gap-6">
                                <Skeleton
                                    repeat={
                                        width < 1024
                                            ? 2
                                            : width < 1280
                                            ? 3
                                            : width < 1536
                                            ? 4
                                            : width < 1920
                                            ? 5
                                            : 6
                                    }
                                    className="w-full h-[calc(32vh)] md:h-[calc(60vh)] lg:h-[calc(38vh)] xl:h-[calc(42vh)] 2xl:h-[calc(38vh)] 3xl:h-[calc(34vh)]"
                                />
                            </div>
                        )}

                        <div ref={anchorRef} className="h-1 w-full" />
                    </>
                )}
            </div>

            {!isLoadingCourseSubscription &&
                !is_subscribed &&
                hasPassedSubscriptionBannerDelay && (
                    <>
                        <RenewSubscriptionBanner type="COLLEGE_STUDENT_V2" />
                        {isAuthenticated && (
                            <div className="h-[18vh] md:h-[12vh] lg:h-[10vh]" />
                        )}
                    </>
                )}

            <div
                className={cn(
                    'w-full aspect-[1023/459] z-0 absolute opacity-40 rotate-[-10.16deg] top-[-10vh] lg:top-[-20vh]',
                    isAuthenticated
                        ? 'left-[-50px] md:left-[-100px] lg:left-[-100px] xl:left-[-450px]'
                        : 'left-[-50px] md:left-[-200px] lg:left-[-250px] xl:left-[-600px]'
                )}>
                <Image
                    src={`${CDN_URL}/assets/course-entrypoint-bg.png`}
                    alt="Course Entrypoint Background"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        </div>
    );
};

export default ClassContainer;
