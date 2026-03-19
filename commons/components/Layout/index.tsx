import {
    ComponentPropsWithoutRef,
    PropsWithChildren,
    useEffect,
    useState
} from 'react';
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
import { useRouter } from 'next/router';
import HistorySection from 'copilot/components/revamp/HistorySection';
import { useWindowSize } from 'usehooks-ts';
import CopilotNavbar from './CopilotNavbar';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';

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

const loadingBackdropPaths = ['/dashboard', '/utbk/dashboard'];

function Layout({ children }: PropsWithChildren): JSX.Element {
    const [isReachesThreshold, setIsReachesThreshold] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const router = useRouter();
    const { width } = useWindowSize();
    const { profile, isLoadingProfile } = useAuth();

    const menuItems =
        profile?.current_role === 'COLLEGE_STUDENT'
            ? collegeMenuItems
            : utbkMenuItems;

    const handleCloseHistory = () => {
        setIsHistoryOpen(false);
    };

    useEffect(() => {
        if (isLoadingProfile === undefined || isLoadingProfile) {
            return;
        }

        if (!profile && router.pathname === '/dashboard') {
            router.push('/');
        } else if (!profile && router.pathname === '/utbk/dashboard') {
            router.push('/utbk');
        }
    }, [isLoadingProfile, profile, router]);

    useEffect(() => {
        const handleScroll = () => {
            setIsReachesThreshold(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!profile && loadingBackdropPaths.includes(router.pathname)) {
        return <LoadingBackdrop />;
    }

    return (
        <div className={cn('bg-black', 'lg:h-screen lg:flex')}>
            {router.pathname === '/utbk/dashboard' ? (
                <div
                    className={cn(
                        'absolute top-0 -left-96 -right-96 h-[384px]',
                        'lg:hidden'
                    )}>
                    <Image
                        src={`${CDN_URL}/assets/utbk/dashboard/gradient.svg`}
                        alt=""
                        layout="fill"
                        className="object-cover object-center"
                    />
                </div>
            ) : (
                <></>
            )}

            {/* mobile copilot topbar & mobile topbar */}
            <div
                className={cn(
                    'bg-black fixed z-[51] top-0 left-0 right-0 transition-all',
                    'lg:hidden',
                    router.pathname === '/utbk/dashboard' && !isReachesThreshold
                        ? 'bg-opacity-0'
                        : 'bg-opacity-100'
                )}>
                {router.pathname.includes('/copilot') ? (
                    <CopilotNavbar.Mobile
                        isHistoryOpen={isHistoryOpen}
                        setIsHistoryOpen={setIsHistoryOpen}
                    />
                ) : router.pathname !== '/utbk/dashboard/atur-strategi' ? (
                    <MobileTopbar />
                ) : (
                    <></>
                )}
            </div>

            {/* desktop sidebar */}
            <Sidebar menuItems={menuItems} />

            {/* main content */}
            <div
                className={cn(
                    'pb-[59px] min-h-screen overflow-x-hidden',
                    'lg:pb-0 lg:flex-grow lg:overflow-y-scroll lg:scrollbar-none',
                    router.pathname === '/utbk/dashboard' ? 'lg:relative' : '',
                    router.pathname.includes('/copilot')
                        ? 'h-screen flex flex-col pt-12 lg:pt-0'
                        : router.pathname !== '/utbk/dashboard/atur-strategi'
                        ? 'pt-14 lg:pt-0'
                        : ''
                )}>
                {/* copilot sidebar trigger */}
                {router.pathname.includes('/copilot') ? (
                    <CopilotNavbar
                        isHistoryOpen={isHistoryOpen}
                        setIsHistoryOpen={setIsHistoryOpen}
                    />
                ) : (
                    <></>
                )}

                {children}
            </div>

            {/* desktop copilot history */}
            {router.pathname.includes('/copilot') &&
            profile &&
            isHistoryOpen ? (
                <HistorySection
                    isOpen={isHistoryOpen}
                    onClose={handleCloseHistory}
                    isMobile={width < 1024}
                />
            ) : (
                <></>
            )}

            {/* mobile navbar */}
            <MobileNavbar menuItems={menuItems} />
        </div>
    );
}

export { Layout };
export type { MenuItem };
