import React, { useState, useCallback, useEffect, useRef } from 'react';
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

const AUTOSAVE_DELAY = 3000;

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
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState('Just now');

    const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const currentCardRef = useRef<Card | null>(null);
    const currentIndexRef = useRef<number>(0);

    const [addCard] = useAddCardMutation();
    const [editCard] = useEditCardMutation();

    useEffect(() => {
        if (localCards.length > 0 && currentIndex < localCards.length) {
            currentCardRef.current = localCards[currentIndex];
            currentIndexRef.current = currentIndex;
        }
    }, [localCards, currentIndex]);

    useEffect(() => {
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

    const formatTimestamp = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const triggerAutosave = useCallback(() => {
        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current);
        }

        autosaveTimerRef.current = setTimeout(async () => {
            if (!hasChanges || !currentCardRef.current) return;

            const currentCard = currentCardRef.current;

            if (!currentCard.question.trim() || !currentCard.answer.trim()) {
                return;
            }

            try {
                setIsSaving(true);

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
                setLastSaved(formatTimestamp());
                toast.success('Tersimpan otomatis', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1500,
                    hideProgressBar: true
                });
            } catch (error) {
                console.error('Failed to autosave card:', error);
                toast.error('Gagal menyimpan otomatis', {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } finally {
                setIsSaving(false);
            }
        }, AUTOSAVE_DELAY);
    }, [hasChanges, slug, addCard, editCard]);

    useEffect(() => {
        if (hasChanges) {
            triggerAutosave();
        }

        return () => {
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current);
            }
        };
    }, [hasChanges, triggerAutosave]);

    const handleSave = useCallback(async () => {
        if (!hasChanges || !flashcardDetail || isSaving) return;

        const currentCard = localCards[currentIndex];

        if (!currentCard.question.trim() || !currentCard.answer.trim()) {
            toast.error('Kartu tidak boleh kosong', {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }

        try {
            setIsSaving(true);

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
            setLastSaved(formatTimestamp());
            toast.success('Flashcard berhasil disimpan', {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.error('Failed to save card:', error);
            toast.error('Gagal menyimpan flashcard', {
                position: toast.POSITION.TOP_CENTER
            });
        } finally {
            setIsSaving(false);
        }
    }, [
        editCard,
        hasChanges,
        currentIndex,
        localCards,
        flashcardDetail,
        slug,
        addCard,
        isSaving
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
        // Save current card before adding a new one
        if (hasChanges) {
            triggerAutosave();
        }

        const tempCard: Card = {
            id: 'temp-' + Date.now(),
            question: '',
            answer: '',
            updated_at: new Date().toISOString()
        };

        setLocalCards((prev) => [...prev, tempCard]);
        setCurrentIndex(localCards.length);
        setHasChanges(false);
    }, [localCards.length, hasChanges, triggerAutosave]);

    const handleNavigateCard = useCallback(
        (direction: 'prev' | 'next') => {
            // Auto-save before navigating if there are changes
            if (hasChanges) {
                triggerAutosave();
            }

            setCurrentIndex((prev) =>
                direction === 'next'
                    ? Math.min(prev + 1, localCards.length - 1)
                    : Math.max(prev - 1, 0)
            );
        },
        [localCards.length, hasChanges, triggerAutosave]
    );

    if (isLoading) return <LoadingBackdrop />;
    if (!flashcardDetail) return <></>;

    const formattedData = {
        title: flashcardDetail?.title ?? '',
        lastSaved: lastSaved,
        totalCards: localCards.length,
        isPublic: !flashcardDetail?.is_private,
        cards: localCards
    };

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
                    isSaving={isSaving}
                />
            </div>
        </div>
    );
};

export default EditCardContainer;
