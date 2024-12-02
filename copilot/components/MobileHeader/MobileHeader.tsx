import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BiChevronDown } from 'react-icons/bi';
import { HiMenuAlt2 } from 'react-icons/hi';
import { BsPencil, BsQuestionCircleFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { RiRobot2Fill } from 'react-icons/ri';
import Link from 'next/link';
import router from 'next/router';

interface MobileHeaderProps {
    onOpenHistory: () => void;
}

const MobileHeader = ({ onOpenHistory }: MobileHeaderProps): JSX.Element => {
    const handleNewChat = () => {
        router.push('/copilot');
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#101010] border-b border-neutral-800">
                <div className="flex w-full items-center justify-between gap-4">
                    <button
                        onClick={onOpenHistory}
                        className="text-white p-1 -ml-1">
                        <HiMenuAlt2 size={24} />
                    </button>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-1 text-white">
                        <span className="font-bold">Copilot AI</span>
                        <BiChevronDown size={20} />
                        <span className="flex items-center gap-2 ml-2 py-1 px-3 rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white">
                            Beta
                        </span>
                    </button>

                    <button
                        onClick={handleNewChat}
                        className="text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                        <BsPencil size={20} />
                    </button>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed bg-black/30" />
                    </Transition.Child>

                    <div className="fixed left-0 right-0 -bottom-2">
                        <div className="flex min-h-full items-end">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="translate-y-full"
                                enterTo="translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="translate-y-0"
                                leaveTo="translate-y-full">
                                <Dialog.Panel className="w-full transform bg-[#1D1D1D] shadow-xl rounded-2xl">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <Dialog.Title className="text-lg font-bold">
                                                Pindah Halaman
                                            </Dialog.Title>
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="text-neutral-400">
                                                <IoClose size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <Link
                                                href="/komunitas"
                                                className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800">
                                                <div className="w-10 h-10 bg-[#5F2BCE] rounded-full flex items-center justify-center">
                                                    <BsQuestionCircleFill
                                                        size={20}
                                                        className="text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">
                                                        Diskusi
                                                    </h3>
                                                    <p className="text-sm text-neutral-400">
                                                        Tanya ke tutor atau user
                                                        lain Gradient
                                                    </p>
                                                </div>
                                            </Link>

                                            <Link
                                                href="/copilot"
                                                className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800">
                                                <div className="w-10 h-10 bg-[#5F2BCE] rounded-full flex items-center justify-center">
                                                    <RiRobot2Fill
                                                        size={20}
                                                        className="text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">
                                                        Copilot AI (Beta)
                                                    </h3>
                                                    <p className="text-sm text-neutral-400">
                                                        Chatbot teman belajar,
                                                        didukung AI.
                                                    </p>
                                                    <span className="text-xs text-neutral-500">
                                                        Copilot AI gratis selama
                                                        versi Beta!
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default MobileHeader;
