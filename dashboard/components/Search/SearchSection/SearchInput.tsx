import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { SearchIcon } from 'commons/components/elements/Icons/SearchIcon';
import { cn } from 'commons/utils';
import { Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';
import { useLocalStorage } from 'usehooks-ts';

interface DashboardSearchInputProps {
    isForMobileCollege?: boolean;
    value?: string;
    placeholder?: string;
}

const DashboardSearchInput = ({
    isForMobileCollege = false,
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
            initialValues={{ q: value || ((router.query.q as string) ?? '') }}
            onSubmit={handleSearch}
            enableReinitialize>
            {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className={cn(
                        'rounded-full flex items-center gap-2',
                        isForMobileCollege
                            ? 'bg-[#282B3C] flex-row-reverse py-3 px-4'
                            : 'bg-[#101010] py-2 px-3'
                    )}>
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className={cn(
                            'shrink-0',
                            isForMobileCollege
                                ? 'bg-[#5F2BCE] w-8 h-8 grid place-items-center rounded-full'
                                : ''
                        )}>
                        <SearchIcon
                            className={cn(
                                'shrink-0 w-5 h-5 transition-all',
                                isForMobileCollege
                                    ? 'text-white'
                                    : values.q.trim()
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            )}
                        />
                    </button>

                    <input
                        disabled={isSubmitting}
                        onFocus={track}
                        placeholder={placeholder}
                        value={values.q}
                        onChange={(e) =>
                            setFieldValue('q', e.currentTarget.value)
                        }
                        name="q"
                        type="text"
                        className={cn(
                            'w-full bg-transparent placeholder:text-[#666666] border-none focus:ring-0 text-sm p-0 transition-all outline-none',
                            values.q.trim() ? 'text-white' : 'text-[#666666]'
                        )}
                    />
                </form>
            )}
        </Formik>
    );
};

export default DashboardSearchInput;
