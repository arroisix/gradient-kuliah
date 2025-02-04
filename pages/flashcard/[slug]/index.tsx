import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import LearnLayout from 'commons/learnLayout';
import FlashcardDetailContainer from 'flashcard/containers/FlashcardDetailContainer';

const FlashcardDetailPage = (): JSX.Element => {
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const flashcardSlug = params?.slug;

    try {
        const response = await fetch(
            `https://api.gradient.academy/api/v1/flashcards/public/${flashcardSlug}/`
        );
        const flashcard = await response.json();

        return {
            props: {
                canonical: `https://gradient.academy/flashcard/${flashcardSlug}`,
                title: `Flashcard ${flashcard?.title}`,
                description:
                    flashcard?.description ||
                    'Lihat detail flashcard untuk proses belajar kamu!'
            },
            revalidate: 60
        };
    } catch (error) {
        return {
            props: {
                canonical: `https://gradient.academy/flashcard/${flashcardSlug}`,
                title: 'Detail Flashcard - Gradient',
                description: 'Lihat detail flashcard untuk proses belajar kamu!'
            },
            revalidate: 60
        };
    }
};

export default FlashcardDetailPage;
