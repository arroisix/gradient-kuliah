import { GetStaticPaths, GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import FlashcardDetailContainer from 'flashcard/containers/FlashcardDetailContainer';
import { wrapper } from 'redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { flashcardApi } from 'flashcard/redux/api/flashcardsApi';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { FlashcardDetail } from 'flashcard/types/flashcards';

const FlashcardDetailPage = ({}: {
    slug: string;
    flashcard: FlashcardDetail;
}): JSX.Element => {
    return (
        <LearnLayout>
            <FlashcardDetailContainer />
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
                    canonical: `https://gradient.academy/flashcard/${slug}`,
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    openGraph: {
                        type: 'website',
                        title: META_TITLE,
                        description: META_DESCRIPTION,
                        url: `https://gradient.academy/flashcard/${slug}`
                    }
                }
            };
        }
);

export default FlashcardDetailPage;
