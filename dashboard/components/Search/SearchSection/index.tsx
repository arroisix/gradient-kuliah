import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetMajorClassesQuery } from 'dashboard/redux/api/dashboardApi';
import DashboardSearchInput from 'dashboard/components/Search/SearchSection/SearchInput';

const SearchSection = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [searchValue, setSearchValue] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: majorClasses, isLoading: isLoadingMajorClasses } =
        useGetMajorClassesQuery({ limit: 12 }, { skip: !isAuthenticated });
    const major = majorClasses?.major;

    const suggestions = [
        `Kelas untuk jurusan ${major}`,
        `Contoh soal ${major}`,
        `Topik terpopuler di ${major}`
    ];

    const handleSuggestionClick = (suggestion: string): void => {
        setSearchValue(suggestion);
    };

    return (
        <div className="mb-4">
            <h1 className="text-2xl font-bold text-center mb-6">
                Mau Belajar apa Hari ini?
            </h1>
            <div className="relative">
                <DashboardSearchInput
                    value={searchValue}
                    placeholder="Cari topik, materi, soal apapun"
                />
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-graphite-400">Kamu bisa cari:</span>
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700 text-sm">
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchSection;
