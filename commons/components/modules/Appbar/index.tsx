import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { BiBookReader } from 'react-icons/bi';
import { FiHome } from 'react-icons/fi';
import {
    RiBookOpenLine,
    RiFileListLine,
    RiQuestionnaireLine,
    RiRobot2Fill
} from 'react-icons/ri';

const DISPLAYED_ROUTES = [
    '/dashboard',
    '/kelas',
    '/komunitas',
    '/copilot',
    '/perpustakaan',
    '/latihan'
];

const APPBAR_NAV: AppbarNav[] = [
    {
        icon: <FiHome size={20} />,
        href: '/dashboard',
        label: 'Home'
    },
    {
        icon: <BiBookReader size={20} />,
        href: '/kelas',
        label: 'Kelas'
    },
    {
        icon: <RiQuestionnaireLine size={20} />,
        iconAlt: <RiRobot2Fill size={20} />,
        href: '/komunitas',
        isExpandable: true,
        expandedLinks: [
            {
                href: '/komunitas',
                label: 'Diskusi',
                icon: <RiQuestionnaireLine size={20} />
            },
            {
                href: '/copilot',
                label: 'Copilot AI',
                icon: <RiRobot2Fill size={20} />
            }
        ],
        label: 'Diskusi & AI'
    },
    {
        icon: <RiBookOpenLine size={20} />,
        href: '/perpustakaan',
        label: 'Perpus'
    },
    {
        icon: <RiFileListLine size={20} />,
        href: '/latihan',
        label: 'Latihan'
    }
];

const Appbar = (): JSX.Element | null => {
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();
    const [showExpanded, setShowExpanded] = useState(false);
    const [currentIcon, setCurrentIcon] = useState<'diskusi' | 'copilot'>(
        'diskusi'
    );

    const isShowAppbar = (): boolean =>
        DISPLAYED_ROUTES.includes(router.asPath) ||
        DISPLAYED_ROUTES.includes(router.pathname);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIcon((prev) =>
                prev === 'diskusi' ? 'copilot' : 'diskusi'
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleDiscussionClick = (e: React.MouseEvent, menu: AppbarNav) => {
        if (menu.isExpandable) {
            e.preventDefault();
            setShowExpanded(!showExpanded);
        }
    };

    return isShowAppbar() && is_subscribed ? (
        <>
            {showExpanded && (
                <div
                    className="fixed inset-0 bg-black/50 z-10"
                    onClick={() => setShowExpanded(false)}>
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#1D1D1D] rounded-lg overflow-hidden">
                        {APPBAR_NAV.find(
                            (menu) => menu.isExpandable
                        )?.expandedLinks?.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-6 py-4 hover:bg-neutral-800"
                                onClick={() => setShowExpanded(false)}>
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Appbar */}
            <div
                className="btm-nav bg-[#121212] md:hidden"
                style={{ zIndex: 11 }}>
                {APPBAR_NAV.map((menu) => (
                    <Link
                        key={menu.label}
                        href={menu.href}
                        onClick={(e) => handleDiscussionClick(e, menu)}
                        className={cn(
                            router.pathname === menu.href
                                ? 'text-white'
                                : 'text-[#666]',
                            'flex flex-col items-center'
                        )}>
                        {menu.isExpandable
                            ? currentIcon === 'diskusi'
                                ? menu.icon
                                : menu.iconAlt
                            : menu.icon}
                        <span className="text-xs mt-1">{menu.label}</span>
                    </Link>
                ))}
            </div>
        </>
    ) : null;
};

export default Appbar;
