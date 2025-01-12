import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
    useAddCardMutation,
    useDeleteFlashcardMutation,
    useGetFlashcardDetailQuery
} from '../redux/api/flashcardsApi';
import DeleteModal from '../components/Detail/DeleteModal';
import FlashcardHeader from '../components/Detail/FlashcardHeader';
import FlashcardContent from '../components/Detail/FlashcardContent';
import FlashcardDescription from '../components/Detail/FlashcardDescription';
import FlashcardActions from '../components/Detail/FlashcardActions';
import EmptyState from '../components/Detail/EmptyState';

const FlashcardDetailContainer = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteFlashcard] = useDeleteFlashcardMutation();
    const [addCard] = useAddCardMutation();

    const {
        data: flashcard,
        isLoading,
        refetch
    } = useGetFlashcardDetailQuery(
        { flashcard_id: id as string },
        {
            skip: !id
        }
    );

    const handleEdit = async () => {
        if (!flashcard) return;

        if (!flashcard.cards || flashcard.cards.length === 0) {
            try {
                await addCard({
                    flashcard_id: id as string,
                    question: {
                        type: 'doc',
                        content: [
                            {
                                type: 'paragraph',
                                attrs: { textAlign: 'center' },
                                content: [{ type: 'text', text: '' }]
                            }
                        ]
                    },
                    answer: {
                        type: 'doc',
                        content: [
                            {
                                type: 'paragraph',
                                attrs: { textAlign: 'center' },
                                content: [{ type: 'text', text: '' }]
                            }
                        ]
                    }
                }).unwrap();

                await refetch();

                router.push(`/flashcard/${id}/edit-card`);
            } catch (error) {
                console.error('Failed to create initial card:', error);
                return;
            }
        } else {
            router.push(`/flashcard/${id}/edit-card`);
        }
    };

    const handleEditFlashcard = () => {
        router.push(`/flashcard/${id}/edit`);
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (id) {
                await deleteFlashcard({
                    flashcard_id: id as string
                }).unwrap();
                setIsDeleteModalOpen(false);
                router.push('/flashcard');
            }
        } catch (error) {
            console.error('Failed to delete flashcard:', error);
        }
    };

    const handleNavigate = (direction: 'prev' | 'next') => {
        if (direction === 'next') {
            setCurrentIndex((prev) =>
                Math.min(prev + 1, (flashcard?.cards?.length || 1) - 1)
            );
        } else {
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!flashcard) {
        return <></>;
    }

    const hasCards = flashcard.cards && flashcard.cards.length > 0;
    const userInitials = flashcard.created_by.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('');

    return (
        <div className="px-4 py-6">
            <FlashcardHeader
                title={flashcard.title}
                cardCount={flashcard.card_count}
                isPrivate={flashcard.is_private}
                hasCards={hasCards}
                onWriteCard={handleEdit}
            />

            {hasCards ? (
                <FlashcardContent
                    currentIndex={currentIndex}
                    totalCards={flashcard.cards.length}
                    cards={flashcard.cards}
                    onNavigate={handleNavigate}
                />
            ) : (
                <EmptyState onWrite={handleEdit} />
            )}

            <FlashcardDescription description={flashcard.description} />

            <FlashcardActions
                userInitials={userInitials}
                userName={flashcard.created_by.name}
                onEdit={handleEditFlashcard}
                onDelete={handleDelete}
            />

            <div className="h-[0.5px] bg-[#333333] mb-6" />

            <div>
                <h2 className="text-xl font-bold text-white mb-4">Favorit</h2>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-24 h-24 mb-4" />
                    <p className="text-neutral-400">
                        Belum ada flashcard favorit
                    </p>
                </div>
            </div>

            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
};

export default FlashcardDetailContainer;
