import Link from 'next/link';
import { MdHistory, MdLogout, MdOutlinePersonOutline } from 'react-icons/md';
import { HiOutlineUsers } from 'react-icons/hi';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useLogoutMutation } from 'authentication/redux/api/authApi';
import { useRouter } from 'next/router';
import { cn } from 'commons/utils';
import { useDispatch } from 'react-redux';
import { clearCache } from 'authentication/redux/slices/userSlice';

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
    const router = useRouter();
    const { is_subscribed } = useCourseSubscription();
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();

    return openMobile ? (
        <>
            <div
                className={cn(
                    'w-full p-4 flex justify-between md:hidden z-50',
                    lightMode ? 'bg-white' : 'bg-[#171717]'
                )}>
                <div className="w-full">
                    <div className="pb-4">
                        <Link href={'/profil'}>
                            <div
                                className={cn(
                                    'flex hover:text-accent-blue font-normal w-full items-center mb-4',
                                    lightMode ? 'text-black' : 'text-white'
                                )}>
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
                                className={cn(
                                    'flex hover:text-accent-blue font-normal w-full items-center mb-4',
                                    lightMode ? 'text-black' : 'text-white'
                                )}>
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
                                    className={cn(
                                        'flex hover:text-accent-blue font-normal w-full items-center mb-4',
                                        lightMode ? 'text-black' : 'text-white'
                                    )}>
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
                            onClick={async () => {
                                await logout();
                                dispatch(clearCache());
                                router.push('/');
                            }}
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
