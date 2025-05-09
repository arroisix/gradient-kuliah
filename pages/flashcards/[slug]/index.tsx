import { GetStaticPaths, GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import FlashcardDetailContainer from 'flashcard/containers/FlashcardDetailContainer';
import { FlashcardDetail } from 'flashcard/types/flashcards';
import axios from 'axios';
import config from 'redux/api/config';

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
        fallback: true
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    try {
        const { slug } = params as { slug: string };

        // Make API call with axios
        const response = await axios.get<FlashcardDetail>(
            `${config.API_BASE_URL}flashcards/public/${slug}/`
        );

        const data = response.data;

        const META_TITLE = `Flashcard ${data.title}`;
        const META_DESCRIPTION =
            data.description ||
            'Lihat detail flashcards untuk proses belajar kamu!';

        return {
            revalidate: 60,
            props: {
                slug,
                flashcard: data,
                canonical: `https://gradient.academy/flashcards/${slug}`,
                title: META_TITLE,
                description: META_DESCRIPTION,
                openGraph: {
                    type: 'website',
                    title: META_TITLE,
                    description: META_DESCRIPTION,
                    url: `https://gradient.academy/flashcards/${slug}`
                }
            }
        };
    } catch (error) {
        console.error('Error fetching flashcard details:', error);
        return {
            notFound: true
        };
    }
};

export default FlashcardDetailPage;
