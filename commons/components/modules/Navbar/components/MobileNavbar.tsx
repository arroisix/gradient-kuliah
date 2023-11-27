import Link from 'next/link';
import { MdHistory, MdLogout, MdOutlinePersonOutline } from 'react-icons/md';
import { removeUser } from 'authentication/redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineUsers } from 'react-icons/hi';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

interface MobileNavbarProps {
    openMobile: boolean;
    setOpenMobile: (status: boolean) => void;
    lightMode?: boolean;
}

const MobileNavbar = ({
    openMobile,
    setOpenMobile,
    lightMode
}: MobileNavbarProps): JSX.Element => {
    const dispatch = useDispatch();
    const { is_subscribed } = useCourseSubscription();

    return openMobile ? (
        <>
            <div
                className={`w-full p-4 ${
                    lightMode ? 'bg-white' : 'bg-[#171717]'
                } flex justify-between md:hidden`}>
                <div className="w-full">
                    <div className="pb-4">
                        <Link href={'/profil'}>
                            <div
                                className={`flex ${
                                    lightMode ? 'text-black' : 'text-white'
                                } hover:text-accent-blue font-normal w-full items-center mb-4`}>
                                <div>
                                    <MdOutlinePersonOutline className="text-2xl" />
                                </div>
                                <div className="w-full ml-4">
                                    <p className="text-base">Profil</p>
                                </div>
                            </div>
                        </Link>
                        <Link href={'/transaksi'}>
                            <div
                                className={`flex ${
                                    lightMode ? 'text-black' : 'text-white'
                                } hover:text-accent-blue font-normal w-full items-center mb-4`}>
                                <div>
                                    <MdHistory className="text-2xl" />
                                </div>
                                <div className="w-full ml-4">
                                    <p className="text-base">
                                        Riwayat Pembelian
                                    </p>
                                </div>
                            </div>
                        </Link>
                        {is_subscribed && (
                            <Link href={'/referral'}>
                                <div
                                    className={`flex ${
                                        lightMode ? 'text-black' : 'text-white'
                                    } hover:text-accent-blue font-normal w-full items-center mb-4`}>
                                    <div>
                                        <HiOutlineUsers className="text-xl" />
                                    </div>
                                    <div className="w-full ml-4">
                                        <p className="text-base">Referral</p>
                                    </div>
                                </div>
                            </Link>
                        )}
                        <div
                            className="flex items-center w-full font-normal text-accent-orange hover:text-state-error"
                            onClick={() => dispatch(removeUser())}
                            aria-hidden>
                            <div>
                                <MdLogout className="text-2xl" />
                            </div>
                            <div className="w-full ml-4">
                                <p className="text-base">Logout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                aria-hidden
                className="absolute w-screen h-screen bg-black opacity-30"
                onClick={() => setOpenMobile(false)}></div>
        </>
    ) : (
        <></>
    );
};

export default MobileNavbar;
