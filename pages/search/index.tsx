import LearnLayout from 'commons/learnLayout';
import { getPopularSearches } from 'commons/redux/api/searchApi';
import { getPopularBooks } from 'courses/redux/api/astronotesApi';
import { getPopularVideos } from 'courses/redux/api/courseApi';
import SearchLanding, {
    type SearchLandingProps
} from 'dashboard/containers/searchLanding';
import { getPublicCommunityPost } from 'komunitas/redux/api/komunitasApi';
import { GetStaticProps } from 'next';
import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { wrapper } from 'redux/store';

const SearchLandingPage = (props: SearchLandingProps): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <SearchLanding {...props} />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) => async () => {
        const dispatch = store.dispatch as ThunkDispatch<
            RootState,
            never,
            never
        >;
        dispatch(getPopularSearches.initiate({}));
        dispatch(getPopularVideos.initiate({}));
        dispatch(getPopularBooks.initiate({ type: 'astronotes' }));
        dispatch(getPopularBooks.initiate({ type: 'text-book' }));
        dispatch(getPopularBooks.initiate({ type: 'bank-soal' }));
        dispatch(getPublicCommunityPost.initiate({}));
        const payload = await Promise.all(dispatch(getRunningQueriesThunk()));

        if (payload.some((response) => response.isError)) {
            return {
                notFound: true
            };
        }

        const popularSearches = payload[0].data;
        const popularVideos = payload[1].data;
        const popularAstronotes = payload[2].data;
        const popularTextbook = payload[3].data;
        const popularBankSoal = payload[4].data;
        const popularDiscussions = payload[5].data;

        // TODO: decide SEO title
        const META_TITLE =
            'Perpustakaan Online Pusat Ruang Baca Digital Terkini | Gradient';
        const META_DESCRIPTION =
            'Nikmati perpustakaan digital dengan akses tanpa batas ke buku, catatan, bank soal, dan solusi terbaik. Temukan semua yang Kamu butuhkan untuk belajar lebih baik.';

        return {
            revalidate: 60 * 60 * 24, // revalidate every 24 hours
            props: {
                popularSearches,
                popularVideos,
                popularAstronotes,
                popularTextbook,
                popularBankSoal,
                popularDiscussions,
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

SearchLandingPage.displayName = 'Search Landing';
export default SearchLandingPage;
