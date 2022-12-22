import { useGetPrivateListCoursesQuery } from 'courses/redux/api/privateCourseApi';

const useCourses = () => {
    const { isLoading, error, data } = useGetPrivateListCoursesQuery(
        {} as FilterCourseQueryParams,
        {
            refetchOnMountOrArgChange: true
        }
    );

    return { loading: isLoading, error, data };
};

export default useCourses;
