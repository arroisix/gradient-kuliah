import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { BiBookReader, BiSolidBookReader } from 'react-icons/bi';
import { MdOutlineClose } from 'react-icons/md';
import {
    RiBookOpenLine,
    RiBookOpenFill,
    RiQuestionnaireLine,
    RiQuestionnaireFill
} from 'react-icons/ri';
import { useTracker } from 'tracker/tracker';
import CommunityNotificationBadge from '../../elements/CommunityNotificationBadge';
import { AnimatePresence, motion } from 'framer-motion';
import { IconType } from 'react-icons/lib';

const MOBILE_SIDEBAR_BUTTONS: MobileSidebarButtonProps[] = [
    {
        name: 'Class',
        title: 'Kelas',
        url: '/kelas',
        IconActive: BiSolidBookReader,
        IconUnactive: BiBookReader
    },
    {
        name: 'Library',
        title: 'Perpustakaan',
        url: '/astronotes',
        IconActive: RiBookOpenFill,
        IconUnactive: RiBookOpenLine,
        className: 'mt-4',
        subMenus: [
            {
                name: 'All Books',
                title: 'Semua',
                url: '/astronotes?tab=all'
            },
            {
                name: 'Textbook Solution',
                title: 'Textbook Solution',
                url: '/astronotes?tab=text-book'
            },
            {
                name: 'Question Bank',
                title: 'Bank Soal',
                url: '/astronotes?tab=bank-soal'
            },
            {
                name: 'Astronotes',
                title: 'Astronotes',
                url: '/astronotes?tab=astronotes'
            }
        ]
    }
];

const MobileSidebar = ({
    openSidebar,
    setOpenSidebar,
    configData
}: {
    openSidebar: boolean;
    setOpenSidebar: Dispatch<SetStateAction<boolean>>;
    configData?: ConfigResponse;
}): JSX.Element => {
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
                        {MOBILE_SIDEBAR_BUTTONS.map(
                            ({
                                name,
                                title,
                                url,
                                IconActive,
                                IconUnactive,
                                className,
                                subMenus
                            }) => (
                                <MobileSidebarButton
                                    key={name}
                                    name={name}
                                    title={title}
                                    url={url}
                                    IconActive={IconActive}
                                    IconUnactive={IconUnactive}
                                    className={className}
                                    subMenus={subMenus}
                                />
                            )
                        )}
                        {configData?.configs.is_community_config_enabled && (
                            <MobileSidebarButton
                                name="Komunitas"
                                title="Komunitas"
                                url="/komunitas"
                                IconActive={RiQuestionnaireFill}
                                IconUnactive={RiQuestionnaireLine}
                                className="mt-4"
                            >
                                <CommunityNotificationBadge />
                            </MobileSidebarButton>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

type MobileSidebarButtonProps = {
    name: string;
    title: string;
    url: string;
    IconActive?: IconType;
    IconUnactive?: IconType;
    className?: string;
    subMenus?: MobileSidebarButtonProps[];
    children?: ReactNode;
};

const MobileSidebarButton = ({
    name,
    title,
    url,
    IconActive,
    IconUnactive,
    className,
    subMenus,
    children
}: MobileSidebarButtonProps): JSX.Element => {
    const ACTIVE_STATE = 'text-white font-bold';
    const UNACTIVE_STATE = 'text-[#CCCCCC] font-medium';
    const tracker = useTracker();
    const route = useRouter();
    const { asPath } = route;

    return (
        <>
            <Link
                href={url}
                className={className}
                onClick={() => {
                    tracker?.genericTrack(`Click${name} Navigation`);
                }}>
                <span
                    className={cn(
                        'flex gap-4 cursor-pointer hover:text-[#666666] items-center',
                        asPath.includes(url) ||
                            asPath === url ||
                            (name === 'All Books' && asPath === '/astronotes')
                            ? ACTIVE_STATE
                            : UNACTIVE_STATE
                    )}>
                    {asPath.includes(url)
                        ? IconActive && <IconActive size={20} />
                        : IconUnactive && <IconUnactive size={20} />}
                    {title}
                    {children}
                </span>
            </Link>
            {subMenus?.map(({ name, title, url, className, subMenus }) => (
                <MobileSidebarButton
                    key={name}
                    name={name}
                    title={title}
                    url={url}
                    className={`ml-9 ${className}`}
                    subMenus={subMenus}
                />
            ))}
        </>
    );
};

export default MobileSidebar;
