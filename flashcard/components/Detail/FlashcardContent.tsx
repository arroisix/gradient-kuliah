import React from 'react';
import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import { cn } from 'commons/utils';
import { FlashcardContent as IFlashcardContent } from 'flashcard/types/flashcards';

interface FlashcardContentProps {
    currentIndex: number;
    totalCards: number;
    cards: Array<{
        question: IFlashcardContent;
        answer: IFlashcardContent;
    }>;
    onNavigate: (direction: 'prev' | 'next') => void;
    mode?: 'detail' | 'study';
    studyState?: {
        isFlipped: boolean;
        showHint: boolean;
        starred: boolean[];
    };
    onFlip?: () => void;
    onHint?: () => void;
    onStar?: () => void;
}

const FlashcardContent = ({
    currentIndex,
    totalCards,
    cards,
    onNavigate,
    mode = 'detail',
    studyState,
    onFlip,
    onHint,
    onStar
}: FlashcardContentProps): JSX.Element => {
    const currentContent = studyState?.isFlipped
        ? cards[currentIndex]?.answer
        : cards[currentIndex].question;

    const getHintText = (
        question: IFlashcardContent,
        answer: IFlashcardContent
    ): IFlashcardContent[] => {
        if (!answer.content?.[0]?.content?.[0]?.text) return [question];

        const answerText = answer.content[0].content[0].text;
        const visibleLength = Math.floor(answerText.length * 0.2);

        const hintContent = {
            type: answer.type,
            content: [
                {
                    type: answer.content[0].type,
                    attrs: { ...answer.content[0].attrs, textAlign: 'center' },
                    content: [
                        {
                            type: answer.content[0].content[0].type,
                            text:
                                answerText.slice(0, visibleLength) +
                                '_'.repeat(answerText.length - visibleLength)
                        }
                    ]
                }
            ]
        };

        return [question, hintContent];
    };

    const cardContent =
        mode === 'study' ? (
            <button
                onClick={onFlip}
                className={cn(
                    'w-full relative rounded-xl p-6 min-h-[320px] flex items-center justify-center',
                    studyState?.isFlipped
                        ? 'bg-[#181818]'
                        : 'bg-[#252246] text-xl font-semibold'
                )}>
                <div className="text-center w-full">
                    {studyState?.showHint && !studyState.isFlipped ? (
                        <div className="space-y-4">
                            <TiptapViewer
                                content={cards[currentIndex].question}
                                className="text-white font-semibold"
                            />
                            <TiptapViewer
                                content={
                                    getHintText(
                                        cards[currentIndex].question,
                                        cards[currentIndex].answer
                                    )[1]
                                }
                                className="text-[#7D89CC]"
                            />
                        </div>
                    ) : (
                        <TiptapViewer
                            content={currentContent}
                            className="text-white"
                        />
                    )}
                </div>

                {onStar && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onStar();
                        }}
                        className="absolute top-4 right-4">
                        <span
                            className={`text-2xl ${
                                studyState?.starred[currentIndex]
                                    ? 'text-yellow-400'
                                    : 'text-neutral-400'
                            }`}>
                            ★
                        </span>
                    </button>
                )}

                {!studyState?.isFlipped && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onHint?.();
                        }}
                        className="absolute bottom-4 right-4 text-[#B6A6F3] hover:opacity-80 text-sm">
                        Lihat Hint
                    </button>
                )}
            </button>
        ) : (
            <div className="bg-[#252246] rounded-xl p-6 min-h-[320px] flex items-center justify-center">
                <div className="text-xl font-semibold text-white w-full">
                    <TiptapViewer
                        content={cards[currentIndex].question}
                        className="text-center"
                    />
                </div>
            </div>
        );

    return (
        <div className="mb-6">
            {cardContent}
            <div className="flex justify-center items-center mt-4">
                <div className="flex items-center">
                    <button
                        onClick={() => onNavigate('prev')}
                        disabled={currentIndex === 0}
                        className={`py-2 px-3 rounded-full text-white ${
                            currentIndex === 0
                                ? 'bg-[#333333] opacity-20 cursor-not-allowed'
                                : 'bg-[#333333] hover:bg-opacity-80'
                        }`}>
                        ←
                    </button>
                    <span className="text-neutral-400 mx-12">
                        {`${currentIndex + 1}/${totalCards}`}
                    </span>
                    <button
                        onClick={() => onNavigate('next')}
                        disabled={currentIndex === totalCards - 1}
                        className={`py-2 px-3 rounded-full text-white ${
                            currentIndex === totalCards - 1
                                ? 'bg-[#333333] opacity-20 cursor-not-allowed'
                                : 'bg-[#333333] hover:bg-opacity-80'
                        }`}>
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlashcardContent;
