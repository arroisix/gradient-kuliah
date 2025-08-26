import Skeleton from 'commons/components/elements/Skeleton';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useRouter } from 'next/router';
import EmptyCourse from './EmptyCourse';
// import Paginator from 'commons/components/elements/Paginator';
import ProductCard from 'commons/components/elements/ProductCard';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useEffect, useRef } from 'react';
import { Header } from './CourseTabHeader';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import ContentCard from 'dashboard/components/ContentCard';
import usePrivateCourseInfiniteScroll from 'courses/hooks/usePrivateCourseInfiniteScroll';
import usePublicCourseInfiniteScroll from 'courses/hooks/usePublicCourseInfiniteScroll';

const VALID_SECTION = [
    'all',
    'newly-released',
    'coming-soon',
    'trending',
    'for-you',
    'for-you-new-release',
    'my-class'
];
const VALID_SORT = ['latest', 'popularity', 'lexicography'];
const PAGE_SIZE = 6;
type CourseQueryParams = Omit<FilterCourseQueryParams, 'section'> & {
    tab?: string;
};

export const CourseList = ({
    isLoading,
    courses,
    section,
    bottomLoading,
    anchor
}: {
    isLoading?: boolean;
    courses?: ListResponseData<Course>;
    section?: string;
    bottomLoading?: boolean;
    anchor?: React.MutableRefObject<HTMLDivElement>;
}): JSX.Element => {
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    // const totalPages = Math.ceil((courses?.count_items ?? 0) / PAGE_SIZE);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const coursesMeta = courses as
        | (ListResponseData<Course> & { major?: string })
        | undefined;
    if (isLoading)
        return (
            <div
                className={cn(
                    'grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6',
                    !isSubscribed && 'lg:grid-cols-3'
                )}>
                <Skeleton repeat={6} className="w-full h-56 !mb-0" />
            </div>
        );

    if (!isLoading && courses && courses.data.length == 0)
        return <EmptyCourse />;

    const getProduct = (course: Course): Product => ({
        title: course.course_name,
        thumbnail: course.thumbnail,
        inProgress: false,
        latestProgress: 0,
        isComingSoon: course?.is_coming_soon,
        isNew: course?.is_new,
        isFree: course?.is_free
    });

    const getHref = (course: Course): string => {
        if (course.is_coming_soon && !course.slug) return '';
        if (course.is_only_notebook) return `/kelas/${course.slug}/astronotes`;
        return `/kelas/${course.slug}`;
    };

    return (
        <>
            {section === 'trending' && (
                <div className="mt-6">
                    <Header
                        title={
                            isAuthenticated
                                ? `Kelas Favorit Mahasiswa ${
                                      coursesMeta?.major || 'Jurusanmu'
                                  }`
                                : 'Paling Banyak Dipelajari'
                        }
                    />
                </div>
            )}
            <div
                className={cn(
                    'grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6',
                    !isSubscribed && 'lg:grid-cols-3'
                )}>
                {courses?.data.map((course: Course) => {
                    const href = getHref(course);
                    if (section === 'trending') {
                        return (
                            <ProductCard
                                key={course.id}
                                heading="h2"
                                orientation="vertical"
                                category="kelas"
                                eventName="Click Class Card"
                                href={href}
                                product={getProduct(course)}
                                isTrending={true}
                            />
                        );
                    }

                    return (
                        <ProductCard
                            key={course.id}
                            heading="h2"
                            orientation="vertical"
                            category="kelas"
                            eventName="Click Class Card"
                            href={href}
                            product={getProduct(course)}
                        />
                    );
                })}
            </div>
            {bottomLoading && (
                <Skeleton repeat={6} className="w-full h-56 !mb-0" />
            )}
            {anchor && <div ref={anchor} />}
            {/* <Paginator
                totalPages={totalPages}
                hasNextPage={!!courses?.next_page}
                hasPreviousPage={!!courses?.previous_page}
                className="justify-center w-full pb-8"
            /> */}
        </>
    );
};

