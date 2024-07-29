import Skeleton from 'commons/components/elements/Skeleton';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useRouter } from 'next/router';
import EmptyCourse from './EmptyCourse';
import Paginator from 'commons/components/elements/Paginator';
import ProductCard from 'commons/components/elements/ProductCard';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const VALID_SECTION = ['all', 'newly-released', 'coming-soon'];
const VALID_SORT = ['latest', 'popularity', 'lexicography'];
const PAGE_SIZE = 6;
type CourseQueryParams = Omit<FilterCourseQueryParams, 'section'> & {
    tab?: string;
};

const CourseList = ({
    isLoading,
    courses
}: {
    isLoading?: boolean;
    courses?: ListResponseData<Course>;
}): JSX.Element => {
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    const totalPages = Math.ceil((courses?.count_items ?? 0) / PAGE_SIZE);
    if (isLoading)
        return (
            <div className="grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                <Skeleton repeat={6} className="w-full h-56 !mb-0" />
            </div>
        );

    if (!isLoading && courses && courses.data.length == 0)
        return <EmptyCourse />;

    const getProduct = (course: Course): Product => ({
        title: course.course_name,
        thumbnail: course.thumbnail,
        inProgress: false,
        latestProgress: 0
    });

    const getHref = (course: Course): string => {
        if (course.is_coming_soon && !course.slug) return '';
        if (course.is_only_notebook) return `/kelas/${course.slug}/astronotes`;
        return `/kelas/${course.slug}`;
    };

    return (
        <>
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
            <Paginator
                totalPages={totalPages}
                hasNextPage={!!courses?.next_page}
                hasPreviousPage={!!courses?.previous_page}
                className="justify-center w-full pb-8"
            />
        </>
    );
};

export const PublicCourseList = ({
    courses: ssrCourses
}: {
    courses: ListResponseData<Course>;
}): JSX.Element => {
    const router = useRouter();
    const { tab: section, sort, page } = router.query as CourseQueryParams;
    const { data: queriedCourses } = useGetPublicListCoursesV2Query({
        section: VALID_SECTION.includes(section ?? '') ? section : 'all',
        sort: VALID_SORT.includes(sort ?? '') ? sort : 'latest',
        page: parseInt(page ?? '1'),
        limit: PAGE_SIZE
    });
    const courses = queriedCourses ?? ssrCourses;

    return <CourseList courses={courses} />;
};

export const PrivateCourseList = (): JSX.Element => {
    const router = useRouter();
    const { tab: section, sort, page } = router.query as CourseQueryParams;

    const { isLoading, data: courses } = useGetPrivateListCoursesV2Query(
        {
            section: VALID_SECTION.includes(section ?? '') ? section : 'all',
            sort: VALID_SORT.includes(sort ?? '') ? sort : 'latest',
            page: parseInt(page ?? '1'),
            limit: PAGE_SIZE
        } as FilterCourseQueryParams,
        { refetchOnMountOrArgChange: true }
    );

    return <CourseList courses={courses} isLoading={isLoading} />;
};
