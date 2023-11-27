import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { BiBookReader } from 'react-icons/bi';
import { FiHome } from 'react-icons/fi';
import { MdOutlineClose } from 'react-icons/md';
import {
    RiBookOpenLine,
    // RiBookOpenLine,
    // RiNotification3Line,
    RiQuestionnaireLine
} from 'react-icons/ri';
import { useTracker } from 'tracker/tracker';
import CommunityNotificationBadge from '../../elements/CommunityNotificationBadge';

const MobileSidebar = ({
    openSidebar,
    setOpenSidebar
}: {
    openSidebar: boolean;
    setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
    const route = useRouter();
    const tracker = useTracker();
    const { pathname } = route;
    const { data: configData } = useGetConfigQuery();

    return openSidebar ? (
        <div className="fixed z-[100] top-0 right-0 w-screen h-screen bg-[#121212]">
            <header className="flex items-center justify-between w-full px-6 py-4 md:px-8">
                <span className="text-2xl font-bold cursor-pointer font-[Urbanist] text-neutral-50">
                    Gradient
                </span>
                <MdOutlineClose
                    size={24}
                    onClick={() => setOpenSidebar(false)}
                    className="text-[#666666]"
                />
            </header>
            <div className="flex flex-col gap-[1rem] px-6 py-4">
                {/* <Link href={'/notifikasi'}>
                    <span
                        className={`flex gap-4 cursor-pointer ${
                            pathname === '/notifikasi'
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}>
                        <RiNotification3Line size={20} />
                        Notifikasi
                    </span>
                </Link> */}
                <Link href={'/dashboard'}>
                    <span
                        className={`flex gap-4 cursor-pointer ${
                            pathname === '/dashboard'
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}>
                        <FiHome size={20} />
                        Home
                    </span>
                </Link>
                {configData?.configs.is_community_config_enabled && (
                    <span
                        className={`flex items-center gap-4 cursor-pointer ${
                            pathname === '/komunitas'
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}
                        onClick={() => {
                            route.push('/komunitas');
                        }}
                        aria-hidden>
                        <RiQuestionnaireLine size={20} />
                        Komunitas
                        <CommunityNotificationBadge />
                    </span>
                )}
                <Link href={'/kelas'}>
                    <span
                        className={`flex gap-4 cursor-pointer ${
                            pathname === '/kelas'
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        }  hover:text-[#999999]`}>
                        <BiBookReader size={20} />
                        Kelas
                    </span>
                </Link>
                <Link
                    href={'/astronotes'}
                    onClick={() => {
                        tracker?.genericTrack('Click Library Navigation');
                    }}>
                    <span
                        className={cn(
                            'flex gap-4 cursor-pointer hover:text-[#999999]',
                            pathname.includes('/astronotes')
                                ? 'text-[#CCCCCC]'
                                : 'text-[#666666]'
                        )}>
                        <RiBookOpenLine size={20} />
                        Perpustakaan
                    </span>
                </Link>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default MobileSidebar;
