import Link from 'next/link';
import { MdFileDownload, MdHistory, MdLogout, MdPerson } from 'react-icons/md';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { cn } from 'commons/utils';
import { FaGift } from 'react-icons/fa';
import useLogout from 'authentication/hooks/useLogout';

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
    const { is_subscribed } = useCourseSubscription();
    const { logout } = useLogout();

    return openMobile ? (
        <>
            <div
                className={cn(
                    'w-full p-4 flex justify-between md:hidden z-50',
                    lightMode ? 'bg-white' : 'bg-[#171717]'
                )}>
                <div className="w-full">
                    <Link href={'/profil'}>
                        <div
                            className={cn(
                                'flex hover:text-accent-blue font-normal w-full items-center mb-4',
                                lightMode ? 'text-black' : 'text-white'
                            )}>
                            <MdPerson size={20} />
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
                            <MdHistory size={20} />
                            <div className="w-full ml-4">
                                <p className="text-base">Riwayat Pembelian</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/kelas/downloads">
                        <div
                            className={cn(
                                'flex hover:text-accent-blue font-normal w-full items-center mb-4',
                                lightMode ? 'text-black' : 'text-white'
                            )}>
                            <MdFileDownload size={20} />
                            <div className="w-full ml-4">
                                <p className="text-base">Downloads</p>
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
                                <FaGift size={20} />
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
                        }}
                        aria-hidden>
                        <MdLogout size={20} />
                        <div className="w-full ml-4">
                            <p className="text-base">Logout</p>
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
