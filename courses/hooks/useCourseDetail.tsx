import { useGetPrivateCourseQuery } from 'courses/redux/api/privateCourseApi';

const useCourseDetail = (id: string) => {
    const { isLoading, error, data } = useGetPrivateCourseQuery(id);

    return { loading: isLoading, error, data };
};

export default useCourseDetail;
