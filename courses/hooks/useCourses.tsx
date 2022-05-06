import { useGetPrivateListCoursesQuery } from 'courses/redux/api/privateCourseApi';

const useCourses = () => {
    const { isLoading, error, data } = useGetPrivateListCoursesQuery(
        {} as FilterCourseQueryParams
    );

    return { loading: isLoading, error, data };
};

export default useCourses;
