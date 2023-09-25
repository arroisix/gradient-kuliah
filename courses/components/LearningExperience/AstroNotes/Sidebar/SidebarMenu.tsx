import Modal from 'commons/components/modules/Modal';
import React, { useState } from 'react';
import RatingModal from './RatingModal';
import FeedbackModal from './FeedbackModal';
import { ASTRONOTES_MENU } from '../constants';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';

const SidebarMenu = ({ className }: PropsWithClassName): JSX.Element => {
    const { navigation, setNavigation } = useAstronotes();
    const { theme } = useThemeContext();
    const [isModalRatingOpen, setIsModalRatingOpen] = useState<boolean>(false);
    const [isModalFeedbackOpen, setIsModalFeedbackOpen] =
        useState<boolean>(false);

    const selectMenu = (value: NavigationTypes): void => {
        if (value === 'RATING') setIsModalRatingOpen(true);
        else if (value === 'FEEDBACK') setIsModalFeedbackOpen(true);
        else setNavigation((prev) => (prev === value ? 'CLOSE' : value));
    };

    return (
        <>
            <ul
                className={`menu px-1 py-4 gap-2 menu-sm bg-[#F6F5F8] dark:bg-[#121212] rounded-box text-black dark:text-[#999999] ${className}`}>
                {ASTRONOTES_MENU.map((menu) => (
                    <li key={menu.value}>
                        <a
                            className={`tooltip tooltip-right p-1.5 ${
                                navigation === menu.value ? 'active' : ''
                            }`}
                            data-tip={menu.label}
                            onClick={() => selectMenu(menu.value)}
                            aria-hidden>
                            {menu.icon}
                        </a>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={isModalRatingOpen}
                setOpen={setIsModalRatingOpen}
                variant={theme}
                className="sm:!w-[500px] !max-w-[500px]">
                <RatingModal setOpen={setIsModalRatingOpen} />
            </Modal>
            <Modal
                isOpen={isModalFeedbackOpen}
                setOpen={setIsModalFeedbackOpen}
                variant={theme}>
                <FeedbackModal setOpen={setIsModalFeedbackOpen} />
            </Modal>
        </>
    );
};

export default SidebarMenu;
