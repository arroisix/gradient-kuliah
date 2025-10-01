import React, { useState, useEffect } from 'react';
import { cn } from 'commons/utils';
import { TABS, TabType } from './LanjutBelajarSection';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTracker } from 'tracker/tracker';

interface TabNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    label: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
    activeTab,
    onTabChange
}) => {
    const [startIndex, setStartIndex] = useState(0);
    const [visibleTabs, setVisibleTabs] = useState(3);
    const tracker = useTracker();

    const tabs = [
        { type: TABS.KELAS, label: 'Kelas' },
        { type: TABS.BUKU, label: 'Buku' },
        { type: TABS.KUIS, label: 'Kuis' },
        { type: TABS.FLASHCARD, label: 'Flashcard' }
    ];

    // Update visible tabs count based on screen size
    useEffect(() => {
        const updateVisibleTabs = () => {
            if (window.innerWidth < 768) {
                setVisibleTabs(2);
            } else {
                setVisibleTabs(3);
            }
        };

        // Set initial value
        updateVisibleTabs();

        // Add event listener
        window.addEventListener('resize', updateVisibleTabs);

        // Cleanup
        return () => window.removeEventListener('resize', updateVisibleTabs);
    }, []);

    // Reset startIndex when visibleTabs changes to prevent overflow
    useEffect(() => {
        const maxStartIndex = Math.max(0, tabs.length - visibleTabs);
        if (startIndex > maxStartIndex) {
            setStartIndex(maxStartIndex);
        }
    }, [visibleTabs, startIndex, tabs.length]);

    const maxStartIndex = Math.max(0, tabs.length - visibleTabs);
    const canGoPrevious = startIndex > 0;
    const canGoNext = startIndex < maxStartIndex;

    const slidePrevious = () => {
        if (canGoPrevious) {
            setStartIndex((prev) => Math.max(0, prev - 1));
            tracker?.genericTrack('Click Tab Navigation Arrow', {
                direction: 'previous'
            });
        }
    };

    const slideNext = () => {
        if (canGoNext) {
            setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
            tracker?.genericTrack('Click Tab Navigation Arrow', {
                direction: 'next'
            });
        }
    };

    const handleTabClick = (tabType: TabType) => {
        tracker?.genericTrack('Click Tab on Continue Learning Section', {
            tab: tabType
        });
        onTabChange(tabType);
    };

    const visibleTabsToShow = tabs.slice(startIndex, startIndex + visibleTabs);
    const showNavigation = tabs.length > visibleTabs;

    return (
        <div className="flex items-center mb-4 relative">
            <div className="w-full flex border-b border-neutral-800">
                {showNavigation && canGoPrevious && (
                    <div className="flex items-center justify-center px-2">
                        <button
                            className="text-neutral-400 hover:text-white focus:outline-none transition-colors"
                            onClick={slidePrevious}
                            aria-label="Show previous tabs">
                            <FiChevronLeft size={20} />
                        </button>
                    </div>
                )}

                <div className="flex flex-1">
                    {visibleTabsToShow.map((tab) => (
                        <div
                            key={tab.type}
                            className="flex-1 flex justify-center">
                            <TabButton
                                isActive={activeTab === tab.type}
                                onClick={() => handleTabClick(tab.type)}
                                label={tab.label}
                            />
                        </div>
                    ))}
                </div>

                {showNavigation && canGoNext && (
                    <div className="flex items-center justify-center px-2">
                        <button
                            className="text-neutral-400 hover:text-white focus:outline-none transition-colors"
                            onClick={slideNext}
                            aria-label="Show more tabs">
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, label }) => {
    return (
        <button
            className={cn(
                'px-4 py-2 font-medium transition-colors text-center w-full',
                isActive
                    ? 'text-white border-b-2 border-purple-600'
                    : 'text-neutral-400 hover:text-white'
            )}
            onClick={onClick}>
            {label}
        </button>
    );
};

export default TabNavigation;
