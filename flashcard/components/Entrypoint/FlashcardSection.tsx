import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FlashcardCard from './FlashcardCard';
import FlashcardTabs from './FlashcardTabs';
import Sort from 'commons/components/elements/Sort';
import Paginator from 'commons/components/elements/Paginator';
import { FLASHCARD_SORT_OPTIONS, FlashcardSort } from '../../constants';
import AddFlashcardDialog from './AddFlashcardDialog';
import { useGetFlashcardsQuery } from '../../redux/api/flashcardsApi';
import Skeleton from 'commons/components/elements/Skeleton';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const FlashcardSection = (): JSX.Element => {
    const router = useRouter();
    const {
        tab = 'all',
        sort = FlashcardSort.trending,
        page: pageQuery = '1'
    } = router.query;
    const { isMobileBreakpoints } = useWindowBreakpoints();

    const [activeTab, setActiveTab] = useState(tab as string);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(Number(pageQuery));
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        setCurrentPage(Number(pageQuery));
    }, [pageQuery]);

    const { data: flashcardsData, isLoading } = useGetFlashcardsQuery({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        type: activeTab as 'all' | 'user',
        sort_by: sort as 'trending' | 'view' | 'like'
    });

    const handleTabChange = (newTab: string): void => {
        router.push(
            {
                query: {
                    ...router.query,
                    tab: newTab,
                    page: 1
                }
            },
            undefined,
            { shallow: true }
        );
        setActiveTab(newTab);
    };

    const totalPages = flashcardsData
        ? Math.ceil(flashcardsData.count_items / ITEMS_PER_PAGE)
        : 0;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Flashcard</h2>
                {!isMobileBreakpoints && (
                    <button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-[#5F2BCE] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors">
                        + Tambah
                    </button>
                )}
            </div>

            <FlashcardTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <div className="flex gap-4 items-center my-4 w-full">
                <Sort
                    options={FLASHCARD_SORT_OPTIONS}
                    defaultSelected={sort as string}
                    fullWidth
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                    <Skeleton repeat={6} className="w-full h-[158px] !mb-0" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {flashcardsData?.data.map((flashcard) => (
                            <FlashcardCard
                                key={flashcard.id}
                                slug={flashcard.slug}
                                title={flashcard.title}
                                totalCards={flashcard.card_count}
                                author={flashcard.created_by}
                                createdByMe={flashcard.created_by_me}
                            />
                        ))}
                    </div>

                    {flashcardsData &&
                        flashcardsData.count_items > ITEMS_PER_PAGE && (
                            <Paginator
                                totalPages={totalPages}
                                hasNextPage={currentPage < totalPages}
                                hasPreviousPage={currentPage > 1}
                                className="justify-center w-full py-8"
                            />
                        )}
                </>
            )}

            <AddFlashcardDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />

            {isMobileBreakpoints && (
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="fixed bottom-6 right-6 bg-[#5F2BCE] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors shadow-lg flex items-center gap-2 z-10">
                    <span className="text-lg">+</span>
                    <span>Tambah</span>
                </button>
            )}
        </div>
    );
};

export default FlashcardSection;
