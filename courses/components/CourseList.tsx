import Skeleton from 'commons/components/elements/Skeleton';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicListCoursesV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useRouter } from 'next/router';
import CourseCard from './CourseCard';
import EmptyCourse from './EmptyCourse';
import Paginator from 'commons/components/elements/Paginator';

const CourseList = ({
    isLoading,
    courses
}: {
    isLoading: boolean;
    courses?: ListResponseData<Course>;
}): JSX.Element => {
    const totalPages = Math.ceil((courses?.count_items ?? 0) / 9);
    if (isLoading)
        return (
            <div className="grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                <Skeleton repeat={6} className="w-full h-56 !mb-0" />
            </div>
        );

    if (!isLoading && courses && courses.data.length == 0)
        return <EmptyCourse />;

    return (
        <>
            <div className="grid grid-cols-1 gap-4 pt-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                {courses?.data.map((course: Course) => (
                    <CourseCard course={course} key={course.id} />
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

const VALID_SECTION = ['all', 'newly-released', 'coming-soon'];
const VALID_SORT = ['latest', 'popularity', 'lexicography'];
const PAGE_SIZE = 6;
type CourseQueryParams = Omit<FilterCourseQueryParams, 'section'> & {
    tab?: string;
};

export const PublicCourseList = (): JSX.Element => {
    const router = useRouter();
    const { tab: section, sort, page } = router.query as CourseQueryParams;
    const { data: courses, isLoading } = useGetPublicListCoursesV2Query({
        section: VALID_SECTION.includes(section ?? '') ? section : 'all',
        sort: VALID_SORT.includes(sort ?? '') ? sort : 'latest',
        page: parseInt(page ?? '1'),
        limit: PAGE_SIZE
    });

    return <CourseList courses={courses} isLoading={isLoading} />;
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
