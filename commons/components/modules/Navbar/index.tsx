import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { MdArrowDropDown } from 'react-icons/md';
import useWindowSize from 'commons/hooks/useWindowSize';
import { renderName } from 'commons/utils';
import MobileNavbar from './components/MobileNavbar';
import { useSelector } from 'react-redux';
import {
    getCurrentUser,
    getIsAuthenticated
} from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import MobileSidebar from '../Sidebar/mobile';
import AuthContext from 'authentication/contexts/AuthProvider';
import { useTracker } from 'tracker/tracker';
import { useDebouncedCallback } from 'use-debounce';
import LeftNavbarMenu from './components/LeftNavbarMenu';
import UserProfile from './components/UserProfile';
import UserProfileDropdown from './components/UserProfileDropdown';
import NavMenuIcons from './components/NavMenuIcons';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

const HIDE_HAMBURGER_MENU_ON = [
    '/dashboard',
    '/komunitas',
    '/astronotes',
    '/kelas'
];

const Navbar = ({
    paymentPage,
    shouldTransparent,
    lightMode,
    showSidebar,
    fullHeightSidebar
}: {
    paymentPage: boolean;
    shouldTransparent: boolean;
    courses?: Course[];
    lightMode?: boolean;
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
}): JSX.Element => {
    const tracker = useTracker();

    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { profile } = useContext(AuthContext);
    const user = useSelector(getCurrentUser);
    const [isHovered, setHovered] = useState(false);
    const [isNavbarHovered, setNavbarHovered] = useState(false);
    const [isProfileHovered, setProfileHovered] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const { height } = useWindowSize();
    const router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = (): void => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const computeBgColor = (): string => {
        if (openMobile) {
            return lightMode ? 'bg-white shadow-md text-black' : 'bg-[#171717]';
        }

        if (shouldTransparent) {
            if (scrollPosition >= height / 2) {
                return 'bg-[#171717]';
            }
            return 'bg-transparent hover:bg-[#171717]';
        }

        if (paymentPage) {
            return lightMode ? 'bg-white shadow-md' : 'bg-[#171717]';
        }

        if (showSidebar && fullHeightSidebar) {
            if (scrollPosition >= 60) {
                return 'bg-[#171717] md:bg-[#121212]';
            }

            return shouldTransparent ? '' : 'bg-[#171717] md:bg-[#121212]';
        }

        return lightMode ? 'bg-white text-black shadow-md' : 'bg-[#171717]';
    };

    const isShowHamburgerMenu = (): boolean =>
        !HIDE_HAMBURGER_MENU_ON.includes(router.pathname);

    const onMouseLeaveNavbar = (): void => {
        if (isHovered) setHovered(false);
        if (isProfileHovered) setProfileHovered(false);

        setNavbarHovered(false);
    };

    const onMouseLeaveProfile = (): void => {
        if (isNavbarHovered) setProfileHovered(true);
        else setProfileHovered(false);
    };

    const trackProfileNameClickOrHover = useDebouncedCallback(
        () => tracker?.genericTrack('Click/Hover Profile Name'),
        1000
    );

    const onMouseEnterProfile = (): void => {
        trackProfileNameClickOrHover();
        setHovered(false);
        setProfileHovered(true);
    };

    const onMouseEnterOther = (): void => {
        setHovered(false);
        setProfileHovered(false);
    };

    const onClickLoginLink = (): void => {
        tracker?.trackButtonClick('Login Button on Navbar', 'Masuk');
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-20 ${computeBgColor()} transition-all ease-in-out duration-200`}
            onMouseEnter={() => setNavbarHovered(true)}
            onMouseLeave={onMouseLeaveNavbar}>
            <div className="flex items-center justify-between w-full px-4 py-4 md:px-6">
                <div className="flex items-center gap-4">
                    {(isLandingPageRevampOn ||
                        (!isLandingPageRevampOn && isAuthenticated)) &&
                        isShowHamburgerMenu() && (
                            <FiMenu
                                className="md:hidden"
                                stroke="#666666"
                                onClick={() => setOpenSidebar(true)}
                            />
                        )}
                    <Link href={'/'}>
                        <span className="text-2xl font-bold cursor-pointer font-[Urbanist]">
                            {isMobileBreakpoints ? 'G' : 'Gradient'}
                        </span>
                    </Link>
                    {showSidebar && fullHeightSidebar && isAuthenticated && (
                        <div className="hidden md:block w-[250px] h-[64px] fixed top-0 left-0 bg-[#121212] z-[-1]" />
                    )}
                    <LeftNavbarMenu lightMode={lightMode} />
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
                                <nav
                                    className={`ml-12 flex gap-6 cursor-pointer relative`}>
                                    {router.pathname === '/' && (
                                        <Link href="/kelas">
                                            <nav
                                                className="ml-12 cursor-pointer hover:text-accent-blue"
                                                onMouseEnter={
                                                    onMouseEnterOther
                                                }>
                                                Kelas
                                            </nav>
                                        </Link>
                                    )}
                                    <NavMenuIcons />
                                    <div
                                        className={`flex items-center gap-2 hover:text-accent-blue ${
                                            router.pathname === '/dashboard' &&
                                            'text-accent-blue'
                                        } ${
                                            isProfileHovered &&
                                            'text-accent-blue'
                                        }`}
                                        onMouseEnter={onMouseEnterProfile}
                                        onMouseLeave={onMouseLeaveProfile}>
                                        <UserProfile profile={profile} />
                                        <div className="flex items-center">
                                            <span>
                                                {renderName(
                                                    user.email,
                                                    user.full_name
                                                )}
                                            </span>
                                            <MdArrowDropDown />
                                        </div>
                                    </div>
                                    <UserProfileDropdown
                                        isProfileHovered={isProfileHovered}
                                        lightMode={lightMode}
                                    />
                                </nav>
                            ) : (
                                <>
                                    {isLandingPageRevampOn ? (
                                        <Button
                                            variant="primary"
                                            href={AUTHENTICATION_ROUTE}
                                            eventName="Login Button on Navbar">
                                            Masuk
                                        </Button>
                                    ) : (
                                        <>
                                            <Link href="/kelas">
                                                <nav
                                                    className="ml-12 cursor-pointer hover:text-accent-blue"
                                                    onMouseEnter={
                                                        onMouseEnterOther
                                                    }>
                                                    Kelas
                                                </nav>
                                            </Link>
                                            <Link
                                                href={AUTHENTICATION_ROUTE}
                                                onClick={onClickLoginLink}>
                                                <nav className="ml-12 cursor-pointer">
                                                    Masuk
                                                </nav>
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 text-3xl md:hidden">
                            {!isAuthenticated ? (
                                isLandingPageRevampOn ? (
                                    <Button
                                        variant="primary"
                                        className="text-xs"
                                        href={AUTHENTICATION_ROUTE}
                                        eventName="Login Button on Navbar">
                                        Masuk
                                    </Button>
                                ) : (
                                    <>
                                        <Link
                                            href="/kelas"
                                            onClick={() =>
                                                tracker?.genericTrack(
                                                    'Click Class Button On Top Navbar'
                                                )
                                            }>
                                            <nav className="flex items-center text-base font-bold">
                                                Kelas
                                            </nav>
                                        </Link>
                                        <Link
                                            href={AUTHENTICATION_ROUTE}
                                            onClick={onClickLoginLink}>
                                            <nav className="flex items-center text-base font-bold">
                                                Masuk
                                            </nav>
                                        </Link>
                                    </>
                                )
                            ) : (
                                <div className="flex items-center gap-4">
                                    {router.pathname === '/' && (
                                        <Link
                                            href="/kelas"
                                            onClick={() =>
                                                tracker?.genericTrack(
                                                    'Click Class Button On Top Navbar'
                                                )
                                            }>
                                            <nav
                                                className="ml-12 text-sm font-bold cursor-pointer hover:text-accent-blue"
                                                onMouseEnter={
                                                    onMouseEnterOther
                                                }>
                                                Kelas
                                            </nav>
                                        </Link>
                                    )}

                                    <NavMenuIcons />
                                    <button
                                        className="flex items-center text-base font-bold"
                                        onClick={() =>
                                            setOpenMobile(!openMobile)
                                        }>
                                        <UserProfile profile={profile} />
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
            />
        </header>
    );
};

export default Navbar;
