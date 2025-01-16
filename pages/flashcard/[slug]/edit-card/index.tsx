import React from 'react';
import { GetServerSideProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import EditCardContainer from 'flashcard/containers/EditCardContainer';

const EditFlashcardPage = (): JSX.Element => {
    return (
        <LearnLayout>
            <EditCardContainer />
        </LearnLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: {
            canonical: `https://gradient.academy/flashcard/${params?.slug}/edit-card`,
            title: 'Edit Flashcard - Gradient',
            description: 'Edit your flashcard'
        }
    };
};

export default EditFlashcardPage;
