import React from 'react';
import { GetServerSideProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import EditFlashcardContainer from 'flashcard/containers/EditFlashcardContainer';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const EditFlashcardPage = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <LearnLayout noPadding hideNavbar={isMobileBreakpoints} noTopPadding>
            <div className="container mx-auto max-w-3xl">
                <EditFlashcardContainer />
            </div>
        </LearnLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: {
            canonical: `https://gradient.academy/flashcard/${params?.slug}/edit`,
            title: 'Edit Flashcard - Gradient',
            description: 'Edit Flashcard'
        }
    };
};

export default EditFlashcardPage;
