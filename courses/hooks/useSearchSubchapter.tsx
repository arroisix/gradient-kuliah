import { useLazyGetSearchCourseContentQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { useTracker } from 'tracker/tracker';

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
    const [searchKeyword, setSearchKeyword] = useState('');

    const [
        triggerSearch,
        {
            data: searchResult,
            isLoading: isSearchingLoading,
            isFetching: isSearchingFetching
        }
    ] = useLazyGetSearchCourseContentQuery();

    const handleSearch: UseSearchSubchapter['handleSearch'] = ({
        type,
        page = 1
    }) => {
        tracker?.genericTrack('Search Class Material', {
            'Course Slug': id as string,
            Query: searchKeyword
        });
        triggerSearch({
            slug: id as string,
            content: searchKeyword,
            type,
            page
        });
    };

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
