import { PropsWithChildren } from 'react';
import { CourseOutlineIcon } from './elements/Icons/CourseOutlineIcon';
import { HomeSolidIcon } from './elements/Icons/HomeSolidIcon';
import { CourseSolidIcon } from './elements/Icons/CourseSolidIcon';
import { HomeOutlineIcon } from './elements/Icons/HomeOutlineIcon';
import { CopilotOutlineIcon } from './elements/Icons/CopilotOutlineIcon';
import { CopilotSolidIcon } from './elements/Icons/CopilotSolidIcon';
import { LiveClassOutlineIcon } from './elements/Icons/LiveClassOutlineIcon';
import { LiveClassSolidIcon } from './elements/Icons/LiveClassSolidIcon';
import { PencilOutlineIcon } from './elements/Icons/PencilOutlineIcon';
import { PencilSolidIcon } from './elements/Icons/PencilSolidIcon';
import { PrediksiOutlineIcon } from './elements/Icons/PrediksiOutlineIcon';
import { PrediksiSolidIcon } from './elements/Icons/PrediksiSolidIcon';
import { LibraryOutlineIcon } from './elements/Icons/LibraryOutlineIcon';
import { LibrarySolidIcon } from './elements/Icons/LibrarySolidIcon';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn } from 'commons/utils';
import RoleSwitcher from './modules/Navbar/RoleSwitcher';
import DashboardSearchInput from 'dashboard/components/Search/SearchSection/SearchInput';
import LoadingBackdrop from './elements/LoadingBackdrop';
import { ProfileMenu } from './ProfileMenu';

const collegeMenuItems = [
    {
        title: 'Home',
        href: '/dashboard',
        InactiveIcon: HomeOutlineIcon,
        ActiveIcon: HomeSolidIcon
    },
    {
        title: 'Kelas',
        href: '/kelas',
        InactiveIcon: CourseOutlineIcon,
        ActiveIcon: CourseSolidIcon
    },
    {
        title: 'Copilot AI',
        href: '/copilot',
        InactiveIcon: CopilotOutlineIcon,
        ActiveIcon: CopilotSolidIcon
    },
    {
        title: 'Try Out',
        href: '/latihan',
        InactiveIcon: PencilOutlineIcon,
        ActiveIcon: PencilSolidIcon
    },
    {
        title: 'Perpustakaan',
        href: '/perpustakaan',
        InactiveIcon: LibraryOutlineIcon,
        ActiveIcon: LibrarySolidIcon
    }
];

const utbkMenuItems = [
    {
        title: 'Home',
        href: '/utbk/dashboard',
        InactiveIcon: HomeOutlineIcon,
        ActiveIcon: HomeSolidIcon
    },
    {
        title: 'Materi',
        href: '/utbk/materi',
        InactiveIcon: CourseOutlineIcon,
        ActiveIcon: CourseSolidIcon
    },
    {
        title: 'Copilot AI',
        href: '/copilot',
        InactiveIcon: CopilotOutlineIcon,
        ActiveIcon: CopilotSolidIcon
    },
    {
        title: 'Try Out',
        href: '/utbk/try-out',
        InactiveIcon: PencilOutlineIcon,
        ActiveIcon: PencilSolidIcon
    },
    {
        title: 'Live Class',
        href: '/utbk/live-class',
        InactiveIcon: LiveClassOutlineIcon,
        ActiveIcon: LiveClassSolidIcon
    },
    {
        title: 'Prediksi PTN',
        href: '/utbk/prediksi-ptn',
        InactiveIcon: PrediksiOutlineIcon,
        ActiveIcon: PrediksiSolidIcon
    }
];

interface LayoutProps extends PropsWithChildren {
    isForSEO?: boolean;
}

function Layout({ children, isForSEO = false }: LayoutProps): JSX.Element {
    const router = useRouter();
    const { profile, isLoadingProfile } = useAuth();

    const menuItems =
        profile?.current_role === 'COLLEGE_STUDENT'
            ? collegeMenuItems
            : utbkMenuItems;

    // show non-authenticated layout while checking auth status
    if (isForSEO && (isLoadingProfile === undefined || isLoadingProfile)) {
        return <></>;
    }

    if (isLoadingProfile === undefined || isLoadingProfile) {
        return <LoadingBackdrop />;
    }

    return (
        <div className={cn('bg-black flex flex-col h-screen', 'lg:flex-row')}>
            {/* sidebar */}
            <div
                className={cn(
                    'hidden',
                    'lg:flex w-64 border-r border-r-[#333333] flex-col justify-between'
                )}>
                <div className="space-y-8">
                    <div className="px-6 pt-6 space-y-6">
                        <RoleSwitcher />

                        {profile?.current_role === 'COLLEGE_STUDENT' ? (
                            <DashboardSearchInput placeholder="Cari topik, materi, soal" />
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="space-y-4">
                        {menuItems.map((v) => (
                            <Link
                                key={v.href}
                                href={v.href}
                                className="group transition-colors flex items-center gap-3 py-2 px-6">
                                {router.pathname === v.href ? (
                                    <v.ActiveIcon
                                        className={cn(
                                            'shrink-0 group-hover:text-white/75 w-6 h-6',
                                            router.pathname === v.href
                                                ? 'text-white'
                                                : 'text-[#4B4E5F]'
                                        )}
                                    />
                                ) : (
                                    <v.InactiveIcon
                                        className={cn(
                                            'shrink-0 group-hover:text-white/75 w-6 h-6',
                                            router.pathname === v.href
                                                ? 'text-white'
                                                : 'text-[#4B4E5F]'
                                        )}
                                    />
                                )}

                                <span
                                    className={cn(
                                        'shrink-0 group-hover:text-white/75 leading-tight font-medium',
                                        router.pathname === v.href
                                            ? 'text-white'
                                            : 'text-[#4B4E5F]'
                                    )}>
                                    {v.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <ProfileMenu />
                </div>
            </div>

            {/* main content */}
            <div className="flex-grow overflow-scroll scrollbar-none">
                {children}
            </div>

            {/* app bar */}
            <div
                className={cn(
                    'py-2.5 flex justify-evenly items-center',
                    'lg:hidden'
                )}>
                {(menuItems.length > 5
                    ? menuItems.slice(0, menuItems.length - 1)
                    : menuItems
                ).map((v) => (
                    <Link
                        key={v.href}
                        href={v.href}
                        className="group flex-grow flex flex-col items-center gap-1 transition-all">
                        {router.pathname === v.href ? (
                            <v.ActiveIcon
                                className={cn(
                                    'shrink-0 group-hover:text-white/75 w-5 h-5',
                                    router.pathname === v.href
                                        ? 'text-white'
                                        : 'text-[#4B4E5F]'
                                )}
                            />
                        ) : (
                            <v.InactiveIcon
                                className={cn(
                                    'shrink-0 group-hover:text-white/75 w-5 h-5',
                                    router.pathname === v.href
                                        ? 'text-white'
                                        : 'text-[#4B4E5F]'
                                )}
                            />
                        )}

                        <span
                            className={cn(
                                'shrink-0 group-hover:text-white/75 text-xs leading-tight font-medium',
                                router.pathname === v.href
                                    ? 'text-white'
                                    : 'text-[#4B4E5F]'
                            )}>
                            {v.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export { Layout };
