import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import { useTracker } from 'tracker/tracker';
import PencilOnLineIcon from '../../elements/Icons/PencilLine';
import BookStackIcon from '../../elements/Icons/BookStack';
import KelasIcon from '../../elements/Icons/Kelas';
import DiskusiIcon from '../../elements/Icons/Diskusi';
import HomeIcon from '../../elements/Icons/Home';

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
        icon: <HomeIcon />,
        href: '/dashboard',
        label: 'Home'
    },
    {
        icon: <KelasIcon size={20} />,
        href: '/kelas',
        label: 'Kelas'
    },
    {
        icon: <DiskusiIcon />,
        iconAlt: <CopilotIconFill />,
        href: '/komunitas',
        isExpandable: true,
        expandedLinks: [
            {
                href: '/komunitas',
                label: 'Diskusi',
                icon: <DiskusiIcon />
            },
            {
                href: '/copilot',
                label: 'Copilot AI',
                icon: <CopilotIconFill />
            }
        ],
        label: 'Diskusi & AI'
    },
    {
        icon: <BookStackIcon size={20} />,
        href: '/perpustakaan',
        label: 'Perpus'
    },
    {
        icon: <PencilOnLineIcon size={20} />,
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
    const { data: configData } = useGetConfigQuery();
    const tracker = useTracker();

    const isShowAppbar = (): boolean =>
        DISPLAYED_ROUTES.includes(router.asPath) ||
        DISPLAYED_ROUTES.includes(router.pathname) ||
        router.pathname.startsWith('/copilot');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIcon((prev) =>
                prev === 'diskusi' ? 'copilot' : 'diskusi'
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleDiscussionClick = (e: React.MouseEvent, menu: AppbarNav) => {
        if (
            menu.isExpandable &&
            configData?.configs.is_copilot_config_enabled
        ) {
            e.preventDefault();
            tracker?.genericTrack('Click Diskusi & AI Purple CTA');
            setShowExpanded(!showExpanded);
        }
    };

    const renderExpandableMenu = (menu: AppbarNav): JSX.Element => {
        if (configData?.configs.is_copilot_config_enabled) {
            return (
                <div className="relative">
                    <div className="absolute inset-0 w-12 h-12 bg-[#5F2BCE] rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                    <div className="text-white relative z-10">
                        {showExpanded ? (
                            <IoClose size={20} className="text-white" />
                        ) : currentIcon === 'diskusi' ? (
                            menu.icon
                        ) : (
                            menu.iconAlt
                        )}
                    </div>
                </div>
            );
        }

        return <DiskusiIcon />;
    };

    return isShowAppbar() && is_subscribed ? (
        <>
            {showExpanded && (
                <div
                    className="fixed inset-0 bg-black/50 z-10"
                    onClick={() => setShowExpanded(false)}
                    onKeyDown={() => setShowExpanded(false)}
                    aria-hidden="true">
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#1D1D1D] rounded-full overflow-hidden shadow-xl w-[calc(100%-128px)] max-w-sm">
                        <div className="flex">
                            {APPBAR_NAV.find(
                                (menu) => menu.isExpandable
                            )?.expandedLinks?.map((link, index, array) => (
                                <React.Fragment key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="flex-1 flex flex-col items-center gap-0.5 p-2 hover:bg-neutral-800 transition-colors"
                                        onClick={() => {
                                            if (link.label === 'Copilot AI') {
                                                tracker?.genericTrack(
                                                    'Click Open Copilot CTA from Purple Button'
                                                );
                                            } else if (
                                                link.label === 'Diskusi'
                                            ) {
                                                tracker?.genericTrack(
                                                    'Click Open Diskusi CTA from Purple Button'
                                                );
                                            }
                                            setShowExpanded(false);
                                        }}>
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center">
                                            {link.icon}
                                        </div>
                                        <span className="text-sm font-medium text-white">
                                            {link.label}
                                        </span>
                                    </Link>
                                    {index < array.length - 1 && (
                                        <div className="w-px bg-neutral-800" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div
                className="btm-nav bg-[#121212] md:hidden"
                style={{ zIndex: 11 }}>
                {APPBAR_NAV.map((menu, index) => (
                    <Link
                        key={menu.label}
                        href={menu.href}
                        onClick={(e) => handleDiscussionClick(e, menu)}
                        className={cn(
                            'flex flex-col items-center relative',
                            router.pathname.includes(menu.href)
                                ? 'text-white'
                                : 'text-[#666]',
                            index === 2 &&
                                configData?.configs.is_copilot_config_enabled &&
                                'gap-3 -mt-3'
                        )}>
                        {menu.isExpandable
                            ? renderExpandableMenu(menu)
                            : menu.icon}
                        <span
                            className={cn(
                                'text-xs',
                                index === 2 &&
                                    configData?.configs
                                        .is_copilot_config_enabled
                                    ? 'mt-2'
                                    : 'mt-1'
                            )}>
                            {menu.isExpandable
                                ? showExpanded
                                    ? menu.label
                                    : configData?.configs
                                          .is_copilot_config_enabled
                                    ? menu.label
                                    : 'Diskusi'
                                : menu.label}
                        </span>
                    </Link>
                ))}
            </div>
        </>
    ) : null;
};

export default Appbar;
