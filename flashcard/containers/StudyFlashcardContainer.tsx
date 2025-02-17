import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    useGetFlashcardDetailQuery,
    useToggleFavoriteCardMutation
} from '../redux/api/flashcardsApi';
import FlashcardContent from 'flashcard/components/Detail/FlashcardContent';
import FlashcardHeader from 'flashcard/components/Detail/FlashcardHeader';
import { Switch } from '@headlessui/react';
import { cn } from 'commons/utils';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import { toast } from 'react-toastify';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import CardList from 'flashcard/components/Study/CardList';
import { FaListUl } from 'react-icons/fa6';

interface StudyState {
    isFlipped: boolean;
    showHint: boolean;
}

const StudyFlashcardContainer = (): JSX.Element => {
    const router = useRouter();
    const { slug, index } = router.query;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isListOpen, setIsListOpen] = useState(false);
    const [studyState, setStudyState] = useState<StudyState>({
        isFlipped: false,
        showHint: false
    });

    const { data: flashcard, isLoading } = useGetFlashcardDetailQuery(
        { flashcard_slug: slug as string },
        { skip: !slug }
    );

    useEffect(() => {
        if (index && flashcard) {
            const targetIndex = Number(index);
            if (targetIndex > 0 && targetIndex <= flashcard.cards.length) {
                setCurrentIndex(targetIndex - 1);
            } else if (targetIndex > flashcard.cards.length) {
                setCurrentIndex(flashcard.cards.length - 1);
            } else {
                setCurrentIndex(0);
            }
        }
    }, [index, flashcard]);

    const [toggleFavorite] = useToggleFavoriteCardMutation();

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

    const handleToggleFavorite = async (cardId: string) => {
        try {
            const response = await toggleFavorite({ card_id: cardId }).unwrap();
            toast.success(
                response.is_favorite
                    ? 'Berhasil ditambah ke favorit'
                    : 'Berhasil dihapus dari favorit',
                {
                    position: toast.POSITION.TOP_CENTER
                }
            );
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const getTextContent = (content: string) => {
        return content
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/\n{2,}/g, '\n')
            .trim();
    };

    if (isLoading) return <LoadingBackdrop />;
    if (!flashcard) return <></>;

    const totalCards = flashcard.cards.length;

    return (
        <div className="w-full">
            <div className="hidden md:block md:px-12">
                <Breadcrumb
                    className="w-full py-4"
                    nextItem={{
                        name: flashcard.title,
                        url: `/flashcard/${slug}`,
                        nextItem: {
                            name: 'Pelajari Flashcard'
                        }
                    }}
                />
            </div>

            <div className="container mx-auto max-w-3xl md:px-4 md:py-6">
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
                    onToggleFavorite={handleToggleFavorite}
                />

                <div className="fixed bottom-0 inset-x-0 p-4 flex justify-between items-center md:hidden bg-black">
                    <button
                        onClick={() => setIsListOpen(true)}
                        className="pr-2 rounded-full text-white">
                        <FaListUl size={24} />
                    </button>
                    <div className="text-[#666666]">|</div>
                    <div className="flex items-center gap-2 w-full justify-between">
                        <span className="pl-2 text-[#999999]">
                            {currentIndex + 1}/{totalCards}
                        </span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleNavigate('prev')}
                                disabled={currentIndex === 0}
                                className="p-2 bg-[#333333] rounded-full text-white disabled:opacity-50">
                                <HiChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => handleNavigate('next')}
                                disabled={currentIndex === totalCards - 1}
                                className="p-2 bg-[#333333] rounded-full text-white disabled:opacity-50">
                                <HiChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-[0.5px] bg-[#333333] my-6 hidden md:block" />

                <div className="mt-12 hidden md:block">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">
                            Daftar Isi
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-base text-white">
                                Tampilkan Jawaban
                            </span>
                            <Switch
                                checked={showAnswer}
                                onChange={setShowAnswer}
                                className={`${
                                    showAnswer
                                        ? 'bg-[#03AC5C]'
                                        : 'bg-neutral-700'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                                <span
                                    className={`${
                                        showAnswer
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </Switch>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {flashcard.cards.map((card, index) => (
                            <button
                                key={card.id}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    'w-full p-4 text-left rounded-lg transition-colors',
                                    index === currentIndex
                                        ? 'bg-[#252246]'
                                        : 'bg-[#222222]'
                                )}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-1">
                                        {getTextContent(card.question)}
                                        {showAnswer && (
                                            <div className="text-sm text-[#666666]">
                                                {getTextContent(card.answer)}
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            'text-2xl flex-shrink-0 ml-2',
                                            card.is_favorite
                                                ? 'text-[#F2C04C]'
                                                : 'text-[#666666]'
                                        )}>
                                        ★
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <CardList
                cards={flashcard.cards}
                currentIndex={currentIndex}
                onSelectCard={setCurrentIndex}
                showAnswer={showAnswer}
                onClose={() => setIsListOpen(false)}
                isOpen={isListOpen}
                setShowAnswer={setShowAnswer}
                title={flashcard.title}
                authorName={flashcard.created_by.name}
                authorInitials={flashcard.created_by.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                photo_profile={flashcard.created_by.photo_profile}
            />
        </div>
    );
};

export default StudyFlashcardContainer;
