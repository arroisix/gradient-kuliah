import { useGetPrivateCourseQuery } from 'courses/redux/api/privateCourseApi';

const useCourseDetail = (id: string) => {
    const { isLoading, error, data } = useGetPrivateCourseQuery(id, {
        refetchOnMountOrArgChange: 30
    });

    return { loading: isLoading, error, data };
};

export default useCourseDetail;
