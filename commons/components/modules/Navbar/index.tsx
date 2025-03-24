import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { ChevronDown } from 'lucide-react';
import useWindowSize from 'commons/hooks/useWindowSize';
import MobileNavbar from './components/MobileNavbar';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import MobileSidebar from '../Sidebar/mobile';
import AuthContext from 'authentication/contexts/AuthProvider';
import UserAvatar from './components/UserAvatar';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { cn } from 'commons/utils';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import NavigationButton from 'commons/components/elements/NavigationButton';
import { LEARNING_PAGES } from 'commons/constants';
import AuthButtons from './components/AuthButtons';
import UserProfile from './components/UserProfile';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import SearchBar from '../Searchbar';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import CopilotIconLine from 'copilot/assets/CopilotIconLine';
import PencilOnLineIconFill from '../../elements/Icons/PencilLineFill';
import PencilOnLineIcon from '../../elements/Icons/PencilLine';
import KelasIcon from '../../elements/Icons/Kelas';
import BookStackIcon from '../../elements/Icons/BookStack';
import BookStackIconFill from '../../elements/Icons/BookStackFill';
import KelasIconFill from '../../elements/Icons/KelasFill';
import DiskusiIconFill from '../../elements/Icons/DiskusiFill';
import DiskusiIcon from '../../elements/Icons/Diskusi';

const UNAUTHENTICATED_NAVBAR_BUTTONS: NavigationButtonInterface[] = [
    {
        name: 'Class',
        title: 'Kelas',
        url: '/kelas',
        IconActive: KelasIconFill,
        IconUnactive: KelasIcon
    },
    {
        name: 'Library',
        title: 'Perpustakaan',
        url: '/perpustakaan',
        IconActive: BookStackIconFill,
        IconUnactive: BookStackIcon
    }
];

interface NavbarProps {
    paymentPage: boolean;
    noPadding?: boolean;
    shouldTransparent: boolean;
    courses?: Course[];
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
    showSubscriptionReminder?: boolean;
    setCloseReminder?: (value: boolean) => void;
}