export const PublicCourseList = ({
    courses: ssrCourses,
    search
}: {
    courses: ListResponseData<Course>;
    search?: string;
}): JSX.Element => {
    const router = useRouter();
    const { tab: section, sort, page } = router.query as CourseQueryParams;

    const prevSearchRef = useRef(search);

    useEffect(() => {
        if (search !== prevSearchRef.current) {
            prevSearchRef.current = search;
            router.push({ query: { ...router.query, page: '1' } }, undefined, {
                shallow: true
            });
        }
    }, [search, router]);

    const publicInfiniteParams = {
        section: VALID_SECTION.includes(section ?? '') ? section : 'all',
        sort: VALID_SORT.includes(sort ?? '')
            ? sort
            : section === 'trending'
            ? 'popularity'
            : 'latest',
        search,
        limit: PAGE_SIZE
    } as Omit<FilterCourseQueryParams, 'page'>;

    const {
        allData: publicAllData,
        isAllLoading: publicIsAllLoading,
        isLoading: publicIsLoading,
        anchor: publicAnchor
    } = usePublicCourseInfiniteScroll(publicInfiniteParams);

    const {
        data: queriedCourses,
        isLoading,
        isFetching
    } = useGetPublicListCoursesV2Query(
        {
            section: VALID_SECTION.includes(section ?? '') ? section : 'all',
            sort: VALID_SORT.includes(sort ?? '')
                ? sort
                : section === 'trending'
                ? 'popularity'
                : 'latest',
            page: parseInt(page ?? '1'),
            limit: section === 'trending' ? 8 : PAGE_SIZE,
            search
        },
        {
            skip: (section ?? '') === 'coming-soon'
        }
    );
    const courses = queriedCourses ?? ssrCourses;

    if ((section ?? '') === 'coming-soon') {
        return (
            <>
                <CourseList
                    courses={publicAllData}
                    isLoading={publicIsAllLoading}
                    section={section}
                    bottomLoading={publicIsLoading && !publicIsAllLoading}
                    anchor={publicAnchor}
                />
            </>
        );
    }

    return (
        <CourseList
            courses={courses}
            isLoading={!isLoading && isFetching}
            section={section}
        />
    );
};

export const PrivateCourseList = ({
    search
}: {
    search?: string;
}): JSX.Element => {
    const router = useRouter();
    const { tab: section, sort, page } = router.query as CourseQueryParams;

    const prevSearchRef = useRef(search);

    useEffect(() => {
        if (search !== prevSearchRef.current) {
            prevSearchRef.current = search;
            router.push({ query: { ...router.query, page: '1' } }, undefined, {
                shallow: true
            });
        }
    }, [search, router]);

    const myClassParams = {
        section: 'my-class',
        sort: VALID_SORT.includes(sort ?? '') ? sort : 'latest',
        search,
        limit: PAGE_SIZE
    } as Omit<FilterCourseQueryParams, 'page'>;

    // Always call the infinite scroll hook, but skip when not viewing "my-class"
    const {
        allData,
        isAllLoading,
        isLoading: isMoreLoading,
        anchor
    } = usePrivateCourseInfiniteScroll(myClassParams, {
        skip: (section ?? '') !== 'my-class'
    });

    // params for general/private list query
    const generalParams = {
        section: VALID_SECTION.includes(section ?? '') ? section : 'all',
        sort: VALID_SORT.includes(sort ?? '')
            ? sort
            : section === 'trending'
            ? 'popularity'
            : 'latest',
        page: parseInt(page ?? '1'),
        limit: section === 'trending' ? 8 : PAGE_SIZE,
        search
    } as FilterCourseQueryParams;

    // Always call the query hook too, but skip it when we're on "my-class"
    const {
        isLoading,
        isFetching,
        data: courses
    } = useGetPrivateListCoursesV2Query(generalParams, {
        refetchOnMountOrArgChange: true,
        skip: (section ?? '') === 'my-class'
    });

    if (section === 'my-class') {
        return (
            <>
                <CourseList
                    courses={allData}
                    isLoading={!!isAllLoading}
                    section={section}
                    bottomLoading={isMoreLoading && !isAllLoading}
                    anchor={anchor}
                />
            </>
        );
    }

    return (
        <CourseList
            courses={courses}
            isLoading={!isLoading && isFetching}
            section={section}
        />
    );
};
