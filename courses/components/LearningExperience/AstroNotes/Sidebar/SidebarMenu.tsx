import Modal from 'commons/components/modules/Modal';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AiOutlineFontColors } from 'react-icons/ai';
import {
    MdFormatListBulleted,
    MdLibraryBooks,
    MdStarPurple500
} from 'react-icons/md';
import { RiQuestionLine } from 'react-icons/ri';
import RatingModal from './RatingModal';
import FeedbackModal from './FeedbackModal';

type SidebarMenuProps = {
    navigation: NavigationTypes;
    setNavigation: Dispatch<SetStateAction<NavigationTypes>>;
    className?: string;
};

const SidebarMenu = ({
    navigation,
    setNavigation,
    className
}: SidebarMenuProps): JSX.Element => {
    const [isModalRatingOpen, setIsModalRatingOpen] = useState<boolean>(false);
    const [isModalFeedbackOpen, setIsModalFeedbackOpen] =
        useState<boolean>(false);

    return (
        <div
            className={`flex flex-col gap-3 bg-[#F6F5F8] dark:bg-[#121212] rounded-[20px] px-1 py-[15px] text-black dark:text-[#999999] ${className}`}>
            <Modal
                isOpen={isModalRatingOpen}
                setOpen={setIsModalRatingOpen}
                variant="dark"
                className="!bg-[#1D1D1D] sm:!w-[500px] !max-w-[500px]">
                <RatingModal setOpen={setIsModalRatingOpen} />
            </Modal>
            <Modal
                isOpen={isModalFeedbackOpen}
                setOpen={setIsModalFeedbackOpen}
                variant="dark"
                className="!bg-[#1D1D1D]">
                <FeedbackModal setOpen={setIsModalFeedbackOpen} />
            </Modal>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'LIST_CONTENT'
                        ? 'text-black dark:text-white'
                        : 'text-[#999999]'
                }`}
                onClick={() =>
                    setNavigation((prev) =>
                        prev === 'LIST_CONTENT' ? 'CLOSE' : 'LIST_CONTENT'
                    )
                }
                aria-hidden>
                <MdFormatListBulleted size={18} />
            </div>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'BOOKMARK'
                        ? 'text-black dark:text-white'
                        : 'text-[#999999]'
                }`}
                onClick={() =>
                    setNavigation((prev) =>
                        prev === 'BOOKMARK' ? 'CLOSE' : 'BOOKMARK'
                    )
                }
                aria-hidden>
                <MdLibraryBooks size={18} />
            </div>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 ${
                    navigation === 'SETTING'
                        ? 'text-black dark:text-white'
                        : 'text-[#999999]'
                }`}
                onClick={() =>
                    setNavigation((prev) =>
                        prev === 'SETTING' ? 'CLOSE' : 'SETTING'
                    )
                }
                aria-hidden>
                <AiOutlineFontColors size={18} />
            </div>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 text-[#999999]`}
                onClick={() => {
                    setNavigation('CLOSE');
                    setIsModalRatingOpen(true);
                }}
                aria-hidden>
                <MdStarPurple500 size={18} />
            </div>
            <div
                className={`hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer rounded-full p-1 text-[#999999]`}
                onClick={() => {
                    setNavigation('CLOSE');
                    setIsModalFeedbackOpen(true);
                }}
                aria-hidden>
                <RiQuestionLine size={18} />
            </div>
        </div>
    );
};

export default SidebarMenu;
