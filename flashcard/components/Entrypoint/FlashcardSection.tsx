import React, { useState } from 'react';
import { useRouter } from 'next/router';
import FlashcardCard from './FlashcardCard';
import FlashcardTabs from './FlashcardTabs';
import Sort from 'commons/components/elements/Sort';
import { FLASHCARD_SORT_OPTIONS, FlashcardSort } from '../../constants';
import AddFlashcardDialog from './AddFlashcardDialog';

const FlashcardSection = (): JSX.Element => {
    const router = useRouter();
    const { tab = 'all', sort = FlashcardSort.trending } = router.query;
    const [activeTab, setActiveTab] = useState(tab as string);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleTabChange = (newTab: string): void => {
        router.push({ query: { ...router.query, tab: newTab } }, undefined, {
            shallow: true
        });
        setActiveTab(newTab);
    };

    // Hardcoded data for now
    const flashcards = [
        {
            id: '1',
            title: 'UTS DDP 1',
            totalCards: 50,
            icon: '📚',
            type: 'Flashcard',
            author: 'Kamu'
        },
        {
            id: '2',
            title: 'Istilah Ekonomi Makro',
            totalCards: 50,
            icon: '📊',
            type: 'Flashcard',
            author: 'Asfiolitha Litha'
        }
    ];

    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Flashcard</h2>
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-[#5F2BCE] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors">
                    + Tambah
                </button>
            </div>

            <FlashcardTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <div className="flex gap-4 items-center my-4">
                <Sort
                    options={FLASHCARD_SORT_OPTIONS}
                    defaultSelected={sort as string}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {flashcards.map((flashcard) => (
                    <FlashcardCard key={flashcard.id} {...flashcard} />
                ))}
            </div>

            <AddFlashcardDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />
        </div>
    );
};

export default FlashcardSection;
