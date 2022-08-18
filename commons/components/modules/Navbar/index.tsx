import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import { AiOutlineArrowRight } from 'react-icons/ai';
import { FaWhatsapp } from 'react-icons/fa';
import {
    MdArrowDropDown,
    MdClose,
    MdHistory,
    MdLogout,
    MdMenu,
    MdOutlineBook
} from 'react-icons/md';
import { useAuth } from 'authentication/contexts/AuthProvider';
import useWindowSize from 'commons/hooks/useWindowSize';
import { renderName } from 'commons/utils';
import MobileNavbar from './mobile';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCurrentUser,
    getIsAuthenticated
} from 'authentication/redux/selectors/userSelector';
import { removeUser } from 'authentication/redux/slices/userSlice';
// import CourseCard from 'src/courses/components/CourseCard';

const Navbar = ({
    paymentPage,
    shouldTransparent
}: // courses
{
    paymentPage: boolean;
    shouldTransparent: boolean;
    courses?: Course[];
}): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const user = useSelector(getCurrentUser);
    const [isHovered, setHovered] = useState(false);
    const [isNavbarHovered, setNavbarHovered] = useState(false);
    const [isProfileHovered, setProfileHovered] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const { height } = useWindowSize();
    const router = useRouter();
    const dispatch = useDispatch();

    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = (): void => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const computeBgColor = (): string => {
        if (openMobile) {
            return 'bg-[#171717]';
        }

        if (shouldTransparent) {
            if (scrollPosition >= height / 2) {
                return 'bg-[#171717]';
            }
            return 'bg-transparent hover:bg-[#171717]';
        }

        if (paymentPage) {
            return 'bg-[#171717]';
        }

        return 'bg-[#171717]';
    };

    const onMouseLeaveKelas = (): void => {
        if (isNavbarHovered) {
            setHovered(true);
        } else {
            setHovered(false);
        }
    };

    const onMouseEnterKelas = (): void => {
        setProfileHovered(false);
        setHovered(true);
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
            className={`fixed top-0 left-0 w-full z-20 ${computeBgColor()}`}
            onMouseEnter={() => setNavbarHovered(true)}
            onMouseLeave={onMouseLeaveNavbar}>
            <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
                <Link href={'/'}>
                    <span className="text-2xl font-bold cursor-pointer font-[Urbanist]">
                        Gradient
                    </span>
                </Link>
                {paymentPage ? (
                    <Link href="https://api.whatsapp.com/send?phone=+6281310028280">
                        <div className="flex rounded-full px-4 py-2 bg-[#0F460F]">
                            <span className="text-base font-bold flex items-center">
                                <FaWhatsapp className="mr-2 text-xl" />
                                Hubungi kami
                            </span>
                        </div>
                    </Link>
                ) : (
                    <>
                        <div className="hidden md:flex font-bold">
                            <Link href={'/kelas'}>
                                <nav
                                    className={`ml-12 cursor-pointer hover:text-accent-blue h-full ${
                                        router.pathname === '/kelas' &&
                                        'text-accent-blue'
                                    } ${isHovered && 'text-accent-blue'}`}
                                    onMouseEnter={onMouseEnterKelas}
                                    onMouseLeave={onMouseLeaveKelas}>
                                    <span className="flex items-center">
                                        Kelas
                                        {/* {courses && <MdArrowDropDown />} */}
                                    </span>
                                </nav>
                            </Link>
                            <nav
                                className="ml-12 cursor-pointer hover:text-accent-blue"
                                onMouseEnter={onMouseEnterOther}>
                                <a
                                    href="https://discord.gg/ZC8R3ePHVF"
                                    target="_blank"
                                    rel="noreferrer">
                                    Gabung Discord
                                </a>
                            </nav>
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
                                    <span className="flex items-center">
                                        {renderName(user.email, user.full_name)}
                                        <MdArrowDropDown />
                                    </span>
                                    <div
                                        className={`px-8 py-4 min-w-[250px] top-10 right-0 absolute rounded-b-md bg-[#171717] ${
                                            isProfileHovered
                                                ? 'block'
                                                : 'hidden'
                                        }`}>
                                        <Link href={'/transaksi'}>
                                            <div className="flex text-white hover:text-accent-blue font-normal w-full items-center mb-4">
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
                                        <Link href={'/kelas/?flag=kelasku'}>
                                            <div className="flex text-white hover:text-accent-blue  font-normal w-full items-center mb-4">
                                                <div>
                                                    <MdOutlineBook className="text-2xl" />
                                                </div>
                                                <div className="w-full ml-4">
                                                    <p className="text-base">
                                                        Kelasku
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                        <div
                                            className="flex text-accent-orange hover:text-state-error font-normal w-full items-center mb-4"
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
                                <nav
                                    className="ml-12 cursor-pointer"
                                    onClick={() => setModalAuthOpen(1)}
                                    aria-hidden={true}
                                    onMouseEnter={() => setHovered(false)}>
                                    Masuk
                                </nav>
                            )}
                        </div>

                        <div className="flex md:hidden text-3xl">
                            {openMobile ? (
                                <MdClose onClick={() => setOpenMobile(false)} />
                            ) : (
                                <MdMenu onClick={() => setOpenMobile(true)} />
                            )}
                        </div>
                    </>
                )}
            </div>

            {openMobile && <MobileNavbar closeMobile={setOpenMobile} />}

            {/* {courses && (
                <div
                    className={`w-full px-8 py-4 bg-[#171717] flex justify-between ${
                        isHovered ? 'block' : 'hidden'
                    }`}>
                    <div className="w-1/4">
                        <h1 className="font-bold text-[4rem]">Kelas</h1>
                    </div>
                    <div className="w-3/4">
                        <div className="w-full grid grid-cols-3 gap-4 justify-end">
                            {courses?.map((course: Course) => (
                                <CourseCard course={course} key={course.uuid} />
                            ))}
                        </div>
                        <Link href={'/kelas'}>
                            <div className="mt-4 flex items-center cursor-pointer">
                                <span className="flex items-center font-bold text-white">
                                    Lihat semua kelas
                                </span>
                                <AiOutlineArrowRight className="text-white ml-2" />
                            </div>
                        </Link>
                    </div>
                </div>
            )} */}
        </header>
    );
};

export default Navbar;
