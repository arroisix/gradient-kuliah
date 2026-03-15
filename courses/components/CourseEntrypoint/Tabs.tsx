import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { cn } from 'commons/utils';
import { TabStyle } from '../LearningExperience/AstroNotes/constants';
import Sparkles from 'commons/components/elements/Icons/Sparkles';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { BiChevronDown } from 'react-icons/bi';

interface CourseEntrypointTabsProps {
    tabs: {
        value: string;
        label: string;
    }[];
    defaultTab: string;
}
const CourseEntrypointTabs = ({
    tabs,
    defaultTab
}: CourseEntrypointTabsProps): JSX.Element => {
    const router = useRouter();
    const { tab: currentTab } = router.query as { tab: string };
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [isExpandedMobile, setIsExpandedMobile] = useState(false);

    const isTabActive = (tab: string): boolean =>
        (!currentTab && tab == defaultTab) || currentTab == tab;

    const hasHiddenMobileTabs = tabs.length > 5;

    const collapsedMobileTabs = useMemo(() => {
        if (!hasHiddenMobileTabs) return tabs;

        const firstTabs = tabs.slice(0, 5);
        const activeTab = tabs.find((tab) => isTabActive(tab.value));

        if (
            !activeTab ||
            firstTabs.some((tab) => tab.value === activeTab.value)
        ) {
            return firstTabs;
        }

        return [...firstTabs.slice(0, 4), activeTab];
    }, [tabs, hasHiddenMobileTabs, currentTab, defaultTab]);

    const displayedMobileTabs = isExpandedMobile ? tabs : collapsedMobileTabs;

    const tabStyle = (tab: string): string =>
        cn(
            'inline-flex items-center gap-2 justify-center md:justify-start text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap',
            isTabActive(tab) ? TabStyle.active : TabStyle.default
        );

    const mobileTabStyle = (tab: string): string => {
        const active = isTabActive(tab);

        return cn(
            'inline-flex shrink-0 items-center justify-center gap-1 rounded-[50px] border border-[rgba(255,255,255,0.17)] px-3 py-1 text-sm font-semibold leading-[1.25] backdrop-blur-[7px] whitespace-nowrap',
            active
                ? 'bg-gradient-to-b from-[rgba(255,255,255,0.7)] to-[rgba(242,242,242,0.9)] text-[#191920]'
                : 'bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(242,242,242,0.1)] text-white'
        );
    };

    return (
        <>
            <div className="flex lg:hidden items-start gap-4 w-full">
                <div
                    className={cn(
                        'flex flex-1 gap-3 min-h-px min-w-px',
                        isExpandedMobile
                            ? 'flex-wrap items-start'
                            : 'items-center overflow-x-auto no-scrollbar'
                    )}>
                    {displayedMobileTabs.map((tab, index) => {
                        const active = isTabActive(tab.value);

                        return (
                            <Link
                                key={tab.value}
                                className={mobileTabStyle(tab.value)}
                                scroll={false}
                                href={{
                                    query: { ...router.query, tab: tab.value }
                                }}>
                                {isAuthenticated && index === 0 && (
                                    <Sparkles isActive={active} />
                                )}
                                <span className="text-white">{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {hasHiddenMobileTabs && (
                    <button
                        type="button"
                        aria-label={
                            isExpandedMobile ? 'Collapse tabs' : 'Expand tabs'
                        }
                        className={cn(
                            'flex h-6 w-[38px] shrink-0 items-center justify-center rounded-2xl shadow-[-10px_0px_4px_0px_rgba(0,0,0,0.8)]',
                            isExpandedMobile
                                ? 'bg-[#5f2bce]'
                                : 'border border-[#4d5165] bg-[#252246]'
                        )}
                        onClick={() => setIsExpandedMobile((prev) => !prev)}>
                        <BiChevronDown
                            size={14}
                            className={cn(
                                'text-[#B6A6F3] transition-transform',
                                isExpandedMobile && 'rotate-180 text-white'
                            )}
                        />
                    </button>
                )}
            </div>

            <div className="sticky z-[5] hidden lg:flex items-end w-full pb-2 overflow-x-auto bg-transparent top-10 no-scrollbar">
                {tabs.map((tab, index) => {
                    const active = isTabActive(tab.value);
                    return (
                        <Link
                            key={tab.value}
                            className={tabStyle(tab.value)}
                            scroll={false}
                            href={{
                                query: { ...router.query, tab: tab.value }
                            }}>
                            {isAuthenticated && index === 0 && (
                                <Sparkles isActive={active} />
                            )}
                            <span className="text-white">{tab.label}</span>
                        </Link>
                    );
                })}

                <div
                    className={cn(
                        'border-b-2 hidden md:block md:grow',
                        TabStyle.default
                    )}>
                    {' '}
                </div>
            </div>
        </>
    );
};

export default CourseEntrypointTabs;
