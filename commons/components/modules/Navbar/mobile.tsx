import Link from 'next/link';
import { useState } from 'react';
import {
    MdChevronRight,
    MdHistory,
    MdLogout,
    MdOutlineBook
} from 'react-icons/md';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { renderName } from 'commons/utils';
import {
    getIsAuthenticated,
    getCurrentUser
} from 'authentication/redux/selectors/userSelector';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from 'authentication/redux/slices/userSlice';

interface MobileNavbarProps {
    closeMobile: (status: boolean) => void;
}

const MobileNavbar = ({ closeMobile }: MobileNavbarProps): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const user = useSelector(getCurrentUser);
    const [detailOpen, setDetailOpen] = useState(false);
    const dispatch = useDispatch();

    return (
        <>
            <div
                className={`w-full p-4 bg-[#171717] flex justify-between md:hidden`}>
                <div className="w-full">
                    <Link href={'/kelas'}>
                        <nav className="w-full flex justify-between items-center text-2xl my-4">
                            <span className="flex items-center font-bold">
                                Kelas
                            </span>
                            <MdChevronRight />
                        </nav>
                    </Link>
                    {/* <Link href={'/kelas'}>
                        <nav className="w-full flex justify-between items-center text-2xl my-4">
                            <span className="flex items-center font-bold">
                                Gabung Discord
                            </span>
                            <MdChevronRight />
                        </nav>
                    </Link> */}
                    {isAuthenticated ? (
                        <>
                            <nav
                                className="w-full flex justify-between items-center text-2xl my-4"
                                aria-hidden
                                onClick={() => setDetailOpen(!detailOpen)}>
                                <span className="flex items-center font-bold">
                                    {renderName(user.email, user.full_name)}
                                </span>
                                <MdChevronRight
                                    className={
                                        detailOpen ? '-rotate-90' : 'rotate-90'
                                    }
                                />
                            </nav>
                            {detailOpen && (
                                <div className="w-full">
                                    <div className="pb-4">
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
                                </div>
                            )}
                        </>
                    ) : (
                        <nav
                            className="w-full flex justify-between items-center text-2xl my-4"
                            aria-hidden
                            onClick={() => setModalAuthOpen(1)}>
                            <span className="flex items-center font-bold">
                                Masuk
                            </span>
                            <MdChevronRight />
                        </nav>
                    )}
                </div>
            </div>
            <div
                aria-hidden
                className="w-screen h-screen absolute bg-black opacity-30"
                onClick={() => closeMobile(false)}></div>
        </>
    );
};

export default MobileNavbar;
