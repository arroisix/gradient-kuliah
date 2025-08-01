import { cn } from 'commons/utils';
import React from 'react';

interface DownloadsTabProps {
    activeTab: number;
    onTabChange: (index: number) => void;
}

const DownloadsTabs = ({
    activeTab,
    onTabChange
}: DownloadsTabProps): JSX.Element => {
    const TAB_OPTIONS = [
        { value: 'hasil', label: 'Hasil Download Kamu' },
        { value: 'riwayat', label: 'Riwayat Download' }
    ];

    const tabStyle = (index: number): string =>
        cn(
            'text-center text-sm py-3 px-4 border-b-2 cursor-pointer',
            activeTab === index
                ? 'border-indigo-500 text-white font-medium'
                : 'border-transparent text-gray-400 hover:text-gray-300'
        );

    return (
        <div className="sticky z-10 flex items-end w-full border-b border-gray-700 overflow-x-auto bg-black top-10 no-scrollbar">
            {TAB_OPTIONS.map((tab, index) => (
                <button
                    key={tab.value}
                    className={tabStyle(index)}
                    onClick={() => onTabChange(index)}>
                    {tab.label}
                </button>
            ))}

            <div className="border-b-2 hidden md:block md:grow border-transparent">
                {' '}
            </div>
        </div>
    );
};

export default DownloadsTabs;
