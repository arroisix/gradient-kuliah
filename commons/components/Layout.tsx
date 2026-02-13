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
    },
    {
        title: 'Prediksi PTN',
        href: '/utbk/prediksi-ptn',
        InactiveIcon: PrediksiOutlineIcon,
        ActiveIcon: PrediksiSolidIcon
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

function Layout({ children }: PropsWithChildren): JSX.Element {
    const router = useRouter();
    const { profile } = useAuth();

    const menuItems =
        profile?.current_role === 'COLLEGE_STUDENT'
            ? collegeMenuItems
            : utbkMenuItems;

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow overflow-scroll scrollbar-none">
                {children}
            </div>

            <div className="bg-black py-2.5 flex justify-evenly items-center">
                {menuItems.slice(0, menuItems.length - 1).map((v) => (
                    <Link
                        key={v.href}
                        href={v.href}
                        className="flex-grow flex flex-col items-center gap-1 transition-all">
                        {router.pathname === v.href ? (
                            <v.ActiveIcon
                                className={cn(
                                    'shrink-0 w-5 h-5',
                                    router.pathname === v.href
                                        ? 'text-white'
                                        : 'text-[#4B4E5F]'
                                )}
                            />
                        ) : (
                            <v.InactiveIcon
                                className={cn(
                                    'shrink-0 w-5 h-5',
                                    router.pathname === v.href
                                        ? 'text-white'
                                        : 'text-[#4B4E5F]'
                                )}
                            />
                        )}

                        <span
                            className={cn(
                                'shrink-0 text-xs leading-tight font-medium',
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
