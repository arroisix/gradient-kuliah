import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import EditFlashcardForm from '../components/Edit/EditFlashcardForm';
import {
    useAddCardMutation,
    useEditCardMutation,
    useGetFlashcardDetailQuery
} from '../redux/api/flashcardsApi';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import { Card } from '../types/flashcards';

const EditCardContainer = (): JSX.Element => {
    const router = useRouter();
    const { id: flashcardId } = router.query;

    const { data: flashcardDetail, isLoading } = useGetFlashcardDetailQuery(
        { flashcard_id: flashcardId as string },
        { skip: !flashcardId }
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasChanges, setHasChanges] = useState(false);
    const [localCards, setLocalCards] = useState<Card[]>([]);

    const [addCard] = useAddCardMutation();
    const [editCard] = useEditCardMutation();

    React.useEffect(() => {
        if (flashcardDetail) {
            setLocalCards(flashcardDetail.cards || []);
        }
    }, [flashcardDetail]);

    const handleSave = useCallback(async () => {
        if (!hasChanges || !flashcardDetail) return;

        const currentCard = localCards[currentIndex];

        try {
            await editCard({
                card_id: currentCard.id,
                question: currentCard.question,
                answer: currentCard.answer
            }).unwrap();

            setHasChanges(false);
        } catch (error) {
            console.error('Failed to save card:', error);
        }
    }, [editCard, hasChanges, currentIndex, localCards, flashcardDetail]);

    const handleUpdateCard = useCallback(
        (cardId: string, field: 'question' | 'answer', value: string) => {
            setLocalCards((prev) =>
                prev.map((card) =>
                    card.id === cardId ? { ...card, [field]: value } : card
                )
            );
            setHasChanges(true);
        },
        []
    );

    const handleAddCard = useCallback(async () => {
        try {
            const newCard = await addCard({
                flashcard_id: flashcardId as string,
                question: 'Istilah atau pertanyaan',
                answer: 'Definisi atau jawaban'
            }).unwrap();

            const cardToAdd: Card = {
                id: newCard.id,
                question: newCard.question,
                answer: newCard.answer,
                updated_at: newCard.updated_at
            };

            setLocalCards((prev) => [...prev, cardToAdd]);
            setCurrentIndex(localCards.length);
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to add new card:', error);
        }
    }, [addCard, flashcardId, localCards.length]);

    const handleNavigateCard = useCallback(
        (direction: 'prev' | 'next') => {
            setCurrentIndex((prev) =>
                direction === 'next'
                    ? Math.min(prev + 1, localCards.length - 1)
                    : Math.max(prev - 1, 0)
            );
        },
        [localCards]
    );

    if (isLoading) return <div>Loading...</div>;
    if (!flashcardDetail) return <></>;

    const formattedData = React.useMemo(
        () => ({
            title: flashcardDetail?.title ?? '',
            lastSaved: 'Just now',
            totalCards: localCards.length,
            isPublic: !flashcardDetail?.is_private,
            cards: localCards
        }),
        [flashcardDetail?.title, flashcardDetail?.is_private, localCards]
    );

    return (
        <div className="w-full">
            <div className="px-12">
                <Breadcrumb
                    className="w-full py-4"
                    nextItem={{
                        name: flashcardDetail ? flashcardDetail?.title : '',
                        url: `/flashcard/${flashcardId}`,
                        nextItem: {
                            name: 'Edit Flashcard'
                        }
                    }}
                />
            </div>
            <div className="container mx-auto max-w-3xl px-4 py-6">
                <EditFlashcardForm
                    flashcardData={formattedData}
                    currentIndex={currentIndex}
                    hasChanges={hasChanges}
                    onUpdateCard={handleUpdateCard}
                    onAddCard={handleAddCard}
                    onSave={handleSave}
                    onNavigate={handleNavigateCard}
                />
            </div>
        </div>
    );
};

export default EditCardContainer;
