import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { TabStyle } from '../LearningExperience/AstroNotes/constants';

const Tabs = (): JSX.Element => {
    const { asPath } = useRouter();

    const tabStyle = (tabKey: 'details' | 'contents'): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap',
            (!asPath.includes('#') && tabKey == 'details') ||
                asPath.includes(tabKey)
                ? TabStyle.activeNeutral
                : TabStyle.default
        );

    return (
        <div className="sticky z-10 flex items-end w-full pb-2 overflow-x-auto bg-black top-14 no-scrollbar">
            <Link className={tabStyle('details')} href="#details" replace>
                Detail
            </Link>
            <Link className={tabStyle('contents')} href="#contents" replace>
                Daftar Isi
            </Link>
            <div
                className={cn(
                    'border-b-2 hidden md:block md:grow',
                    TabStyle.default
                )}></div>
        </div>
    );
};

export default Tabs;
