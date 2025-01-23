import React from 'react';
import { GetStaticProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import CreateFlashcardForm from '../../../flashcard/components/Create/CreateFlashcardForm';

const CreateFlashcardCopilotPage = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <LearnLayout
            noPadding
            hideNavbar={isAuthenticated && isMobileBreakpoints}
            noTopPadding>
            <div className="container mx-auto max-w-3xl">
                <CreateFlashcardForm useAi={true} />
            </div>
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/flashcard/create-ai',
            title: 'Buat Flashcard dengan AI - Gradient',
            description:
                'Buat flashcard secara otomatis dengan bantuan Copilot AI!'
        }
    };
};

export default CreateFlashcardCopilotPage;
