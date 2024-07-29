import { Dispatch, SetStateAction } from 'react';
import { BiBookReader, BiSolidBookReader } from 'react-icons/bi';
import { MdOutlineClose } from 'react-icons/md';
import {
    RiBookOpenLine,
    RiBookOpenFill,
    RiQuestionnaireLine,
    RiQuestionnaireFill
} from 'react-icons/ri';
import CommunityNotificationBadge from '../../elements/CommunityNotificationBadge';
import { AnimatePresence, motion } from 'framer-motion';
import NavigationButton from 'commons/components/elements/NavigationButton';

const MOBILE_SIDEBAR_BUTTONS: NavigationButtonInterface[] = [
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
        url: '/perpustakaan',
        IconActive: RiBookOpenFill,
        IconUnactive: RiBookOpenLine,
        className: 'mt-4',
        subMenus: [
            {
                name: 'Textbook Solution',
                title: 'Textbook Solution',
                url: '/perpustakaan/textbook'
            },
            {
                name: 'Question Bank',
                title: 'Bank Soal',
                url: '/perpustakaan/bank-soal'
            },
            {
                name: 'Astronotes',
                title: 'Astronotes',
                url: '/perpustakaan/astronotes'
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
                            className="text-[#ffffff]"
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
                                <NavigationButton
                                    key={name}
                                    name={name}
                                    title={title}
                                    url={url}
                                    IconActive={IconActive}
                                    IconUnactive={IconUnactive}
                                    className={className}
                                    subMenus={subMenus}
                                    setOpenSidebar={setOpenSidebar}
                                />
                            )
                        )}
                        {configData?.configs.is_community_config_enabled && (
                            <NavigationButton
                                name="Community"
                                title="Komunitas"
                                url="/komunitas"
                                IconActive={RiQuestionnaireFill}
                                IconUnactive={RiQuestionnaireLine}
                                setOpenSidebar={setOpenSidebar}
                                className="mt-4">
                                <CommunityNotificationBadge />
                            </NavigationButton>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;
