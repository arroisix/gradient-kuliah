import { useDebounce } from 'commons/hooks/useDebounce';
import { useGetAutocompleteQuery } from 'commons/redux/api/searchApi';
import { useField } from 'formik';
import Link from 'next/link';
import React from 'react';
import { useTracker } from 'tracker/tracker';

const AutocompleteSuggestion = ({
    onClick
}: {
    onClick: () => void;
}): JSX.Element => {
    const tracker = useTracker();
    const [{ value }] = useField<string>('q');
    const debouncedSearchQuery = useDebounce(value, 500);
    const { data } = useGetAutocompleteQuery(
        { q: debouncedSearchQuery },
        { skip: !debouncedSearchQuery }
    );

    if (!data || !data.result.found) return <></>;

    const track = (keyword: string): void => {
        tracker?.genericTrack('Click Keyword Recommendation', {
            'Keyword Recommendation': keyword
        });
        onClick();
    };

    return (
        <ul
            tabIndex={0}
            role="menu"
            className="dropdown-content w-screen -left-16 z-40 sm:left-auto sm:w-full sm:rounded-lg menu p-0 top-10 bg-[#20222E] [&>li:nth-child(even)]:bg-[#222] [&>li>*]:rounded-none overflow-hidden sm:border border-graphite-600/50 shadow-xl">
            {data.result.hits.map(({ document: suggestion }) => (
                <li key={suggestion.id}>
                    <Link
                        href={{
                            pathname: '/search/results',
                            query: { q: suggestion.q }
                        }}
                        onClick={() => track(suggestion.q)}>
                        {suggestion.q}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default AutocompleteSuggestion;
