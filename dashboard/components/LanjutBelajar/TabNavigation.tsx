import React, { useState } from 'react';
import { cn } from 'commons/utils';
import { TABS, TabType } from './LanjutBelajarSection';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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

    const tabs = [
        { type: TABS.PLAYLIST, label: 'Playlist' },
        { type: TABS.KELAS, label: 'Kelas' },
        { type: TABS.BUKU, label: 'Buku' },
        { type: TABS.KUIS, label: 'Kuis' },
        { type: TABS.FLASHCARD, label: 'Flashcard' }
    ];

    const visibleTabs = 4;
    const maxStartIndex = tabs.length - visibleTabs;

    const canGoPrevious = startIndex > 0;
    const canGoNext = startIndex < maxStartIndex;

    const slidePrevious = () => {
        if (canGoPrevious) {
            setStartIndex(startIndex - 1);
        }
    };

    const slideNext = () => {
        if (canGoNext) {
            setStartIndex(startIndex + 1);
        }
    };

    const visibleTabsToShow = tabs.slice(startIndex, startIndex + visibleTabs);

    return (
        <div className="flex items-center mb-4 relative">
            <div className="w-full flex border-b border-neutral-800">
                {canGoPrevious && (
                    <div className="flex items-center justify-center p-2">
                        <button
                            className="text-neutral-400 hover:text-white focus:outline-none"
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
                                onClick={() => onTabChange(tab.type)}
                                label={tab.label}
                            />
                        </div>
                    ))}
                </div>

                {canGoNext && (
                    <div className="flex items-center justify-center p-2">
                        <button
                            className="text-neutral-400 hover:text-white focus:outline-none"
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
                'px-4 py-2 font-medium transition-colors text-center',
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
