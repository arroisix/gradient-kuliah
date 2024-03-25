import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Tab, TabStyle } from '../constants';

const EntrypointTabs = (): JSX.Element => {
    const router = useRouter();
    const { tab } = router.query as { tab: string };

    const tabStyle = (tabKey: Tab): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap',
            (!tab && tabKey == Tab.all) || tab == tabKey
                ? TabStyle.active
                : TabStyle.default
        );

    return (
        <div className="sticky z-10 flex items-end w-full pt-5 pb-2 overflow-x-auto bg-black md:pt-6 top-14 no-scrollbar">
            <Link
                className={tabStyle(Tab.all)}
                href={{ query: { tab: Tab.all } }}>
                Semua
            </Link>
            {/* <Link
                className={tabStyle(Tab.textbook)}
                href={{ query: { tab: Tab.textbook } }}>
                Textbook
            </Link> */}
            <Link
                className={tabStyle(Tab.astronotes)}
                href={{ query: { tab: Tab.astronotes } }}>
                Astronotes
            </Link>
            <Link
                className={tabStyle(Tab.soal)}
                href={{ query: { tab: Tab.soal } }}>
                Bank Soal
            </Link>
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

export default EntrypointTabs;
