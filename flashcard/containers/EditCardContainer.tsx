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
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import { toast } from 'react-toastify';

const EditCardContainer = (): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: flashcardDetail, isLoading } = useGetFlashcardDetailQuery(
        { flashcard_slug: slug as string },
        { skip: !slug }
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasChanges, setHasChanges] = useState(false);
    const [localCards, setLocalCards] = useState<Card[]>([]);

    const [addCard] = useAddCardMutation();
    const [editCard] = useEditCardMutation();

    React.useEffect(() => {
        if (flashcardDetail) {
            if (!flashcardDetail.cards?.length) {
                const tempCard: Card = {
                    id: 'temp-' + Date.now(),
                    question: '',
                    answer: '',
                    updated_at: new Date().toISOString()
                };
                setLocalCards([tempCard]);
            } else {
                setLocalCards(flashcardDetail.cards);
            }
        }
    }, [flashcardDetail]);

    const handleSave = useCallback(async () => {
        if (!hasChanges || !flashcardDetail) return;

        const currentCard = localCards[currentIndex];

        if (!currentCard.question.trim() || !currentCard.answer.trim()) {
            toast.error('Kartu tidak boleh kosong', {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }

        try {
            if (currentCard.id.startsWith('temp-')) {
                const newCard = await addCard({
                    flashcard_slug: slug as string,
                    question: currentCard.question,
                    answer: currentCard.answer
                }).unwrap();

                setLocalCards((prev) =>
                    prev.map((card) =>
                        card.id === currentCard.id
                            ? {
                                  ...newCard,
                                  updated_at: newCard.updated_at
                              }
                            : card
                    )
                );
            } else {
                await editCard({
                    card_id: currentCard.id,
                    question: currentCard.question,
                    answer: currentCard.answer
                }).unwrap();
            }

            setHasChanges(false);
            toast.success('Flashcard berhasil disimpan', {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.error('Failed to save card:', error);
            toast.error('Gagal menyimpan flashcards', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }, [
        editCard,
        hasChanges,
        currentIndex,
        localCards,
        flashcardDetail,
        slug,
        addCard
    ]);

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

    const handleAddCard = useCallback(() => {
        const tempCard: Card = {
            id: 'temp-' + Date.now(),
            question: '',
            answer: '',
            updated_at: new Date().toISOString()
        };

        setLocalCards((prev) => [...prev, tempCard]);
        setCurrentIndex(localCards.length);
        setHasChanges(false);
    }, [localCards.length]);

    const handleNavigateCard = useCallback(
        (direction: 'prev' | 'next') => {
            if (hasChanges) {
                const confirm = window.confirm(
                    'Ada perubahan yang belum tersimpan. Yakin ingin berpindah?'
                );
                if (!confirm) return;
            }

            setCurrentIndex((prev) =>
                direction === 'next'
                    ? Math.min(prev + 1, localCards.length - 1)
                    : Math.max(prev - 1, 0)
            );
        },
        [localCards.length, hasChanges]
    );

    if (isLoading) return <LoadingBackdrop />;
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
            <div className="hidden md:block md:px-12">
                <Breadcrumb
                    className="w-full py-4"
                    nextItem={{
                        name: flashcardDetail ? flashcardDetail?.title : '',
                        url: `/flashcard/${slug}`,
                        nextItem: {
                            name: 'Edit Flashcard'
                        }
                    }}
                />
            </div>
            <div className="container mx-auto max-w-3xl md:px-4 md:py-6">
                <EditFlashcardForm
                    flashcardData={formattedData}
                    currentIndex={currentIndex}
                    hasChanges={hasChanges}
                    onUpdateCard={handleUpdateCard}
                    onAddCard={handleAddCard}
                    onSave={handleSave}
                    onNavigate={handleNavigateCard}
                    setCurrentIndex={setCurrentIndex}
                />
            </div>
        </div>
    );
};

export default EditCardContainer;
