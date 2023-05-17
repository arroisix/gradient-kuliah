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

    const getNotebook = (notionId: string): Notebook | undefined => {
        let data;

        if (isAuthenticated) {
            data = privateData;
        } else {
            data = publicData;
        }

        const allNotebook: Notebook[] = [];

        data?.chapters.forEach((chapter: Chapter) => {
            chapter.subchapters.forEach((subchapter: SubChapter) => {
                if (subchapter.notebook) {
                    allNotebook.push(subchapter.notebook);
                }
            });
        });

        const resNotebook = allNotebook.filter(
            (notebook: Notebook) => notebook.notion_id === notionId
        );

        if (resNotebook.length > 0) return resNotebook[0];

        return;
    };

    return {
        loading: isLoadingPrivate || isLoadingPublic,
        data: isAuthenticated ? privateData : publicData,
        getNotebook
    };
};

export default usePublicCourseNotebook;
