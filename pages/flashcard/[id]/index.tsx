import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import LearnLayout from 'commons/learnLayout';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import FlashcardDetailContainer from 'flashcard/containers/FlashcardDetailContainer';

const FlashcardDetailPage = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <LearnLayout
            noPadding
            hideNavbar={isAuthenticated && isMobileBreakpoints}
            noTopPadding>
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
    const flashcardId = params?.id;

    return {
        props: {
            canonical: `https://gradient.academy/flashcard/${flashcardId}`,
            title: 'Detail Flashcard - Gradient',
            description: 'Lihat detail flashcard untuk proses belajar kamu!'
        },
        revalidate: 60
    };
};

export default FlashcardDetailPage;
