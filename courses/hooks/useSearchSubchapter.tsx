import { useLazyGetSearchCourseContentQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useMemo,
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
    const slug = useMemo(() => {
        if (Object.hasOwn(router.query, 'id')) {
            return router.query.id as string;
        }
        if (Object.hasOwn(router.query, 'slug_subtest')) {
            return router.query.slug_subtest as string;
        }
        return '';
    }, [router.query]);
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
        ({ type, page = 1 }) => {
            tracker?.genericTrack('Search Class Material', {
                'Course Slug': slug,
                Query: searchKeyword
            });
            triggerSearch({
                slug,
                content: searchKeyword,
                type,
                page
            });
        },
        [searchKeyword, slug, tracker, triggerSearch]
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
