import { useAuth } from 'authentication/contexts/AuthProvider';
import { Layout } from 'commons/components/Layout';
import LearnLayout from 'commons/learnLayout';
import { search } from 'commons/redux/api/searchApi';
import { cn } from 'commons/utils';
import SearchResults from 'dashboard/containers/searchResults';
import type { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { wrapper } from 'redux/store';

const IndexedSearchResultsPage = ({
    results
}: {
    results: SearchResults<SearchDocument>;
}): JSX.Element => {
    const { profile } = useAuth();

    if (!profile) {
        return (
            <LearnLayout fullHeightSidebar>
                <SearchResults results={results} />
            </LearnLayout>
        );
    }

    return (
        <Layout>
            <div className={cn('m-4', 'lg:mx-12 lg:my-8')}>
                <SearchResults results={results} />
            </div>
        </Layout>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            const { keywords } = params as { keywords: string };
            const q = keywords.replaceAll('-', ' ');
            const dispatch = store.dispatch as ThunkDispatch<
                RootState,
                never,
                never
            >;
            dispatch(search.initiate({ q }));

            const payload = await Promise.all(
                dispatch(getRunningQueriesThunk())
            );

            if (payload.some((response) => response.isError)) {
                return {
                    notFound: true
                };
            }

            const searchResults = payload[0].data;

            const META_TITLE = `Topik ${keywords} di Gradient`;
            const META_DESCRIPTION = `Topik, Materi, dan Pembahasan Soal ${keywords} hanya di Gradient.  Temukan semua yang Kamu butuhkan untuk belajar lebih baik.`;

            return {
                revalidate: 60 * 60 * 24, // revalidate every 24 hours
                props: {
                    results: searchResults,
                    canonical: 'https://gradient.academy/perpustakaan',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    openGraph: {
                        type: 'website',
                        title: META_TITLE,
                        description: META_DESCRIPTION,
                        url: `https://gradient.academy`,
                        images: [
                            {
                                url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                                width: 48,
                                height: 48,
                                alt: 'Gradient Academy'
                            }
                        ]
                    }
                }
            };
        }
);

IndexedSearchResultsPage.displayName = 'Indexed Search Results';
export default IndexedSearchResultsPage;
