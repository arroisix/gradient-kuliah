import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { TabStyle } from '../constants';
import { getBookBaseHref } from 'courses/utils';

const EntrypointTabs = (): JSX.Element => {
    const router = useRouter();

    const tabStyle = (pathname: string): string =>
        cn(
            'text-center text-sm py-3 border-b-2 flex-1 md:flex-none first:!px-1 whitespace-nowrap',
            router.pathname === pathname ? TabStyle.active : TabStyle.default
        );

    return (
        <div className="sticky z-10 flex items-end w-full pt-5 pb-2 overflow-x-auto bg-black md:pt-6 top-14 no-scrollbar">
            <Link className={tabStyle('/perpustakaan')} href={'/perpustakaan'}>
                Semua
            </Link>
            <Link
                className={tabStyle(getBookBaseHref('textbook'))}
                href={getBookBaseHref('textbook')}>
                Textbook Solution
            </Link>
            <Link
                className={tabStyle(getBookBaseHref('astronotes'))}
                href={getBookBaseHref('astronotes')}>
                Astronotes
            </Link>
            <Link
                className={tabStyle(getBookBaseHref('bank-soal'))}
                href={getBookBaseHref('bank-soal')}>
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
