import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { CourseOutlineIcon } from '../elements/Icons/CourseOutlineIcon';
import { HomeSolidIcon } from '../elements/Icons/HomeSolidIcon';
import { CourseSolidIcon } from '../elements/Icons/CourseSolidIcon';
import { HomeOutlineIcon } from '../elements/Icons/HomeOutlineIcon';
import { CopilotOutlineIcon } from '../elements/Icons/CopilotOutlineIcon';
import { CopilotSolidIcon } from '../elements/Icons/CopilotSolidIcon';
import { LiveClassOutlineIcon } from '../elements/Icons/LiveClassOutlineIcon';
import { LiveClassSolidIcon } from '../elements/Icons/LiveClassSolidIcon';
import { PencilOutlineIcon } from '../elements/Icons/PencilOutlineIcon';
import { PencilSolidIcon } from '../elements/Icons/PencilSolidIcon';
import { PrediksiOutlineIcon } from '../elements/Icons/PrediksiOutlineIcon';
import { PrediksiSolidIcon } from '../elements/Icons/PrediksiSolidIcon';
import { LibraryOutlineIcon } from '../elements/Icons/LibraryOutlineIcon';
import { LibrarySolidIcon } from '../elements/Icons/LibrarySolidIcon';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn } from 'commons/utils';
import LoadingBackdrop from '../elements/LoadingBackdrop';
import { Sidebar } from './Sidebar';
import { MobileNavbar } from './MobileNavbar';
import { MobileTopbar } from './MobileTopbar';

interface MenuItem {
    title: string;
    href: string;
    InactiveIcon: (props: ComponentPropsWithoutRef<'svg'>) => JSX.Element;
    ActiveIcon: (props: ComponentPropsWithoutRef<'svg'>) => JSX.Element;
}

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
            {/* mobile topbar */}
            <MobileTopbar />

            {/* desktop sidebar */}
            <Sidebar menuItems={menuItems} />

            {/* main content */}
            <div className="flex-grow overflow-scroll scrollbar-none">
                {children}
            </div>

            {/* mobile navbar */}
            <MobileNavbar menuItems={menuItems} />
        </div>
    );
}

export { Layout };
export type { MenuItem };
