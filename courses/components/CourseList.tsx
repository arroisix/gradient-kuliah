import Skeleton from 'commons/components/elements/Skeleton';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useRouter } from 'next/router';
import EmptyCourse from './EmptyCourse';
import Paginator from 'commons/components/elements/Paginator';
import ProductCard from 'commons/components/elements/ProductCard';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useEffect, useRef } from 'react';
import { Header } from './CourseTabHeader';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

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
    section
}: {
    isLoading?: boolean;
    courses?: ListResponseData<Course>;
    section?: string;
}): JSX.Element => {
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    const totalPages = Math.ceil((courses?.count_items ?? 0) / PAGE_SIZE);
    const isAuthenticated = useSelector(getIsAuthenticated);
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
                                      courses?.major || 'Jurusanmu'
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
                {courses?.data.map((course: Course) => (
                    <ProductCard
                        key={course.id}
                        heading="h2"
                        orientation="vertical"
                        category="kelas"
                        eventName="Click Class Card"
                        href={getHref(course)}
                        product={getProduct(course)}
                    />
                ))}
            </div>
            {!['trending', 'for-you', 'for-you-new-release'].includes(
                section ?? ''
            ) && (
                <Paginator
                    totalPages={totalPages}
                    hasNextPage={!!courses?.next_page}
                    hasPreviousPage={!!courses?.previous_page}
                    className="justify-center w-full pb-8"
                />
            )}
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

    const {
        data: queriedCourses,
        isLoading,
        isFetching
    } = useGetPublicListCoursesV2Query({
        section: VALID_SECTION.includes(section ?? '') ? section : 'all',
        sort: VALID_SORT.includes(sort ?? '')
            ? sort
            : section === 'trending'
            ? 'popularity'
            : 'latest',
        page: parseInt(page ?? '1'),
        limit: section === 'trending' ? 8 : PAGE_SIZE,
        search
    });
    const courses = queriedCourses ?? ssrCourses;

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

    const {
        isLoading,
        isFetching,
        data: courses
    } = useGetPrivateListCoursesV2Query(
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
        } as FilterCourseQueryParams,
        { refetchOnMountOrArgChange: true }
    );

    return (
        <CourseList
            courses={courses}
            isLoading={!isLoading && isFetching}
            section={section}
        />
    );
};
