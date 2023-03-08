import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetCourseNotebookQuery } from 'courses/redux/api/privateCourseApi';
import { useGetPublicCourseNotebookQuery } from 'courses/redux/api/publicCourseApi';
import { useSelector } from 'react-redux';

const usePublicCourseNotebook = (id: string) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { isLoading: isLoadingPrivate, data: privateData } =
        useGetCourseNotebookQuery(id, {
            refetchOnMountOrArgChange: 30,
            skip: !isAuthenticated || id === null || id === undefined
        });
    const { isLoading: isLoadingPublic, data: publicData } =
        useGetPublicCourseNotebookQuery(id, {
            refetchOnMountOrArgChange: 30,
            skip: isAuthenticated || id === null || id === undefined
        });

    return {
        loading: isLoadingPrivate || isLoadingPublic,
        data: isAuthenticated ? privateData : publicData
    };
};

export default usePublicCourseNotebook;
