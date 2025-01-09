import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import EditFlashcardForm from '../components/Edit/EditFlashcardForm';
import {
    useAddCardMutation,
    useEditCardMutation,
    useGetFlashcardDetailQuery
} from '../redux/api/flashcardsApi';

const EditFlashcardContainer = (): JSX.Element => {
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
            if (flashcardDetail.cards && flashcardDetail.cards.length > 0) {
                setLocalCards(flashcardDetail.cards);
            } else {
                setLocalCards([
                    {
                        id: 'temp',
                        question: {
                            type: 'doc',
                            content: [
                                {
                                    type: 'paragraph',
                                    attrs: { textAlign: 'justify' },
                                    content: [{ type: 'text', text: '' }]
                                }
                            ]
                        },
                        answer: {
                            type: 'doc',
                            content: [
                                {
                                    type: 'paragraph',
                                    attrs: { textAlign: 'justify' },
                                    content: [{ type: 'text', text: '' }]
                                }
                            ]
                        }
                    }
                ]);
            }
        }
    }, [flashcardDetail]);

    const handleSave = useCallback(async () => {
        if (!hasChanges || !flashcardDetail) return;

        const currentCard = localCards[currentIndex];

        try {
            if (currentCard.id === 'temp') {
                // new card
                await addCard({
                    flashcard_id: flashcardId as string,
                    question: currentCard.question,
                    answer: currentCard.answer
                }).unwrap();
            } else {
                // existing card
                await editCard({
                    card_id: currentCard.id,
                    question: currentCard.question,
                    answer: currentCard.answer
                }).unwrap();
            }

            setHasChanges(false);
        } catch (error) {
            console.error('Failed to save card:', error);
        }
    }, [
        addCard,
        editCard,
        hasChanges,
        currentIndex,
        localCards,
        flashcardId,
        flashcardDetail
    ]);

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

    const handleAddCard = useCallback(() => {
        const newCard = {
            id: 'temp',
            question: {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'justify' },
                        content: [{ type: 'text', text: '' }]
                    }
                ]
            },
            answer: {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        attrs: { textAlign: 'justify' },
                        content: [{ type: 'text', text: '' }]
                    }
                ]
            }
        };

        setLocalCards((prev) => [...prev, newCard]);
        setCurrentIndex((prev) => prev + 1);
        setHasChanges(true);
    }, []);

    const handleNavigateCard = useCallback(
        (direction: 'prev' | 'next') => {
            setCurrentIndex((prev) =>
                direction === 'next'
                    ? Math.min(prev + 1, localCards.length - 1)
                    : Math.max(prev - 1, 0)
            );
        },
        [localCards.length]
    );

    if (isLoading) return <div>Loading...</div>;
    if (!flashcardDetail) <></>;

    const formattedData = {
        title: flashcardDetail?.title ?? '',
        lastSaved: 'Just now',
        totalCards: localCards.length,
        isPublic: !flashcardDetail?.is_private ?? true,
        cards: localCards
    };

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

export default EditFlashcardContainer;
