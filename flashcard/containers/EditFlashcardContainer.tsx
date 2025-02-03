import React from 'react';
import { useRouter } from 'next/router';
import CreateFlashcardForm from '../components/Create/CreateFlashcardForm';
import { useGetFlashcardDetailQuery } from '../redux/api/flashcardsApi';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';

const EditFlashcardContainer = (): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: flashcardDetail, isLoading } = useGetFlashcardDetailQuery(
        { flashcard_slug: slug as string },
        { skip: !slug }
    );

    if (isLoading) {
        return <LoadingBackdrop />;
    }

    if (!flashcardDetail) {
        return <div>Flashcard not found</div>;
    }

    return (
        <CreateFlashcardForm
            mode="edit"
            initialData={{
                id: flashcardDetail.id,
                slug: flashcardDetail.slug,
                title: flashcardDetail.title,
                description: flashcardDetail.description,
                is_private: flashcardDetail.is_private
            }}
            useAi={false}
        />
    );
};

export default EditFlashcardContainer;
