import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { LatihanTabStyle } from '../constants';

const LatihanTabs = (): JSX.Element => {
    const router = useRouter();

    const tabStyle = (pathname: string): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap',
            router.pathname === pathname
                ? LatihanTabStyle.active
                : LatihanTabStyle.default
        );

    return (
        <div className="sticky z-10 flex items-end w-full pt-5 pb-2 overflow-x-auto bg-black md:pt-6 top-10 no-scrollbar">
            <Link
                scroll={false}
                className={tabStyle('/latihan')}
                href={'/latihan'}>
                Semua
            </Link>
            <Link
                className={tabStyle('/latihan/not-started')}
                scroll={false}
                href={'/latihan/not-started'}>
                Not Started
            </Link>
            <Link
                className={tabStyle('/latihan/completed')}
                scroll={false}
                href={'/latihan/completed'}>
                Completed
            </Link>
            <Link
                className={tabStyle('/latihan/bank-soal')}
                scroll={false}
                href={'/latihan/bank-soal'}>
                Bank Soal
            </Link>
            <div
                className={cn(
                    'border-b-2 hidden md:block md:grow',
                    LatihanTabStyle.default
                )}>
                {' '}
            </div>
        </div>
    );
};

export default LatihanTabs;