const Navbar = ({
    paymentPage,
    noPadding,
    shouldTransparent,
    showSidebar,
    fullHeightSidebar
}: NavbarProps): JSX.Element => {
    const { theme } = useThemeContext();
    const lightMode = theme === 'light';

    const { isDesktopBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { profile } = useContext(AuthContext);
    const [openMobile, setOpenMobile] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [openToolsDropdown, setOpenToolsDropdown] = useState(false);
    const { height } = useWindowSize();
    const router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = (): void => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };
    const { is_subscribed: isSubscribed } = useCourseSubscription();

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const computeBgColor = (): string => {
        if (openMobile) {
            return lightMode ? 'bg-white shadow-md text-black' : 'bg-[#222222]';
        }

        if (shouldTransparent) {
            if (height && scrollPosition >= height / 2) {
                return isSubscribed ? 'bg-black' : 'bg-[#222222]';
            }
            return 'bg-transparent hover:bg-[#222222]';
        }

        if (paymentPage) {
            return lightMode
                ? 'bg-white shadow-md'
                : isSubscribed
                ? 'bg-black'
                : 'bg-[#222222]';
        }

        if (showSidebar && fullHeightSidebar) {
            if (scrollPosition >= 60) {
                return isSubscribed ? 'bg-black' : 'bg-[#222222]';
            }

            return shouldTransparent
                ? ''
                : isSubscribed
                ? 'bg-black'
                : 'bg-[#222222]';
        }

        return lightMode
            ? 'bg-white text-black shadow-md'
            : isSubscribed
            ? 'bg-black'
            : 'bg-[#222222]';
    };

    const isShowHamburgerMenu =
        !LEARNING_PAGES.some((page) => router.asPath === page) ||
        (LEARNING_PAGES.some((page) => router.asPath === page) &&
            !isSubscribed &&
            !isDesktopBreakpoints);
    const isShowSidebar =
        showSidebar && fullHeightSidebar && isAuthenticated && isSubscribed;

    const { data: configData } = useGetConfigQuery();

    return (
        <header
            className={cn(
                'fixed top-0 left-0 w-full z-20 transition-all ease-in-out duration-200 flex flex-col',
                computeBgColor()
            )}>
            <div
                className={cn(
                    'flex items-center min-h-14 justify-between w-full px-4 py-3 md:px-8 gap-4',
                    isSubscribed && showSidebar
                        ? 'lg:px-6'
                        : noPadding
                        ? 'lg:px-16'
                        : 'lg:px-12'
                )}>
                <div className="flex items-center flex-auto gap-4 md:flex-1 lg:flex-auto lg:gap-8">
                    {isShowHamburgerMenu && (
                        <FiMenu
                            className="text-white lg:hidden"
                            size={20}
                            onClick={() => setOpenSidebar(true)}
                        />
                    )}
                    <Link href={isSubscribed ? '/dashboard' : '/'}>
                        <span className="text-2xl font-bold cursor-pointer font-[Urbanist] lg:hidden">
                            G
                        </span>
                        <span className="text-2xl font-bold cursor-pointer font-[Urbanist] hidden lg:flex">
                            Gradient
                        </span>
                    </Link>
                    <div
                        className={cn(
                            'items-center gap-6 hidden lg:flex',
                            isSubscribed && showSidebar && '!hidden'
                        )}>
                        <NavigationButton
                            key={UNAUTHENTICATED_NAVBAR_BUTTONS[0].name}
                            {...UNAUTHENTICATED_NAVBAR_BUTTONS[0]}
                        />
                        {configData?.configs.is_copilot_config_enabled && (
                            <NavigationButton
                                name="Copilot AI"
                                title="Copilot AI"
                                url="/copilot"
                                IconActive={CopilotIconFill}
                                IconUnactive={CopilotIconLine}
                                tooltip="Copilot AI gratis selama versi Beta!"
                            />
                        )}
                        <NavigationButton
                            name="Community"
                            title="Diskusi"
                            url="/komunitas"
                            IconActive={DiskusiIconFill}
                            IconUnactive={DiskusiIcon}
                        />
                        <NavigationButton
                            key={UNAUTHENTICATED_NAVBAR_BUTTONS[1].name}
                            {...UNAUTHENTICATED_NAVBAR_BUTTONS[1]}
                        />
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setOpenToolsDropdown(!openToolsDropdown)
                                }
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors whitespace-nowrap">
                                {openToolsDropdown ? (
                                    <PencilOnLineIconFill />
                                ) : (
                                    <PencilOnLineIcon />
                                )}
                                <span>Alat Belajar</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                        openToolsDropdown ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {openToolsDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-[#1A1A1A] rounded-lg shadow-lg py-2 z-50">
                                    <Link
                                        href="/alat-belajar"
                                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#2A2A2A] transition-colors">
                                        Semua
                                    </Link>
                                    <Link
                                        href="/flashcards"
                                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#2A2A2A] transition-colors">
                                        Flashcard
                                    </Link>
                                    {configData?.configs
                                        .is_exercise_config_enabled && (
                                        <Link
                                            href="/latihan"
                                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#2A2A2A] transition-colors">
                                            Quiz
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {isShowSidebar && (
                        <div className="hidden md:block w-[250px] h-[64px] fixed top-0 left-0 bg-[#121212] z-[-1]" />
                    )}
                    <div
                        className={cn(
                            'w-full max-w-lg',
                            isShowSidebar && 'lg:ml-[250px] lg:pl-6 lg:absolute'
                        )}>
                        <SearchBar />
                    </div>
                </div>
                {paymentPage ? (
                    <Button
                        variant="primary"
                        target="__blank"
                        href="https://www.instagram.com/gradient_idn/"
                        eventName="Contact Us Button">
                        <span className="flex items-center">
                            <FaInstagram className="mr-2" /> Hubungi Kami
                        </span>
                    </Button>
                ) : (
                    <>
                        <div className="hidden font-bold md:flex">
                            {isAuthenticated ? (
                                <UserProfile />
                            ) : (
                                <AuthButtons />
                            )}
                        </div>

                        <div className="flex gap-4 text-3xl md:hidden">
                            {!isAuthenticated ? (
                                <AuthButtons />
                            ) : (
                                <div className="flex items-center gap-4">
                                    <button
                                        className="flex items-center text-base font-bold"
                                        onClick={() =>
                                            setOpenMobile(!openMobile)
                                        }>
                                        <UserAvatar profile={profile} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <MobileNavbar
                openMobile={openMobile}
                setOpenMobile={setOpenMobile}
            />
            <MobileSidebar
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
                configData={configData}
            />
        </header>
    );
};

export default Navbar;
