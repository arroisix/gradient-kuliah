import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import LearnLayout from 'commons/learnLayout';
import StudyFlashcardContainer from 'flashcard/containers/StudyFlashcardContainer';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { flashcardApi } from 'flashcard/redux/api/flashcardsApi';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { FlashcardDetail } from 'flashcard/types/flashcards';

const StudyFlashcardPage = ({}: {
    slug: string;
    flashcard: FlashcardDetail;
}): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <LearnLayout
            hideNavbar={isMobileBreakpoints}
            noTopPadding={isMobileBreakpoints}>
            <StudyFlashcardContainer />
        </LearnLayout>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    (store) =>
        async ({ params }) => {
            const { slug } = params as { slug: string };
            const dispatch = store.dispatch as ThunkDispatch<
                RootState,
                never,
                never
            >;

            dispatch(
                flashcardApi.endpoints.getPublicFlashcardDetail.initiate({
                    flashcard_slug: slug
                })
            );

            const payload = await Promise.all(
                dispatch(getRunningQueriesThunk())
            );

            if (payload[0].error) {
                return {
                    notFound: true
                };
            }

            const data = payload[0].data as FlashcardDetail;

            const META_TITLE = `Flashcard ${data.title}`;
            const META_DESCRIPTION =
                data.description ||
                'Lihat detail flashcards untuk proses belajar kamu!';

            return {
                revalidate: 60,
                props: {
                    slug,
                    flashcard: data,
                    canonical: `https://gradient.academy/flashcards/${slug}/study`,
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    openGraph: {
                        type: 'website',
                        title: META_TITLE,
                        description: META_DESCRIPTION,
                        url: `https://gradient.academy/flashcards/${slug}/study`
                    }
                }
            };
        }
);

export default StudyFlashcardPage;
