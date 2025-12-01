import { Dispatch, SetStateAction } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import NavigationButton from 'commons/components/elements/NavigationButton';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import CopilotIconLine from 'copilot/assets/CopilotIconLine';
import BookStackIcon from '../../elements/Icons/BookStack';
import PencilOnLineIcon from '../../elements/Icons/PencilLine';
import PencilOnLineIconFill from '../../elements/Icons/PencilLineFill';
import KelasIcon from '../../elements/Icons/Kelas';
import KelasIconFill from '../../elements/Icons/KelasFill';
import BookStackIconFill from '../../elements/Icons/BookStackFill';

const MOBILE_SIDEBAR_BUTTONS: NavigationButtonInterface[] = [
    {
        name: 'Library',
        title: 'Perpustakaan',
        url: '/perpustakaan',
        IconActive: BookStackIconFill,
        IconUnactive: BookStackIcon,
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
                    <div className="flex flex-col gap-8 px-6 py-4">
                        <NavigationButton
                            name="Class"
                            title="Kelas"
                            url="/kelas"
                            IconActive={KelasIconFill}
                            IconUnactive={KelasIcon}
                            setOpenSidebar={setOpenSidebar}
                        />
                        {configData?.configs.is_exercise_config_enabled && (
                            <NavigationButton
                                name="Try Out"
                                title="Try Out"
                                url="/latihan"
                                IconActive={PencilOnLineIconFill}
                                IconUnactive={PencilOnLineIcon}
                                setOpenSidebar={setOpenSidebar}
                            />
                        )}
                        {configData?.configs.is_copilot_config_enabled && (
                            <NavigationButton
                                name="Copilot"
                                title="Copilot AI"
                                url="/copilot"
                                IconActive={CopilotIconFill}
                                IconUnactive={CopilotIconLine}
                                setOpenSidebar={setOpenSidebar}
                            />
                        )}
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
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;
