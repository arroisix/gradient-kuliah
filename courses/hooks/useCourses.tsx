import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';

const useCourses = (
    section: 'all' | 'newly-released' | 'coming-soon' | 'trending' | 'for-you',
    sort: 'latest' | 'popularity' | 'lexicography'
) => {
    const { isLoading, error, data } = useGetPrivateListCoursesV2Query(
        { section, sort } as FilterCourseQueryParams,
        {
            refetchOnMountOrArgChange: true
        }
    );

    return { loading: isLoading, error, data };
};

export default useCourses;
