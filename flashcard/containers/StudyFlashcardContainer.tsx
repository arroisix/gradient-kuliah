import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useGetFlashcardDetailQuery } from '../redux/api/flashcardsApi';
import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import FlashcardContent from 'flashcard/components/Detail/FlashcardContent';
import FlashcardHeader from 'flashcard/components/Detail/FlashcardHeader';

interface StudyState {
    isFlipped: boolean;
    showHint: boolean;
    starred: boolean[];
}

const StudyFlashcardContainer = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [studyState, setStudyState] = useState<StudyState>({
        isFlipped: false,
        showHint: false,
        starred: []
    });

    const { data: flashcard, isLoading } = useGetFlashcardDetailQuery(
        { flashcard_id: id as string },
        { skip: !id }
    );

    const handleFlip = () => {
        setStudyState((prev) => ({
            ...prev,
            isFlipped: !prev.isFlipped
        }));
    };

    const handleShowHint = () => {
        setStudyState((prev) => ({
            ...prev,
            showHint: !prev.showHint
        }));
    };

    const handleNavigate = (direction: 'prev' | 'next') => {
        setStudyState((prev) => ({
            ...prev,
            isFlipped: false,
            showHint: false
        }));

        if (direction === 'next') {
            setCurrentIndex((prev) =>
                Math.min(prev + 1, (flashcard?.cards?.length || 1) - 1)
            );
        } else {
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    const handleToggleStar = () => {
        setStudyState((prev) => {
            const newStarred = [...prev.starred];
            newStarred[currentIndex] = !newStarred[currentIndex];
            return {
                ...prev,
                starred: newStarred
            };
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (!flashcard) return <></>;

    const totalCards = flashcard.cards.length;

    return (
        <div className="px-4 py-6">
            <FlashcardHeader
                title={flashcard.title}
                cardCount={flashcard.card_count}
                isPrivate={flashcard.is_private}
                hasCards={true}
                mode="study"
            />

            <FlashcardContent
                currentIndex={currentIndex}
                totalCards={totalCards}
                cards={flashcard.cards}
                onNavigate={handleNavigate}
                mode="study"
                studyState={studyState}
                onFlip={handleFlip}
                onHint={handleShowHint}
                onStar={handleToggleStar}
            />

            <div className="mt-12">
                <h2 className="text-xl font-bold text-white mb-4">
                    Daftar Isi
                </h2>
                <div className="space-y-2">
                    {flashcard.cards.map((card, index) => (
                        <button
                            key={card.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-full p-4 text-left rounded-lg ${
                                index === currentIndex
                                    ? 'bg-[#252246]'
                                    : 'bg-[#222222]'
                            }`}>
                            <div className="flex justify-between">
                                <TiptapViewer
                                    content={card.question}
                                    className="text-white"
                                />
                                <span className="text-[#666666]">★</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudyFlashcardContainer;
