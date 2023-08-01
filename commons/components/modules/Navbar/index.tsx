import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import {
    MdArrowDropDown,
    MdHistory,
    MdLogout,
    MdOutlinePersonOutline
} from 'react-icons/md';
import useWindowSize from 'commons/hooks/useWindowSize';
import { renderName } from 'commons/utils';
import MobileNavbar from './mobile';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCurrentUser,
    getIsAuthenticated
} from 'authentication/redux/selectors/userSelector';
import { removeUser } from 'authentication/redux/slices/userSlice';
import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import MobileSidebar from '../Sidebar/mobile';
import Avatar from 'react-avatar';
import Image from 'next/image';
import AuthContext from 'authentication/contexts/AuthProvider';
import { HiOutlineUsers } from 'react-icons/hi';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';

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
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();
    const { profile } = useContext(AuthContext);
    const user = useSelector(getCurrentUser);
    const [isHovered, setHovered] = useState(false);
    const [isNavbarHovered, setNavbarHovered] = useState(false);
    const [isProfileHovered, setProfileHovered] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const pickedColorScheme = {
        bgColor: lightMode ? 'bg-white' : 'bg-black',
        color: lightMode ? 'text-black' : 'text-white'
    };
    const { height } = useWindowSize();
    const router = useRouter();
    const dispatch = useDispatch();
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = (): void => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };
    const { data: configData } = useGetConfigQuery();

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

            return '';
        }

        return lightMode ? 'bg-white text-black shadow-md' : 'bg-[#171717]';
    };

    const isShowNavbarMenu = (): boolean => {
        if (
            router.pathname.includes('kelas/[id]/') ||
            router.pathname.includes('astronotes/') ||
            router.pathname.includes('referal')
        ) {
            return true;
        }

        return false;
    };

    const onMouseLeaveNavbar = (): void => {
        if (isHovered) {
            setHovered(false);
        }

        if (isProfileHovered) {
            setProfileHovered(false);
        }

        setNavbarHovered(false);
    };

    const onMouseLeaveProfile = (): void => {
        if (isNavbarHovered) {
            setProfileHovered(true);
        } else {
            setProfileHovered(false);
        }
    };

    const onMouseEnterProfile = (): void => {
        setHovered(false);
        setProfileHovered(true);
    };

    const onMouseEnterOther = (): void => {
        setHovered(false);
        setProfileHovered(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-20 ${computeBgColor()} transition-all ease-in-out duration-200`}
            onMouseEnter={() => setNavbarHovered(true)}
            onMouseLeave={onMouseLeaveNavbar}>
            <div className="flex items-center justify-between w-full px-4 py-4 md:px-6">
                <div className="flex gap-4 items-center">
                    {isAuthenticated && (
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
                    {!isMobileBreakpoints && isShowNavbarMenu() && (
                        <div className="flex gap-6 pl-4">
                            <Button
                                href="/"
                                variant="custom"
                                className={`!p-0 font-body font-normal text-xs text-neutral-400 ${
                                    lightMode
                                        ? 'hover:text-black'
                                        : 'hover:text-white'
                                }`}>
                                Home
                            </Button>
                            {configData?.configs
                                .is_community_config_enabled && (
                                <Button
                                    href="/komunitas"
                                    variant="custom"
                                    className={`!p-0 font-body font-normal text-xs text-neutral-400 ${
                                        lightMode
                                            ? 'hover:text-black'
                                            : 'hover:text-white'
                                    }`}>
                                    Komunitas
                                </Button>
                            )}
                            <Button
                                href="/kelas"
                                variant="custom"
                                className={`!p-0 font-body font-normal text-xs text-neutral-400 ${
                                    lightMode
                                        ? 'hover:text-black'
                                        : 'hover:text-white'
                                }`}>
                                Kelas
                            </Button>
                            {/* <Button
                                    href="/perpustakaan"
                                    variant="custom"
                                    className={`!p-0 font-body font-normal text-xs text-neutral-400 ${
                                        lightMode 
                                            ? 'hover:text-black'
                                            : 'hover:text-white'
                                    }`}>
                                    Perpustakaan
                                </Button> */}
                        </div>
                    )}
                </div>
                {paymentPage ? (
                    <Button
                        variant="primary"
                        target="__blank"
                        href="https://www.instagram.com/gradient_idn/">
                        <span className="flex items-center">
                            <FaInstagram className="mr-2" /> Hubungi Kami
                        </span>
                    </Button>
                ) : (
                    <>
                        <div className="hidden font-bold md:flex">
                            {!isAuthenticated && (
                                <Link href="/kelas">
                                    <nav
                                        className="ml-12 cursor-pointer hover:text-accent-blue"
                                        onMouseEnter={onMouseEnterOther}>
                                        Kelas
                                    </nav>
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <nav
                                    className={`ml-12 cursor-pointer hover:text-accent-blue relative ${
                                        router.pathname === '/dashboard' &&
                                        'text-accent-blue'
                                    } ${
                                        isProfileHovered && 'text-accent-blue'
                                    }`}
                                    onMouseEnter={onMouseEnterProfile}
                                    onMouseLeave={onMouseLeaveProfile}>
                                    <div className="flex items-center gap-2">
                                        {!profile ? (
                                            <div className="w-[23px] h-[23px] bg-neutral-600 animate-pulse rounded-full"></div>
                                        ) : !!profile.photo_profile ? (
                                            <div className="w-[23px] h-[23px] relative">
                                                <Image
                                                    src={profile.photo_profile}
                                                    layout="fill"
                                                    className="rounded-full"
                                                />
                                            </div>
                                        ) : (
                                            <Avatar
                                                name={profile.full_name}
                                                size="23"
                                                round
                                            />
                                        )}
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
                                    <div
                                        className={`p-4 min-w-[250px] top-10 right-0 absolute shadow-md rounded-md border border-[#2D2D2D] ${
                                            pickedColorScheme.bgColor
                                        } ${pickedColorScheme.color} ${
                                            isProfileHovered
                                                ? 'block'
                                                : 'hidden'
                                        }`}>
                                        <Link href={'/profil'}>
                                            <div
                                                className={`flex ${pickedColorScheme.color} hover:bg-[#1D1D1D] px-2 py-3 rounded-sm font-normal w-full items-center`}>
                                                <div>
                                                    <MdOutlinePersonOutline className="text-2xl" />
                                                </div>
                                                <div className="w-full ml-4">
                                                    <p className="text-base">
                                                        Profil
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link href={'/transaksi'}>
                                            <div
                                                className={`flex ${pickedColorScheme.color} hover:bg-[#1D1D1D] px-2 py-3 rounded-sm font-normal w-full items-center`}>
                                                <div>
                                                    <MdHistory className="text-2xl" />
                                                </div>
                                                <div className="w-full ml-4">
                                                    <p className="text-base">
                                                        Riwayat Pembelian
                                                    </p>
                                                    {/* <p className="text-xs text-accent-yellow">
                                                1 Menunggu pembayaran
                                            </p> */}
                                                </div>
                                            </div>
                                        </Link>
                                        {is_subscribed && (
                                            <Link href={'/referal'}>
                                                <div
                                                    className={`flex ${pickedColorScheme.color} hover:bg-[#1D1D1D] px-2 py-3 rounded-sm font-normal w-full items-center`}>
                                                    <div>
                                                        <HiOutlineUsers className="text-xl" />
                                                    </div>
                                                    <div className="w-full ml-4">
                                                        <p className="text-base">
                                                            Referal
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        )}
                                        <div
                                            className="flex items-center w-full font-normal text-accent-orange hover:bg-[#1D1D1D] px-2 py-3 rounded-sm"
                                            onClick={() =>
                                                dispatch(removeUser())
                                            }
                                            aria-hidden>
                                            <div>
                                                <MdLogout className="text-2xl" />
                                            </div>
                                            <div className="w-full ml-4">
                                                <p className="text-base">
                                                    Logout
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            ) : (
                                <Link href={AUTHENTICATION_ROUTE}>
                                    <nav className="ml-12 cursor-pointer">
                                        Masuk
                                    </nav>
                                </Link>
                            )}
                        </div>

                        <div className="flex gap-4 text-3xl md:hidden">
                            {!isAuthenticated ? (
                                <>
                                    <Link href="/kelas">
                                        <nav className="flex items-center text-base font-bold">
                                            Kelas
                                        </nav>
                                    </Link>
                                    <Link href={AUTHENTICATION_ROUTE}>
                                        <nav className="flex items-center text-base font-bold">
                                            Masuk
                                        </nav>
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        className="flex items-center text-base font-bold"
                                        onClick={() =>
                                            setOpenMobile(!openMobile)
                                        }>
                                        {!profile ? (
                                            <div className="w-[23px] h-[23px] bg-neutral-600 animate-pulse rounded-full"></div>
                                        ) : !!profile.photo_profile ? (
                                            <div className="w-[23px] h-[23px] relative">
                                                <Image
                                                    src={profile.photo_profile}
                                                    layout="fill"
                                                    className="rounded-full"
                                                />
                                            </div>
                                        ) : (
                                            <Avatar
                                                name={profile.full_name}
                                                size="23"
                                                round
                                            />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            {openMobile && (
                <MobileNavbar
                    closeMobile={setOpenMobile}
                    lightMode={lightMode}
                />
            )}
            {openSidebar && <MobileSidebar setOpenSidebar={setOpenSidebar} />}
        </header>
    );
};

export default Navbar;
