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
    return {
        props: {
            canonical: `https://gradient.academy/flashcard/${params?.slug}/study`,
            title: 'Belajar Flashcard - Gradient',
            description: 'Belajar flashcard di Gradient'
        }
    };
};

export default StudyFlashcardPage;
