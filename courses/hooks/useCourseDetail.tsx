import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetPrivateCourseQuery } from 'courses/redux/api/privateCourseApi';
import { useSelector } from 'react-redux';

const useCourseDetail = (id: string) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { isLoading, error, data } = useGetPrivateCourseQuery(id, {
        refetchOnMountOrArgChange: 30,
        skip: !isAuthenticated || id === null || id === undefined
    });

    return { loading: isLoading, error, data };
};

export default useCourseDetail;
