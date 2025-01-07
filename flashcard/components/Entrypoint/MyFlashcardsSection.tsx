import React from 'react';
import FlashcardCard from './FlashcardCard';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

interface MyFlashcardsSectionProps {
    flashcards: Array<{
        id: string;
        title: string;
        totalCards: number;
        icon: string;
        type: string;
    }>;
}

const MyFlashcardsSection: React.FC<MyFlashcardsSectionProps> = ({
    flashcards
}) => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    if (!flashcards || flashcards.length === 0) return null;

    return (
        <div className="relative pt-6 pb-4 mb-6 sm:pb-6 space-y-4 z-[1] overflow-x-visible">
            <div className="absolute h-full -z-[1] -inset-x-full bg-[#101010] top-0" />
            <h2 className="text-xl font-bold text-white">Flashcardku</h2>
            <div className="w-full overflow-x-auto flex gap-4 pb-4 no-scrollbar">
                {flashcards.map((flashcard) => (
                    <FlashcardCard
                        key={flashcard.id}
                        {...flashcard}
                        cardType="myFlashcards"
                        className={
                            isMobileBreakpoints
                                ? 'w-[175px] min-w-[175px] h-[210px]'
                                : 'w-[300px] min-w-[300px] h-[190px]'
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default MyFlashcardsSection;
