import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import EditFlashcardForm from '../components/Edit/EditFlashcardForm';
import {
    useAddCardMutation,
    useEditCardMutation,
    useGetFlashcardDetailQuery
} from '../redux/api/flashcardsApi';

const EditCardContainer = (): JSX.Element => {
    const router = useRouter();
    const { id: flashcardId } = router.query;

    const { data: flashcardDetail, isLoading } = useGetFlashcardDetailQuery(
        { flashcard_id: flashcardId as string },
        { skip: !flashcardId }
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasChanges, setHasChanges] = useState(false);
    const [localCards, setLocalCards] = useState<
        Array<{
            id: string;
            question: Record<string, any>;
            answer: Record<string, any>;
        }>
    >([]);

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
        (cardId: string, field: 'question' | 'answer', value: object) => {
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

            const cardToAdd = {
                id: newCard.id,
                question: newCard.question,
                answer: newCard.answer
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
    if (!flashcardDetail) <></>;

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
        <EditFlashcardForm
            flashcardData={formattedData}
            currentIndex={currentIndex}
            hasChanges={hasChanges}
            onUpdateCard={handleUpdateCard}
            onAddCard={handleAddCard}
            onSave={handleSave}
            onNavigate={handleNavigateCard}
        />
    );
};

export default EditCardContainer;
