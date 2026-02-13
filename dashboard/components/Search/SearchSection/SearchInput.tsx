import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { SearchIcon } from 'commons/components/elements/Icons/SearchIcon';
import { cn } from 'commons/utils';
import { Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';
import { useLocalStorage } from 'usehooks-ts';

interface DashboardSearchInputProps {
    value?: string;
    placeholder?: string;
}

const DashboardSearchInput = ({
    value = '',
    placeholder = 'Cari topik, materi, soal apapun'
}: DashboardSearchInputProps): JSX.Element => {
    const router = useRouter();
    const tracker = useTracker();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [history, setSearchHistory] = useLocalStorage<string[]>(
        'gradient-search-history',
        []
    );

    const track = (): void => {
        tracker?.genericTrack('Attempt to Use Advance Search');
    };

    const handleSearch = (
        { q }: { q: string },
        { setSubmitting }: FormikHelpers<{ q: string }>
    ): void => {
        if (!q) {
            router.push('/search');
            setSubmitting(false);
            return;
        }
        if (isAuthenticated) {
            setSearchHistory([q, ...history.slice(0, 9)]);
        }
        tracker?.genericTrack('User Search with Keyword', {
            keyword: q
        });
        router.push({
            pathname: '/search/results',
            query: { q, from_search_bar: true }
        });
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={{ q: value }}
            onSubmit={handleSearch}
            enableReinitialize>
            {({ values, handleSubmit, setFieldValue }) => (
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className="bg-[#101010] py-2 px-3 rounded-full flex items-center gap-2">
                    <button type="submit">
                        <SearchIcon
                            className={cn(
                                'shrink-0 w-5 h-5 transition-all',
                                values.q.trim()
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            )}
                        />
                    </button>

                    <input
                        onFocus={track}
                        placeholder={placeholder}
                        value={values.q}
                        onChange={(e) =>
                            setFieldValue('q', e.currentTarget.value)
                        }
                        name="q"
                        type="text"
                        className={cn(
                            'bg-transparent placeholder:text-[#666666] border-none focus:ring-0 text-sm p-0 transition-all outline-none',
                            values.q.trim() ? 'text-white' : 'text-[#666666]'
                        )}
                    />
                </form>
            )}
        </Formik>
    );
};

export default DashboardSearchInput;
