import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { MdArrowDropDown, MdClose } from 'react-icons/md';
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
import MobileSidebar from '../Sidebar/mobile';
import AuthContext from 'authentication/contexts/AuthProvider';
import { useTracker } from 'tracker/tracker';
import { useDebouncedCallback } from 'use-debounce';
import LeftNavbarMenu from './components/LeftNavbarMenu';
import UserProfile from './components/UserProfile';
import UserProfileDropdown from './components/UserProfileDropdown';
import NavMenuIcons from './components/NavMenuIcons';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useGetDetailPacketOfferQuery } from 'payment/redux/api/subscriptionApi';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import clsx from 'clsx';
import { BiBookReader } from 'react-icons/bi';
import { RiBookOpenLine, RiQuestionnaireLine } from 'react-icons/ri';
import { cn } from 'commons/utils';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';

export const LEARNING_PAGES = [
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
    fullHeightSidebar,
    showSubscriptionReminder,
    setCloseReminder
}: {
    paymentPage: boolean;
    shouldTransparent: boolean;
    courses?: Course[];
    lightMode?: boolean;
    showSidebar?: boolean;
    fullHeightSidebar?: boolean;
    showSubscriptionReminder?: boolean;
    setCloseReminder?: (value: boolean) => void;
}): JSX.Element => {
    const tracker = useTracker();

    const { isDesktopBreakpoints } = useWindowBreakpoints();
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
    const { pathname } = router;
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
            return lightMode ? 'bg-white shadow-md text-black' : 'bg-[#222222]';
        }

        if (shouldTransparent) {
            if (scrollPosition >= height / 2) {
                return is_subscribed ? 'bg-black' : 'bg-[#222222]';
            }
            return 'bg-transparent hover:bg-[#222222]';
        }

        if (paymentPage) {
            return lightMode
                ? 'bg-white shadow-md'
                : is_subscribed
                ? 'bg-black'
                : 'bg-[#222222]';
        }

        if (showSidebar && fullHeightSidebar) {
            if (scrollPosition >= 60) {
                return is_subscribed ? 'bg-black' : 'bg-[#222222]';
            }

            return shouldTransparent
                ? ''
                : is_subscribed
                ? 'bg-black'
                : 'bg-[#222222]';
        }

        return lightMode
            ? 'bg-white text-black shadow-md'
            : is_subscribed
            ? 'bg-black'
            : 'bg-[#222222]';
    };

    const isShowHamburgerMenu = (): boolean =>
        !LEARNING_PAGES.some((path) => router.asPath.includes(path)) ||
        (LEARNING_PAGES.some((path) => router.asPath.includes(path)) &&
            !is_subscribed &&
            !isDesktopBreakpoints);
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

    const halamanPembayaran = router.pathname === '/pembayaran';
    const { data: packet } = useGetDetailPacketOfferQuery(
        halamanPembayaran ? (router.query.packetId as string) : skipToken
    );

    const { data: configData } = useGetConfigQuery();

    const { expiryDay, packet_id, subscription_id, is_subscribed } =
        useCourseSubscription();
    const [closeSubscriptionReminder, setCloseSubscriptionReminder] =
        useState(true);
    useEffect(() => {
        setCloseSubscriptionReminder(expiryDay > 7);
    }, [expiryDay]);

    useEffect(() => {
        setCloseReminder?.(closeSubscriptionReminder);
    }, [closeSubscriptionReminder, setCloseReminder]);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-20 ${computeBgColor()} transition-all ease-in-out duration-200 flex flex-col`}
            onMouseEnter={() => setNavbarHovered(true)}
            onMouseLeave={onMouseLeaveNavbar}>
            <div
                className={cn(
                    'flex items-center justify-between w-full px-4 py-3 md:px-8',
                    is_subscribed ? 'lg:pl-6 lg:pr-24' : 'lg:px-24'
                )}>
                <div className="flex items-center gap-4">
                    {(isLandingPageRevampOn ||
                        (!isLandingPageRevampOn && isAuthenticated)) &&
                        isShowHamburgerMenu() && (
                            <FiMenu
                                className="lg:hidden"
                                stroke="#ffffff"
                                size={20}
                                onClick={() => setOpenSidebar(true)}
                            />
                        )}
                    <Link href={'/'}>
                        <span className="text-2xl font-bold cursor-pointer font-[Urbanist]">
                            {isDesktopBreakpoints ? 'Gradient' : 'G'}
                        </span>
                    </Link>
                    {isDesktopBreakpoints && !is_subscribed && (
                        <div className="flex items-center ml-7 gap-6">
                            <Link
                                href={'/kelas'}
                                onClick={() => {
                                    tracker?.genericTrack(
                                        'Click Class Navigation'
                                    );
                                }}>
                                <span
                                    className={`flex gap-4 cursor-pointer ${
                                        pathname === '/kelas'
                                            ? 'text-[#CCCCCC]'
                                            : 'text-[#999999]'
                                    }  hover:text-[#666666]`}>
                                    <BiBookReader size={20} />
                                    Kelas
                                </span>
                            </Link>
                            <Link
                                href={'/astronotes'}
                                onClick={() => {
                                    tracker?.genericTrack(
                                        'Click Library Navigation'
                                    );
                                }}>
                                <span
                                    className={cn(
                                        'flex gap-4 cursor-pointer hover:text-[#666666]',
                                        pathname.includes('/astronotes')
                                            ? 'text-[#CCCCCC]'
                                            : 'text-[#999999]'
                                    )}>
                                    <RiBookOpenLine size={20} />
                                    Perpustakaan
                                </span>
                            </Link>
                            {configData?.configs
                                .is_community_config_enabled && (
                                <Link
                                    href={'/komunitas'}
                                    onClick={() => {
                                        tracker?.genericTrack(
                                            'Click Community Navigation'
                                        );
                                    }}>
                                    <span
                                        className={cn(
                                            'flex gap-4 cursor-pointer hover:text-[#666666]',
                                            pathname.includes('/komunitas')
                                                ? 'text-[#CCCCCC]'
                                                : 'text-[#999999]'
                                        )}>
                                        <RiQuestionnaireLine size={20} />
                                        Komunitas
                                    </span>
                                </Link>
                            )}
                        </div>
                    )}
                    {showSidebar &&
                        fullHeightSidebar &&
                        (isAuthenticated || isLandingPageRevampOn) &&
                        is_subscribed && (
                            <div className="hidden md:block w-[250px] h-[64px] fixed top-0 left-0 bg-[#121212] z-[-1]" />
                        )}
                    <LeftNavbarMenu
                        lightMode={lightMode}
                        showSidebar={showSidebar}
                    />
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
                                        <div className="flex gap-2">
                                            <Button
                                                variant="custom"
                                                className="text-sm lg:text-base text-[#B6A6F3]"
                                                href="/masuk"
                                                eventName="Login Button on Navbar">
                                                Masuk
                                            </Button>
                                            <Button
                                                variant="primary"
                                                className="text-sm lg:text-base"
                                                href="/daftar"
                                                eventName="Register Button on Navbar">
                                                Daftar
                                            </Button>
                                        </div>
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
                                                href="/masuk"
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
                                    <div className="flex gap-2">
                                        <Button
                                            variant="custom"
                                            className="text-sm lg:text-base text-[#B6A6F3]"
                                            href="/masuk"
                                            eventName="Login Button on Navbar">
                                            Masuk
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="text-xs"
                                            href="/daftar"
                                            eventName="Register Button on Navbar">
                                            Daftar
                                        </Button>
                                    </div>
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
                                            href="/masuk"
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

            {halamanPembayaran && (
                <section className="px-4 py-4 md:px-6 bg-[#121212] flex justify-between items-center w-full">
                    <p className="flex items-center gap-2 font-body">
                        <span className="text-sm uppercase">
                            {packet?.packet_name.replace('Paket', '')}
                        </span>
                        <span className="w-[1px] h-[18px] bg-neutral-600"></span>
                        <span className="text-base font-bold">
                            Rp{Number(packet?.price).toLocaleString('id')}
                        </span>
                    </p>

                    <Link
                        href={{
                            pathname: '/pembayaran/ubah-paket',
                            query: router.query
                        }}
                        className="text-[#7264EB] font-sans font-bold text-sm">
                        Ubah Paket
                    </Link>
                </section>
            )}

            {showSubscriptionReminder &&
                is_subscribed &&
                !closeSubscriptionReminder && (
                    <section
                        className={clsx(
                            showSidebar &&
                                'md:max-w-[calc(100%-250px)] absolute right-0 top-[56px]',
                            'px-4 py-4 md:px-6 bg-[#121212] flex justify-between items-center w-full'
                        )}>
                        <p className="flex items-center gap-2 text-sm font-body">
                            Langganan habis dalam {expiryDay} hari
                        </p>

                        <div className="flex items-center gap-6">
                            <Link
                                href={{
                                    pathname: '/pembayaran',
                                    query: {
                                        packetId: packet_id,
                                        subscriptionId: subscription_id
                                    }
                                }}
                                className="text-[#7264EB] font-sans font-bold text-sm">
                                Perbarui
                            </Link>
                            <button
                                type="button"
                                onClick={() =>
                                    setCloseSubscriptionReminder(true)
                                }>
                                <MdClose
                                    className="text-neutral-600"
                                    size={20}
                                />
                            </button>
                        </div>
                    </section>
                )}

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
