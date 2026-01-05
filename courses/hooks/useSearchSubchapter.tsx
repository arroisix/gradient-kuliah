import { useLazyGetSearchCourseContentQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useState
} from 'react';
import { useTracker } from 'tracker/tracker';
import { useDebounceValue } from 'usehooks-ts';

const CourseSubchapterSearchContext = createContext<UseSearchSubchapter | null>(
    null
);

export const CourseSubchapterSearchProvider = ({
    children
}: PropsWithChildren): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { id } = router.query;
    const [isSearch, setIsSearch] = useState(false);
    const [searchKeyword, setSearchKeyword] = useDebounceValue('', 750);

    const [
        triggerSearch,
        {
            data: searchResult,
            isLoading: isSearchingLoading,
            isFetching: isSearchingFetching
        }
    ] = useLazyGetSearchCourseContentQuery();

    const handleSearch: UseSearchSubchapter['handleSearch'] = useCallback(
        ({ type, page = 1, slug }) => {
            tracker?.genericTrack('Search Class Material', {
                'Course Slug': id as string,
                Query: searchKeyword
            });
            triggerSearch({
                slug: slug ?? (id as string),
                content: searchKeyword,
                type,
                page
            });
        },
        [id, searchKeyword, tracker, triggerSearch]
    );

    return (
        <CourseSubchapterSearchContext.Provider
            value={{
                searchKeyword,
                searchResult,
                isSearch,
                isSearchingLoading,
                isSearchingFetching,
                handleSearch,
                setIsSearch,
                setSearchKeyword
            }}>
            {children}
        </CourseSubchapterSearchContext.Provider>
    );
};

export const useSearchSubchapter = (): UseSearchSubchapter => {
    const context = useContext(CourseSubchapterSearchContext);
    if (!context) {
        throw new Error(
            'useMyContext must be used within a CourseSubchapterSearch'
        );
    }
    return context;
};
