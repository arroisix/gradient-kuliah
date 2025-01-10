import React from 'react';
import { GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import CreateFlashcardForm from '../../../flashcard/components/Create/CreateFlashcardForm';

const CreateFlashcardPage = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <LearnLayout
            noPadding
            hideNavbar={isAuthenticated && isMobileBreakpoints}
            noTopPadding>
            <div className="container mx-auto max-w-3xl">
                <CreateFlashcardForm useAi={false} />
            </div>
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/flashcard/create',
            title: 'Buat Flashcard - Gradient',
            description: 'Buat flashcard untuk membantu proses belajar kamu!'
        }
    };
};

export default CreateFlashcardPage;
