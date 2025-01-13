import React from 'react';
import { GetServerSideProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import StudyFlashcardContainer from 'flashcard/containers/StudyFlashcardContainer';

const StudyFlashcardPage = (): JSX.Element => {
    return (
        <LearnLayout>
            <StudyFlashcardContainer />
        </LearnLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: {
            canonical: `https://gradient.academy/flashcard/${params?.id}/study`,
            title: 'Study Flashcard - Gradient',
            description: 'Study your flashcards'
        }
    };
};

export default StudyFlashcardPage;
