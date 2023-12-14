import { Popover, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { FaRegComment, FaTimes } from 'react-icons/fa';
import { transitionClassesOpacity } from '../constants';
import { useRouter } from 'next/router';
import { cn } from 'commons/utils';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const CommunityDrawer = (): JSX.Element => {
    const router = useRouter();
    const [showOnce, setShowOnce] = useState(false);
    const [isShowDrawer, setIsShowDrawer] = useState(false);
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <Popover className="fixed right-0 bottom-16 md:bottom-20">
            {() => (
                <>
                    <Popover.Button
                        className={cn(
                            'flex items-center px-4 py-2.5 text-sm font-bold text-white rounded-l-full bg-accent-purple transition ease-out duration-200',
                            isShowDrawer
                                ? 'gap-2 translate-x-0'
                                : 'gap-4 translate-x-[125px]'
                        )}
                        onMouseEnter={() => setIsShowDrawer(true)}
                        onMouseLeave={() => setIsShowDrawer(false)}
                        onClick={() => {
                            if (isMobileBreakpoints && !isShowDrawer)
                                setIsShowDrawer(true);
                            else router.push('/komunitas?ask=true');
                        }}>
                        <FaRegComment size={20} />
                        Tanya di Diskusi
                    </Popover.Button>
                    <Transition
                        show={!showOnce}
                        appear
                        as={Fragment}
                        {...transitionClassesOpacity}>
                        <Popover.Panel
                            static
                            className="absolute flex items-start w-48 gap-1 p-2 text-xs rounded-lg bottom-14 right-2 bg-neutral-800">
                            Bingung sama pembahasan ini? Tanya aja di diskusi
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

export default CommunityDrawer;
