import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import {
    Field,
    Form,
    Formik,
    type FieldProps,
    type FormikHelpers
} from 'formik';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
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
    const inputRef = useRef<HTMLInputElement>(null);
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
            <Form>
                <div className="relative flex items-center">
                    <Field name="q">
                        {({ field }: FieldProps<string>) => (
                            <input
                                {...field}
                                ref={inputRef}
                                onFocus={track}
                                className="w-full h-12 pl-5 pr-14 rounded-full bg-[#222222] text-white focus:ring-0 outline-none placeholder:text-neutral-600 border-none"
                                placeholder={placeholder}
                            />
                        )}
                    </Field>
                    <button
                        type="submit"
                        className="absolute right-2 flex items-center justify-center w-7 h-7 bg-purple-700 rounded-full mr-2">
                        <BiSearch size={16} className="text-white" />
                    </button>
                </div>
            </Form>
        </Formik>
    );
};

export default DashboardSearchInput;
