import { cn } from 'commons/utils';
import React from 'react';
import { LatihanTabStyle } from '../../types/constants';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';

interface LatihanTabsProps {
    activeStatus: string;
    onStatusChange: (status: string) => void;
}

const LatihanTabs: React.FC<LatihanTabsProps> = ({
    activeStatus,
    onStatusChange
}) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const tabStyle = (status: string): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap cursor-pointer',
            activeStatus === status
                ? LatihanTabStyle.active
                : LatihanTabStyle.default
        );

    return (
        <div className="sticky z-[5] flex items-end w-full pt-5 pb-2 overflow-x-auto bg-black md:pt-6 top-10 no-scrollbar">
            <button
                className={tabStyle('all')}
                onClick={() => onStatusChange('all')}
                aria-pressed={activeStatus === 'all'}>
                Semua
            </button>
            {isAuthenticated && (
                <>
                    <button
                        className={tabStyle('not_started')}
                        onClick={() => onStatusChange('not_started')}
                        aria-pressed={activeStatus === 'not_started'}>
                        Not Started
                    </button>
                    <button
                        className={tabStyle('completed')}
                        onClick={() => onStatusChange('completed')}
                        aria-pressed={activeStatus === 'completed'}>
                        Completed
                    </button>
                    <div
                        className={cn(
                            'border-b-2 hidden md:block md:grow',
                            LatihanTabStyle.default
                        )}>
                        {' '}
                    </div>
                </>
            )}
        </div>
    );
};

export default LatihanTabs;
