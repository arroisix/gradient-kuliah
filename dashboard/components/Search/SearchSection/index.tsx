import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetMajorClassesQuery } from 'dashboard/redux/api/dashboardApi';
import { useTracker } from 'tracker/tracker';
import { useLocalStorage } from 'usehooks-ts';
import DashboardSearchInput from 'dashboard/components/Search/SearchSection/SearchInput';

const SearchSection = (): JSX.Element => {
    const router = useRouter();
    const tracker = useTracker();
    const isAuthenticated = useSelector(getIsAuthenticated);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchValue, setSearchValue] = useState('');
    const [history, setSearchHistory] = useLocalStorage<string[]>(
        'gradient-search-history',
        []
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: majorClasses, isLoading: isLoadingMajorClasses } =
        useGetMajorClassesQuery({ limit: 12 }, { skip: !isAuthenticated });
    const major = majorClasses?.major;

    const suggestions = [
        `Kelas untuk jurusan ${major}`,
        `Kuis untuk ${major}`,
        `Topik terpopuler di ${major}`
    ];

    const handleSuggestionClick = (suggestion: string): void => {
        // Add to search history if authenticated
        if (isAuthenticated) {
            setSearchHistory([suggestion, ...history.slice(0, 9)]);
        }

        // Track the search
        tracker?.genericTrack('User Search with Keyword', {
            keyword: suggestion,
            source: 'suggestion_click'
        });

        router.push({
            pathname: '/search/results',
            query: { q: suggestion, from_search_bar: true }
        });
    };

    return (
        <div className="mt-4 mb-4">
            <h1 className="text-2xl font-bold text-center mb-6">
                Mau Belajar apa Hari ini?
            </h1>
            <div className="relative">
                <DashboardSearchInput
                    value={searchValue}
                    placeholder="Cari topik, materi, soal apapun"
                />
            </div>

            {isAuthenticated && (
                <div className="mt-4">
                    <div
                        className="
                            relative isolate
                            ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-4
                            md:ml-0 md:mr-0 md:px-0
                            max-w-none
                            overflow-x-auto overflow-y-visible no-scrollbar
                        ">
                        <div className="flex items-center gap-2 w-max mx-auto">
                            <span className="text-graphite-400 text-sm flex-shrink-0">
                                Kamu bisa cari:
                            </span>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                    className="flex-shrink-0 px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700 text-xs md:text-sm whitespace-nowrap transition-colors">
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchSection;
