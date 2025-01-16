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
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import { toast } from 'react-toastify';

const FlashcardDetailContainer = (): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteFlashcard] = useDeleteFlashcardMutation();
    const [addCard] = useAddCardMutation();

    const {
        data: flashcard,
        isLoading,
        refetch
    } = useGetFlashcardDetailQuery(
        { flashcard_slug: slug as string },
        {
            skip: !slug
        }
    );

    const handleEdit = async () => {
        if (!flashcard) return;

        if (!flashcard.cards || flashcard.cards.length === 0) {
            try {
                await addCard({
                    flashcard_slug: slug as string,
                    question: 'Istilah atau pertanyaan',
                    answer: 'Definisi atau jawaban'
                }).unwrap();

                await refetch();

                router.push(`/flashcard/${slug}/edit-card`);
            } catch (error) {
                console.error('Failed to create initial card:', error);
                return;
            }
        } else {
            router.push(`/flashcard/${slug}/edit-card`);
        }
    };

    const handleEditFlashcard = () => {
        router.push(`/flashcard/${slug}/edit`);
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (slug) {
                await deleteFlashcard({
                    flashcard_slug: slug as string
                }).unwrap();
                setIsDeleteModalOpen(false);
                toast.success('Flashcard berhasil dihapus', {
                    position: toast.POSITION.TOP_CENTER
                });
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
        return <LoadingBackdrop />;
    }

    if (!flashcard) {
        return <></>;
    }

    const favoriteCards = flashcard.cards.filter((card) => card.is_favorite);
    const hasCards = flashcard.cards && flashcard.cards.length > 0;
    const userInitials = flashcard.created_by.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('');

    const getTextContent = (content: string) => {
        return content
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/\n{2,}/g, '\n')
            .trim();
    };

    return (
        <div className="w-full">
            <div className="md:px-12">
                <Breadcrumb
                    className="w-full md:py-4"
                    nextItem={{
                        name: flashcard.title
                    }}
                />
            </div>

            <div className="container mx-auto max-w-3xl px-0 md:px-4 py-6">
                <FlashcardHeader
                    title={flashcard.title}
                    cardCount={flashcard.card_count}
                    isPrivate={flashcard.is_private}
                    hasCards={hasCards}
                    onWriteCard={
                        flashcard.created_by_me ? handleEdit : undefined
                    }
                    createdByMe={flashcard.created_by_me}
                />

                {hasCards ? (
                    <FlashcardContent
                        currentIndex={currentIndex}
                        totalCards={flashcard.cards.length}
                        cards={flashcard.cards}
                        onNavigate={handleNavigate}
                    />
                ) : (
                    <EmptyState
                        onWrite={handleEdit}
                        createdByMe={flashcard.created_by_me}
                    />
                )}

                <FlashcardDescription description={flashcard.description} />

                <FlashcardActions
                    userInitials={userInitials}
                    userName={flashcard.created_by.name}
                    photo_profile={flashcard.created_by.photo_profile}
                    onEdit={handleEditFlashcard}
                    onDelete={handleDelete}
                    createdByMe={flashcard.created_by_me}
                />

                <div className="h-[0.5px] bg-[#333333] mb-6" />

                <div>
                    <h2 className="text-xl font-bold text-white mb-4">
                        Favorit
                    </h2>
                    {favoriteCards.length > 0 ? (
                        <div className="space-y-2">
                            {favoriteCards.map((card) => (
                                <div
                                    key={card.id}
                                    className="w-full p-4 text-left rounded-lg bg-[#222222]">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-white whitespace-pre-wrap">
                                                {getTextContent(card.question)}
                                            </p>
                                            <p className="text-sm text-[#666666] whitespace-pre-wrap">
                                                {getTextContent(card.answer)}
                                            </p>
                                        </div>
                                        <span className="text-2xl flex-shrink-0 ml-2 text-[#F2C04C]">
                                            ★
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-24 h-24 mb-4" />
                            <p className="text-neutral-400">
                                Belum ada flashcard favorit
                            </p>
                        </div>
                    )}
                </div>

                {isDeleteModalOpen && (
                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onConfirm={handleDeleteConfirm}
                        onCancel={handleDeleteCancel}
                    />
                )}
            </div>
        </div>
    );
};

export default FlashcardDetailContainer;
