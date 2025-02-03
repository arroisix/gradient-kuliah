import { cn } from 'commons/utils';
import React from 'react';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import { FlashcardTab, FlashcardTabStyle } from '../../constants';

interface FlashcardTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const FlashcardTabs: React.FC<FlashcardTabsProps> = ({
    activeTab,
    onTabChange
}) => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    const tabStyle = (tab: string): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap cursor-pointer',
            activeTab === tab
                ? FlashcardTabStyle.active
                : FlashcardTabStyle.default
        );

    return (
        <div className="sticky z-10 flex items-end w-full pt-5 pb-2 overflow-x-auto bg-black md:pt-6 top-10 no-scrollbar">
            <button
                className={tabStyle(FlashcardTab.all)}
                onClick={() => onTabChange(FlashcardTab.all)}
                aria-pressed={activeTab === FlashcardTab.all}>
                Semua
            </button>
            {isAuthenticated && (
                <>
                    <button
                        className={tabStyle(FlashcardTab.yours)}
                        onClick={() => onTabChange(FlashcardTab.yours)}
                        aria-pressed={activeTab === FlashcardTab.yours}>
                        Milikmu
                    </button>
                    <div
                        className={cn(
                            'border-b-2 hidden md:block md:grow',
                            FlashcardTabStyle.default
                        )}>
                        {' '}
                    </div>
                </>
            )}
        </div>
    );
};

export default FlashcardTabs;
