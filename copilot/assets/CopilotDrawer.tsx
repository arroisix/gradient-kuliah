import { Popover, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { transitionClassesOpacity } from 'courses/components/LearningExperience/AstroNotes/constants';
import { cn } from 'commons/utils';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';

interface CopilotDrawerProps {
    onCopilotClick: () => void;
}

const CopilotDrawer = ({ onCopilotClick }: CopilotDrawerProps): JSX.Element => {
    const [showOnce, setShowOnce] = useState(false);
    const [isShowDrawer, setIsShowDrawer] = useState(false);
    const { isMobileBreakpoints } = useWindowBreakpoints();

    const handleCopilotClick = () => {
        if (isMobileBreakpoints && !isShowDrawer) {
            setIsShowDrawer(true);
        } else {
            onCopilotClick();
        }
    };

    return (
        <Popover className="fixed right-0 bottom-32 md:bottom-36">
            {() => (
                <>
                    <Popover.Button
                        className={cn(
                            'flex items-center px-4 py-2.5 text-sm font-bold text-white rounded-l-full bg-[#5f2bce] transition ease-out duration-200',
                            isShowDrawer
                                ? 'gap-2 translate-x-0'
                                : 'gap-4 translate-x-[130px]'
                        )}
                        onMouseEnter={() => setIsShowDrawer(true)}
                        onMouseLeave={() => setIsShowDrawer(false)}
                        onClick={handleCopilotClick}>
                        <CopilotIconFill />
                        Tanya AI Copilot
                    </Popover.Button>
                    <Transition
                        show={!showOnce}
                        appear
                        as={Fragment}
                        {...transitionClassesOpacity}>
                        <Popover.Panel
                            static
                            className="absolute flex items-start w-48 gap-1 p-2 text-xs text-white rounded-lg bottom-14 right-2 bg-neutral-800">
                            Butuh bantuan memahami materi? Tanya Copilot AI!
                            <Popover.Button
                                className="text-neutral-500"
                                onClick={() => setShowOnce(true)}>
                                <FaTimes />
                            </Popover.Button>
                            <div className="absolute w-0 h-0 border-8 border-b-0 border-transparent -bottom-2 right-3 border-t-neutral-800"></div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default CopilotDrawer;