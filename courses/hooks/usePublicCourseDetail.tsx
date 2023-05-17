import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetPrivateCourseQuery } from 'courses/redux/api/privateCourseApi';
import { useGetPublicCourseQuery } from 'courses/redux/api/publicCourseApi';
import { useSelector } from 'react-redux';

const usePublicCourseDetail = (id: string) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { isLoading: isLoadingPrivate, data: privateData } =
        useGetPrivateCourseQuery(id, {
            refetchOnMountOrArgChange: 30,
            skip: !isAuthenticated || id === null || id === undefined
        });
    const { isLoading: isLoadingPublic, data: publicData } =
        useGetPublicCourseQuery(id, {
            refetchOnMountOrArgChange: 30,
            skip: isAuthenticated || id === null || id === undefined
        });

    return {
        loading: isLoadingPrivate || isLoadingPublic,
        data: isAuthenticated ? privateData : publicData
    };
};

export default usePublicCourseDetail;
