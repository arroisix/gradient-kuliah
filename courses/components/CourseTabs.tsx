import { cn } from 'commons/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { TabStyle } from './LearningExperience/AstroNotes/constants';
import Link from 'next/link';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';

const TAB_OPTIONS = [
    // { value: 'all', label: 'Semua' },
    // { value: 'newly-released', label: 'Baru Rilis' },
    { value: 'for-you', label: 'Untuk Kamu' },
    { value: 'trending', label: 'Trending' },
    { value: 'my-class', label: 'Kelasku' },
    { value: 'coming-soon', label: 'Segera Hadir' }
];

const AUTH_DEFAULT_TAB_VALUE = 'for-you';
const NON_AUTH_DEFAULT_TAB_VALUE = 'all';

const CourseTabs = (): JSX.Element => {
    const router = useRouter();
    const { tab: currentTab } = router.query as { tab: string };
    const isAuthenticated = useSelector(getIsAuthenticated);

    const tabs = useMemo(() => {
        if (!isAuthenticated) {
            return TAB_OPTIONS.filter((tab) => tab.value !== 'my-class').map(
                (tab) =>
                    tab.value === 'for-you' ? { ...tab, value: 'all' } : tab
            );
        }
        return TAB_OPTIONS;
    }, [isAuthenticated]);

    const defaultTab = isAuthenticated
        ? AUTH_DEFAULT_TAB_VALUE
        : NON_AUTH_DEFAULT_TAB_VALUE;

    useEffect(() => {
        if (!router.isReady) return;
        if (!currentTab && isAuthenticated) {
            router.replace(
                {
                    pathname: router.pathname,
                    query: { ...router.query, page: 1, tab: defaultTab }
                },
                undefined,
                { shallow: true }
            );
        }
    }, [router.isReady, currentTab, defaultTab, router, isAuthenticated]);

    const tabStyle = (tab: string): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap',
            (!currentTab && tab == defaultTab) || currentTab == tab
                ? TabStyle.active
                : TabStyle.default
        );

    return (
        <div className="sticky z-20 flex items-end w-full pt-5 pb-2 overflow-x-auto bg-black md:pt-6 top-10 no-scrollbar">
            {tabs.map((tab) => (
                <Link
                    key={tab.value}
                    className={tabStyle(tab.value)}
                    scroll={false}
                    href={{
                        query: { ...router.query, page: 1, tab: tab.value }
                    }}>
                    {tab.label}
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

export default CourseTabs;
