import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from 'src/authentication/contexts/AuthProvider';
import useWindowSize from 'src/commons/hooks/useWindowSize';
import { renderName } from 'src/commons/utils';

const Navbar = ({
    paymentPage,
    shouldTransparent
}: {
    paymentPage: boolean;
    shouldTransparent: boolean;
}): JSX.Element => {
    const { setModalAuthOpen, isAuthenticated, user } = useAuth();
    const { height } = useWindowSize();
    const router = useRouter();

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

    const computeBgColor = () => {
        if (shouldTransparent) {
            if (scrollPosition >= height) {
                return 'bg-[#171717]';
            }
            return 'bg-transparent';
        }

        if (paymentPage) {
            return 'bg-[#171717]';
        }

        return 'bg-[#171717]';
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-20 ${computeBgColor()}`}>
            <div className="w-full px-8 py-4 flex items-center justify-between">
                <Link href={'/'}>
                    <span className="text-2xl cursor-pointer">Gradient</span>
                </Link>
                {paymentPage ? (
                    <div>
                        <div className="rounded-full px-4 py-2 bg-[#0F460F]">
                            <span className="text-base font-bold flex items-center">
                                <FaWhatsapp className="mr-2 text-xl" />
                                Hubungi kami
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex font-bold">
                        <Link href={'/kelas'}>
                            <nav
                                className={`ml-12 cursor-pointer hover:text-accent-blue ${
                                    router.pathname === '/kelas' &&
                                    'text-accent-blue'
                                }`}>
                                Kelas
                            </nav>
                        </Link>
                        <nav className="ml-12 cursor-pointer hover:text-accent-blue">
                            Gabung Discord
                        </nav>
                        {isAuthenticated() ? (
                            <Link href={'/dashboard'}>
                                <nav
                                    className={`ml-12 cursor-pointer hover:text-accent-blue ${
                                        router.pathname === '/dashboard' &&
                                        'text-accent-blue'
                                    }`}>
                                    {renderName(user.email, user.fullName)}
                                </nav>
                            </Link>
                        ) : (
                            <nav
                                className="ml-12 cursor-pointer"
                                onClick={() => setModalAuthOpen(1)}
                                aria-hidden={true}>
                                Masuk
                            </nav>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
