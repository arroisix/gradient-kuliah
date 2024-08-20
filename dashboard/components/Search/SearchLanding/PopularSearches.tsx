import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { slugify } from 'commons/utils';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';
import { useLocalStorage } from 'usehooks-ts';

type PopularSearchesProps = {
    popularSearches?: {
        id: string;
        query: string;
    }[];
};

const PopularSearches = ({
    popularSearches
}: PopularSearchesProps): JSX.Element => {
    const tracker = useTracker();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [history] = useLocalStorage<string[]>('gradient-search-history', []);

    const trackHistory = (keyword: string): void => {
        tracker?.genericTrack('Click Search History', {
            Keyword: keyword
        });
    };

    const trackPopular = (keyword: string): void => {
        tracker?.genericTrack('Click Popular Search Keyword', {
            Keyword: keyword
        });
    };

    if (!popularSearches) return <></>;

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-bold text-graphite-400">
                {history?.length !== 0
                    ? 'Riwayat Pencarian'
                    : 'Pencarian Terpopuler ✨'}
            </h2>
            <div className="flex flex-wrap gap-2">
                {isAuthenticated && history?.length !== 0
                    ? history.map((term) => (
                          <Link
                              onClick={trackHistory}
                              href={{
                                  pathname: '/search/results',
                                  query: { q: term }
                              }}
                              className="px-4 py-2 text-sm rounded-lg bg-graphite-700"
                              key={term}>
                              {term}
                          </Link>
                      ))
                    : popularSearches.map((search) => (
                          <Link
                              onClick={trackPopular}
                              href={`/search/results/${slugify(search.query)}`}
                              className="px-4 py-2 text-sm rounded-lg bg-graphite-700"
                              key={search.id}>
                              {search.query}
                          </Link>
                      ))}
            </div>
        </div>
    );
};

export default PopularSearches;
