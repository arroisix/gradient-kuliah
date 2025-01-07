import React from 'react';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import MyFlashcardsSection from '../components/Entrypoint/MyFlashcardsSection';
import FlashcardSection from '../components/Entrypoint/FlashcardSection';

const FlashcardEntrypoint = (): JSX.Element => {
    // Hardcoded data for now
    const myFlashcards = [
        {
            id: '1',
            title: 'Istilah Ekonomi Makro',
            totalCards: 10,
            icon: '📚',
            type: 'Flashcard'
        },
        {
            id: '2',
            title: 'UTS DDP 1',
            totalCards: 10,
            icon: '📝',
            type: 'Flashcard'
        }
    ];

    return (
        <div className="w-full">
            <Breadcrumb className="w-full pb-5" />
            <MyFlashcardsSection flashcards={myFlashcards} />
            <FlashcardSection />
        </div>
    );
};

export default FlashcardEntrypoint;
