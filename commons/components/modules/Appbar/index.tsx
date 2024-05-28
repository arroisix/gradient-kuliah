import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { BiBookReader } from 'react-icons/bi';
import { FiHome } from 'react-icons/fi';
import { RiBookOpenLine, RiQuestionnaireLine } from 'react-icons/ri';

const DISPLAYED_ROUTES = [
    '/dashboard',
    '/komunitas',
    '/komunitas/public',
    '/komunitas/pertanyaan-ku',
    '/astronotes',
    '/kelas'
];
const APPBAR_NAV: AppbarNav[] = [
    {
        icon: <FiHome size={20} />,
        href: '/dashboard',
        label: 'Home'
    },
    {
        icon: <RiQuestionnaireLine size={20} />,
        href: '/komunitas',
        alias: ['/komunitas', '/komunitas/public', '/komunitas/pertanyaan-ku'],
        label: 'Komunitas'
    },
    {
        icon: <BiBookReader size={20} />,
        href: '/kelas',
        label: 'Kelas'
    },
    {
        icon: <RiBookOpenLine size={20} />,
        href: '/astronotes',
        label: 'Perpus'
    }
];
const Appbar = (): JSX.Element | null => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription()
    const isShowAppbar = (): boolean =>
        DISPLAYED_ROUTES.includes(router.asPath) ||
        DISPLAYED_ROUTES.includes(router.pathname);

    return isShowAppbar() && is_subscribed ? (
        <div className="btm-nav bg-[#121212] md:hidden" style={{ zIndex: 11 }}>
            {APPBAR_NAV.map((menu) => (
                <Link
                    key={menu.label}
                    href={menu.href}
                    className={cn(
                        router.pathname === menu.href ||
                            menu.alias?.includes(router.pathname)
                            ? 'text-white'
                            : 'text-[#666]'
                    )}>
                    <>
                        {menu.icon}
                        {menu.label}
                    </>
                </Link>
            ))}
        </div>
    ) : null;
};

export default Appbar;
