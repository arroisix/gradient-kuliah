import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { BiBookReader } from 'react-icons/bi';
import { MdOutlineClose } from 'react-icons/md';
import { RiBookOpenLine, RiQuestionnaireLine } from 'react-icons/ri';
import { useTracker } from 'tracker/tracker';
import CommunityNotificationBadge from '../../elements/CommunityNotificationBadge';
import { AnimatePresence, motion } from 'framer-motion';

const MobileSidebar = ({
    openSidebar,
    setOpenSidebar,
    configData
}: {
    openSidebar: boolean;
    setOpenSidebar: Dispatch<SetStateAction<boolean>>;
    configData?: ConfigResponse;
}): JSX.Element => {
    const route = useRouter();
    const tracker = useTracker();
    const { pathname } = route;

    return (
        <AnimatePresence>
            {openSidebar && (
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.35 }}
                    className="fixed z-[110] top-0 left-0 w-screen h-screen bg-black">
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
                        <Link
                            href={'/kelas'}
                            onClick={() => {
                                tracker?.genericTrack('Click Class Navigation');
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
                                    'flex gap-4 cursor-pointer hover:text-[#666666] mt-4',
                                    pathname.includes('/astronotes')
                                        ? 'text-[#CCCCCC]'
                                        : 'text-[#999999]'
                                )}>
                                <RiBookOpenLine size={20} />
                                Perpustakaan
                            </span>
                        </Link>
                        <Link
                            href={'/astronotes?tab=text-book'}
                            onClick={() => {
                                tracker?.genericTrack(
                                    'Click Astronotes Navigation'
                                );
                            }}
                            className={cn(
                                'flex cursor-pointer hover:text-[#666666] ml-9',
                                pathname.includes('/astronotes?tab=text-book')
                                    ? 'text-[#CCCCCC]'
                                    : 'text-[#999999]'
                            )}>
                            Textbook Solution
                        </Link>
                        <Link
                            href={'/astronotes?tab=bank-soal'}
                            onClick={() => {
                                tracker?.genericTrack(
                                    'Click Astronotes Navigation'
                                );
                            }}
                            className={cn(
                                'flex cursor-pointer hover:text-[#666666] ml-9',
                                pathname.includes('/astronotes?tab=bank-soal')
                                    ? 'text-[#CCCCCC]'
                                    : 'text-[#999999]'
                            )}>
                            Bank Soal
                        </Link>
                        <Link
                            href={'/astronotes?tab=astronotes'}
                            onClick={() => {
                                tracker?.genericTrack(
                                    'Click Astronotes Navigation'
                                );
                            }}
                            className={cn(
                                'flex cursor-pointer hover:text-[#666666] ml-9',
                                pathname.includes('/astronotes?tab=astronotes')
                                    ? 'text-[#CCCCCC]'
                                    : 'text-[#999999]'
                            )}>
                            Astronotes
                        </Link>
                        {configData?.configs.is_community_config_enabled && (
                            <span
                                className={`flex items-center gap-4 cursor-pointer mt-4 ${
                                    pathname === '/komunitas'
                                        ? 'text-[#CCCCCC]'
                                        : 'text-[#999999]'
                                }  hover:text-[#666666]`}
                                onClick={() => {
                                    route.push('/komunitas');
                                }}
                                aria-hidden>
                                <RiQuestionnaireLine size={20} />
                                Komunitas
                                <CommunityNotificationBadge />
                            </span>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;
