import React from 'react';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import MyFlashcardsSection from '../components/Entrypoint/MyFlashcardsSection';
import FlashcardSection from '../components/Entrypoint/FlashcardSection';

const FlashcardEntrypoint = (): JSX.Element => {
    return (
        <div className="w-full">
            <Breadcrumb className="w-full pb-5" />
            <MyFlashcardsSection />
            <FlashcardSection />
        </div>
    );
};

export default FlashcardEntrypoint;
