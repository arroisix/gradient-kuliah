import React from 'react';
import FlashcardCard from './FlashcardCard';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useGetLastSeenFlashcardsQuery } from '../../redux/api/flashcardsApi';

const MyFlashcardsSection = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    const { data: lastSeenFlashcardsData } = useGetLastSeenFlashcardsQuery();

    if (
        !lastSeenFlashcardsData?.data ||
        lastSeenFlashcardsData.data.length === 0
    )
        return <></>;

    return (
        <div className="relative pt-6 pb-4 mb-6 sm:pb-6 space-y-4 z-[1] overflow-x-visible">
            <div className="absolute h-full -z-[1] -inset-x-full bg-[#101010] top-0" />
            <h2 className="text-xl font-bold text-white">Terakhir Dilihat</h2>
            <div className="w-full overflow-x-auto flex gap-4 pb-4 no-scrollbar">
                {lastSeenFlashcardsData.data.map((flashcard) => (
                    <FlashcardCard
                        key={flashcard.id}
                        slug={flashcard.slug}
                        title={flashcard.title}
                        totalCards={flashcard.card_count}
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
