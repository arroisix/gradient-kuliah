import React, { useState } from 'react';
import { cn } from 'commons/utils';
import { motion } from 'framer-motion';
import HintBulb from 'flashcard/assets/HintBulb';

interface FlashcardContentProps {
    currentIndex: number;
    totalCards: number;
    cards: Array<{
        id: string;
        question: string;
        answer: string;
        is_favorite?: boolean;
    }>;
    onNavigate: (direction: 'prev' | 'next') => void;
    mode?: 'detail' | 'study';
    studyState?: {
        isFlipped: boolean;
        showHint: boolean;
    };
    onFlip?: () => void;
    onHint?: () => void;
    onToggleFavorite?: (cardId: string) => void;
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
    onToggleFavorite
}: FlashcardContentProps): JSX.Element => {
    const [showContent, setShowContent] = useState(true);

    const getHintText = (answer: string): string => {
        const visibleLength = Math.floor(answer.length * 0.2);
        return answer.slice(0, visibleLength) + '___';
    };

    const handleFlipStart = () => {
        setShowContent(false);
    };

    const handleFlipComplete = () => {
        setShowContent(true);
    };

    const cardVariants = {
        initial: {
            rotateX: 0
        },
        flipped: {
            rotateX: 180
        }
    };

    const cardContent =
        mode === 'study' ? (
            <div className="perspective-1000">
                <motion.div
                    initial="initial"
                    animate={studyState?.isFlipped ? 'flipped' : 'initial'}
                    variants={cardVariants}
                    transition={{ duration: 0.6, type: 'tween' }}
                    onAnimationStart={handleFlipStart}
                    onAnimationComplete={handleFlipComplete}
                    className={cn(
                        'w-full relative rounded-xl p-6 min-h-[320px] flex items-center justify-center preserve-3d cursor-pointer',
                        studyState?.isFlipped ? 'bg-[#181818]' : 'bg-[#252246]'
                    )}
                    onClick={onFlip}>
                    <div
                        className="absolute inset-0 backface-hidden"
                        style={{
                            opacity:
                                !studyState?.isFlipped && showContent ? 1 : 0,
                            transition: 'opacity 0.1s'
                        }}>
                        <div className="text-center w-full h-full flex items-center justify-center">
                            {studyState?.showHint ? (
                                <div className="space-y-4">
                                    <p className="text-white font-semibold text-xl whitespace-pre-wrap">
                                        {cards[currentIndex].question}
                                    </p>
                                    <p className="text-[#7D89CC] whitespace-pre-wrap">
                                        {getHintText(
                                            cards[currentIndex].answer
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-white text-xl font-semibold whitespace-pre-wrap">
                                    {cards[currentIndex].question}
                                </p>
                            )}
                        </div>
                    </div>

                    <div
                        className="absolute inset-0 backface-hidden"
                        style={{
                            transform: 'rotateX(180deg)',
                            opacity:
                                studyState?.isFlipped && showContent ? 1 : 0,
                            transition: 'opacity 0.1s'
                        }}>
                        <div className="text-center w-full h-full flex items-center justify-center">
                            <p className="text-white text-base p-4 whitespace-pre-wrap">
                                {cards[currentIndex].answer}
                            </p>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'absolute right-4 z-10',
                            studyState?.isFlipped
                                ? 'bottom-4 rotate-180'
                                : 'top-4'
                        )}
                        style={{
                            transformStyle: 'flat',
                            backfaceVisibility: 'visible',
                            transition: 'top 0.6s, bottom 0.6s'
                        }}>
                        {onToggleFavorite && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(cards[currentIndex].id);
                                }}>
                                <span
                                    className={cn(
                                        'text-2xl',
                                        cards[currentIndex].is_favorite
                                            ? 'text-[#F2C04C]'
                                            : 'text-[#666666] opacity-25'
                                    )}>
                                    ★
                                </span>
                            </button>
                        )}
                    </div>

                    {!studyState?.isFlipped && showContent && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onHint?.();
                            }}
                            className="absolute flex flex-row items-center justify-between gap-0.5 px-4 py-2 bg-[#1E1930] rounded-full bottom-4 right-4 text-[#B6A6F3] hover:opacity-80 text-sm z-10"
                            style={{ transform: 'none' }}>
                            <HintBulb />
                            Lihat Hint
                        </button>
                    )}
                </motion.div>
            </div>
        ) : (
            <div className="bg-[#252246] rounded-xl p-6 min-h-[320px] flex items-center justify-center relative">
                <div className="text-xl font-semibold text-white w-full">
                    <p className="text-center whitespace-pre-wrap">
                        {cards[currentIndex].question}
                    </p>
                </div>
                {onToggleFavorite && (
                    <button
                        onClick={() => onToggleFavorite(cards[currentIndex].id)}
                        className="absolute top-4 right-4">
                        <span
                            className={cn(
                                'text-2xl',
                                cards[currentIndex].is_favorite
                                    ? 'text-[#7D89CC]'
                                    : 'text-[#7D89CC] opacity-25'
                            )}>
                            ★
                        </span>
                    </button>
                )}
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
