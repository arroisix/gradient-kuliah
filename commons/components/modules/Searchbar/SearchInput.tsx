import { cn } from 'commons/utils';
import { Field, Form, Formik, type FieldProps } from 'formik';
import React, { useEffect, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import AutocompleteSuggestion from './AutocompleteSuggestion';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'usehooks-ts';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';

const SearchInput = ({
    onSubmit,
    isAutoFocus,
    className
}: {
    onSubmit?: () => void;
    isAutoFocus?: boolean;
} & PropsWithClassName): JSX.Element => {
    const router = useRouter();
    const tracker = useTracker();
    const ref = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [history, setSearchHistory] = useLocalStorage<string[]>(
        'gradient-search-history',
        []
    );

    useEffect(() => {
        if (isAutoFocus) inputRef.current?.focus();
    }, [isAutoFocus]);

    const track = (): void => {
        tracker?.genericTrack('Attempt to Use Advance Search');
    };

    return (
        <Formik
            initialValues={{ q: '' }}
            onSubmit={({ q }) => {
                if (!q) {
                    router.push('/search');
                    return;
                }
                if (isAuthenticated)
                    setSearchHistory([q, ...history.slice(0, 9)]);
                tracker?.genericTrack('User Search with Keyword', {
                    keyword: q
                });
                router.push({ pathname: '/search/results', query: { q } });
                onSubmit?.();
                ref.current?.focus();
            }}>
            <>
                <Form className={cn('peer dropdown w-full', className)}>
                    <label className="flex items-center w-full gap-2 rounded-full input input-sm bg-[#2C2C2C] text-graphite-400">
                        <BiSearch size={20} />
                        <Field name="q">
                            {({ field }: FieldProps<string>) => (
                                <input
                                    {...field}
                                    ref={inputRef}
                                    onFocus={track}
                                    className="w-full px-0 border-none focus:ring-0 grow placeholder:text-graphite-400 placeholder:text-sm input-sm"
                                    placeholder="Cari topik, materi, atau soal apapun"
                                />
                            )}
                        </Field>
                    </label>
                    <AutocompleteSuggestion
                        onClick={() => ref.current?.focus()}
                    />
                </Form>
                <button
                    ref={ref}
                    className="peer-[:not(:focus-within)]:opacity-0 peer-[:not(:focus-within)]:pointer-events-none transition  fixed inset-x-0 bottom-0 top-14 z-[-1] sm:hidden bg-black/90"></button>
            </>
        </Formik>
    );
};

export default SearchInput;
