import React from 'react';
import { GetServerSideProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import EditFlashcardContainer from 'flashcard/containers/EditFlashcardContainer';

const EditFlashcardPage = (): JSX.Element => {
    return (
        <LearnLayout>
            <div className="container mx-auto max-w-3xl">
                <EditFlashcardContainer />
            </div>
        </LearnLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: {
            canonical: `https://gradient.academy/flashcard/${params?.id}/edit`,
            title: 'Edit Flashcard - Gradient',
            description: 'Edit your flashcard'
        }
    };
};

export default EditFlashcardPage;
