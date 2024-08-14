import { cn } from 'commons/utils';
import { TabStyle } from 'courses/components/LearningExperience/AstroNotes/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const TAB_OPTIONS = [
    { value: 'all', label: 'Semua' },
    { value: 'course', label: 'Kelas' },
    { value: 'astronotes', label: 'Astronotes' },
    { value: 'bank-soal', label: 'Bank Soal' },
    { value: 'text-book', label: 'Textbook Solution' },
    { value: 'community', label: 'Komunitas' }
];

const ResultsTabs = (): JSX.Element => {
    const router = useRouter();
    const { type: currentTab } = router.query as { type: string };

    const tabStyle = (tab: string): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap',
            (!currentTab && tab == 'all') || currentTab == tab
                ? TabStyle.active
                : TabStyle.default
        );

    return (
        <div className="sticky z-10 flex items-end w-full md:max-w-[calc(100vw-250px-4rem)] pt-5 pb-2 overflow-x-auto bg-black md:pt-6 top-10 no-scrollbar">
            {TAB_OPTIONS.map((type) => (
                <Link
                    key={type.value}
                    className={tabStyle(type.value)}
                    scroll={false}
                    href={{
                        query: { ...router.query, page: 1, type: type.value }
                    }}>
                    {type.label}
                </Link>
            ))}

            <div
                className={cn(
                    'border-b-2 hidden md:block md:grow',
                    TabStyle.default
                )}>
                {' '}
            </div>
        </div>
    );
};

export default ResultsTabs;
