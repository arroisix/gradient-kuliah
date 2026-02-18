import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetPublicListCourseClusterQuery } from "courses/redux/api/publicCourseApi";
import { useGetPrivateListCourseClusterQuery } from "courses/redux/api/privateCourseApi";
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
import CourseList from "courses/components/CourseEntrypoint/CourseList";
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { BiSearch } from 'react-icons/bi';
import Link from 'next/link';
import { MdFileDownload } from 'react-icons/md';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

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
    const [hasPassedSubscriptionBannerDelay, setHasPassedSubscriptionBannerDelay] = useState(false);
    const { tab: rawCurrentTab } = router.query as {
        tab?: string | string[];
    };
    const currentTab = Array.isArray(rawCurrentTab)
        ? rawCurrentTab[0]
        : rawCurrentTab;
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const {
        isLoading: isLoadingCourseSubscription,
        is_subscribed
    } = useCourseSubscription();

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
    } = useGetPublicListCourseClusterQuery(
        void 0,
        { skip: isAuthenticated }
    );
    const {
        data: privateCourseClusterData,
        isLoading: isLoadingPrivateCourseCluster
    } = useGetPrivateListCourseClusterQuery(
        void 0,
        { skip: !isAuthenticated }
    );
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
            skip: !router.isReady || !isAuthenticated
        }
    );

    const courseClusterData = isAuthenticated ? privateCourseClusterData : publicCourseClusterData;
    const isLoadingCourseCluster = isAuthenticated ? isLoadingPrivateCourseCluster : isLoadingPublicCourseCluster;
    const privateMajorPayload = privateMajorCourses as ListResponseData<CourseV3> & {
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

        if (!isAuthenticated || !majorCategory) {
            return clusterTabs;
        }

        return [
            { value: AUTH_MAJOR_TAB_VALUE, label: majorCategory },
            ...clusterTabs.filter((tab) => tab.value !== majorCategory)
        ];
    }, [courseClusterData, isAuthenticated, majorCategory]);

    const hasResolvedDefaultCategory = useMemo(() => {
        if (currentTab) return true;

        return isAuthenticated
            ? !!(majorCategory || courseClusterData?.data?.[0]?.name)
            : !!courseClusterData?.data?.[0]?.name;
    }, [currentTab, isAuthenticated, majorCategory, courseClusterData]);

    const activeCategory = useMemo(
        () =>
            currentTab ||
            (isAuthenticated
                ? courseTabs[0]?.value ||
                  majorCategory ||
                  (courseClusterData?.data?.[0]?.name ?? '')
                : (courseClusterData?.data?.[0]?.name ?? '')),
        [currentTab, isAuthenticated, courseTabs, majorCategory, courseClusterData]
    );
    const firstTabValue = courseTabs[0]?.value ?? '';
    const isMajorTabByName =
        !!majorCategory &&
        normalizeTabValue(activeCategory) === normalizeTabValue(majorCategory);
    const mappedCategory =
        isAuthenticated &&
        (activeCategory === AUTH_MAJOR_TAB_VALUE ||
            isMajorTabByName ||
            (!!firstTabValue && activeCategory === firstTabValue))
            ? ''
            : activeCategory;

    useEffect(() => {
        if (
            !router.isReady ||
            !isAuthenticated ||
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
    }, [
        router,
        isAuthenticated,
        currentTab,
        isMajorTabByName
    ]);
    const shouldUsePrivateMajorCourses = isAuthenticated && mappedCategory === '';

    const initialQueryArgs = useMemo(
        () => ({
            page: 1,
            limit: 8,
            category: mappedCategory,
            search: debouncedSearchTerm || undefined
        }),
        [mappedCategory, debouncedSearchTerm]
    );

    const { data: publicListCourses, isLoading: isLoadingPublicListCourses, isFetching: isFetchingPublicListCourses } = useGetPublicListCoursesV3Query(
        initialQueryArgs,
        {
            skip:
                !router.isReady ||
                isAuthenticated ||
                !hasResolvedDefaultCategory ||
                !mappedCategory
        }
    );
    const { data: privateListCourses, isLoading: isLoadingPrivateListCourses, isFetching: isFetchingPrivateListCourses } = useGetPrivateListCoursesV3Query(
        initialQueryArgs,
        {
            skip:
                !router.isReady ||
                !isAuthenticated ||
                !hasResolvedDefaultCategory ||
                shouldUsePrivateMajorCourses
        }
    );

    const [fetchPublicCourses, { isFetching: isFetchingMorePublicCourses }] =
        useLazyGetPublicListCoursesV3Query();
    const [fetchPrivateCourses, { isFetching: isFetchingMorePrivateCourses }] =
        useLazyGetPrivateListCoursesV3Query();

    const listCourses =
        (isAuthenticated
            ? shouldUsePrivateMajorCourses
                ? privateMajorCourses
                : privateListCourses
            : publicListCourses) ??
        (!isAuthenticated && !currentTab ? courses : undefined);
    const isLoadingCourses = isAuthenticated
        ? shouldUsePrivateMajorCourses
            ? isLoadingPrivateMajorCourses
            : isLoadingPrivateListCourses
        : isLoadingPublicListCourses;
    const isFetchingCourses =
        isAuthenticated
            ? shouldUsePrivateMajorCourses
                ? false
                : isFetchingPrivateListCourses
            : isFetchingPublicListCourses;
    const isFetchingMoreCourses = isAuthenticated
        ? isFetchingMorePrivateCourses
        : isFetchingMorePublicCourses;

    const [allCourses, setAllCourses] = useState<ListResponseData<CourseV3> | undefined>(
        listCourses
    );

    useEffect(() => {
        setAllCourses(listCourses);
    }, [listCourses, isAuthenticated, activeCategory]);

    const hasMore = useMemo(() => {
        if (!allCourses) return false;
        const loadedCount = allCourses.data?.length ?? 0;
        return !!allCourses.next_page && loadedCount < (allCourses.count_items ?? 0);
    }, [allCourses]);

    const loadMore = useCallback(async (): Promise<void> => {
        if (!hasMore || !allCourses?.next_page || isFetchingMoreCourses || !activeCategory) {
            return;
        }

        const nextPageArgs = {
            page: allCourses.next_page,
            limit: 8,
            category: mappedCategory,
            search: debouncedSearchTerm || undefined
        };

        const response = isAuthenticated
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
        mappedCategory,
        debouncedSearchTerm,
        isAuthenticated,
        fetchPrivateCourses,
        fetchPublicCourses
    ]);

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
                    if (entry.isIntersecting && hasMore && !isFetchingMoreCourses) {
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

    const isLoading = isLoadingCourseCluster || isLoadingCourses;
    
    return (
        <div className='w-full min-h-[calc(100vh-64px)] relative'>
            <div className='z-20 relative'>
                <div className='hidden lg:flex flex-row justify-between'>
                    <h1 className="text-white font-bold text-2xl leading-tight mb-6">
                        Kelas
                    </h1>

                    <div className='flex flex-row gap-4'>
                        <label className="flex items-center w-full gap-2 rounded-full input input-sm bg-[#333333] text-[#666666]">
                            <BiSearch size={20} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#222222] border-none focus:ring-0"
                                placeholder="Cari kelas"
                            />
                        </label>

                        <Link href="/kelas/downloads" className='w-[42px] h-[34px] bg-[#333333] rounded-full flex items-center justify-center'>
                            <MdFileDownload size={16} className='text-white' />
                        </Link>
                    </div>
                </div>

                <div className='lg:hidden flex flex-col gap-4 mb-6'>
                    <h1 className="text-white font-bold text-2xl leading-tight">
                        Kelas
                    </h1>

                    <div className='w-full'>
                        {isLoadingCourseCluster || !courseTabs.length ? (
                            <Skeleton className='w-full h-[46px]' />
                        ) : (
                            <CourseEntrypointTabs
                                tabs={courseTabs}
                                defaultTab={courseTabs[0].value}
                            />
                        )}
                    </div>

                    <div className='flex items-center gap-3'>
                        <label className="flex items-center flex-1 h-[38px] gap-2 px-3 rounded-full bg-[#222222] text-[#666666]">
                            <BiSearch size={20} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0"
                                placeholder="Cari kelas"
                            />
                        </label>

                        <Link href="/kelas/downloads" className='w-[38px] h-[38px] bg-[#333333] rounded-full flex items-center justify-center shrink-0'>
                            <MdFileDownload size={16} className='text-white' />
                        </Link>
                    </div>
                </div>
            </div>

            <div className='hidden lg:block w-full mb-6 z-10 relative'>
                {isLoadingCourseCluster || !courseTabs.length ? (
                    <Skeleton className='w-full h-[46px]' />
                ) : (
                    <CourseEntrypointTabs
                        tabs={courseTabs}
                        defaultTab={courseTabs[0].value}
                    />
                )}
            </div>

            <div className='w-full z-10 relative'>
                {isLoading || !allCourses || isFetchingCourses ? (
                    <Skeleton className={cn(
                        "w-full",
                        isLoadingCourseCluster ? "h-[calc(100vh-256px)]" : "h-[calc(100vh-268px)]"
                    )} />
                ) : (
                    <>
                        <CourseList courses={allCourses.data ?? []} />

                        {isFetchingMoreCourses && (
                            <div className='mt-8'>
                                <Skeleton className='w-full h-[calc(100vh-268px)]' />
                            </div>
                        )}

                        <div ref={anchorRef} className='h-1 w-full' />
                    </>
                )}
            </div>

            {!isLoadingCourseSubscription && !is_subscribed && hasPassedSubscriptionBannerDelay && (
                <>
                    <RenewSubscriptionBanner 
                        type='COLLEGE_STUDENT_V2'
                    />
                    {isAuthenticated && <div className="h-44 md:h-8 lg:h-10" />}
                </>
            )}

            <div className={
                cn(
                    "w-full aspect-[1023/459] z-0 absolute opacity-100 rotate-[-10.16deg] top-[-10vh] lg:top-[-20vh]",
                    isAuthenticated? "left-[-50px] md:left-[-100px] lg:left-[-100px] xl:left-[-450px]" : "left-[-50px] md:left-[-200px] lg:left-[-250px] xl:left-[-600px]"
                )
            }>
                <Image
                    src={`${CDN_URL}/assets/course-entrypoint-bg.png`}
                    alt="Course Entrypoint Background"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        </div>
    )
}

export default ClassContainer;