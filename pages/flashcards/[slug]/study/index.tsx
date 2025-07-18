import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import LearnLayout from 'commons/learnLayout';
import StudyFlashcardContainer from 'flashcard/containers/StudyFlashcardContainer';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { FlashcardDetail } from 'flashcard/types/flashcards';
import axios from 'axios';
import config from 'redux/api/config';

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
    } catch (error) {
        console.error('Error fetching flashcard details:', error);
        return {
            notFound: true
        };
    }
};

export default StudyFlashcardPage;
