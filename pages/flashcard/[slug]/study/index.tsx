import React from 'react';
import { GetServerSideProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import StudyFlashcardContainer from 'flashcard/containers/StudyFlashcardContainer';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const StudyFlashcardPage = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <LearnLayout
            hideNavbar={isMobileBreakpoints}
            noTopPadding={isMobileBreakpoints}>
            <StudyFlashcardContainer />
        </LearnLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const flashcardSlug = params?.slug;

    try {
        const response = await fetch(
            `https://api.gradient.academy/api/v1/flashcards/public/${flashcardSlug}/`
        );
        const flashcard = await response.json();

        return {
            props: {
                canonical: `https://gradient.academy/flashcard/${flashcardSlug}/study`,
                title: `Flashcard ${flashcard?.title}`,
                description:
                    flashcard?.description ||
                    'Lihat detail flashcard untuk proses belajar kamu!'
            }
        };
    } catch (error) {
        return {
            props: {
                canonical: `https://gradient.academy/flashcard/${flashcardSlug}/study`,
                title: 'Detail Flashcard - Gradient',
                description: 'Lihat detail flashcard untuk proses belajar kamu!'
            }
        };
    }
};

export default StudyFlashcardPage;
