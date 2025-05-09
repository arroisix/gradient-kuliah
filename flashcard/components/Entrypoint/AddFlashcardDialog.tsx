import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoClose } from 'react-icons/io5';
import { BsPencilSquare } from 'react-icons/bs';
import { RiRobot2Fill } from 'react-icons/ri';
import { BiChevronRight } from 'react-icons/bi';
import Link from 'next/link';

interface AddFlashcardDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddFlashcardDialog = ({
    isOpen,
    onClose
}: AddFlashcardDialogProps): JSX.Element => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform bg-neutral-900 p-6 rounded-2xl shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <Dialog.Title className="text-lg font-bold text-white">
                                        Tambah Flashcard
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-neutral-400 hover:text-white">
                                        <IoClose size={24} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <Link
                                        href="/flashcards/create"
                                        className="flex items-center gap-3 p-4 rounded-xl border border-[#333333] hover:bg-neutral-800/50 transition-colors">
                                        <div className="w-10 h-10 bg-[#2C2C2C] rounded-full flex items-center justify-center">
                                            <BsPencilSquare
                                                size={20}
                                                className="text-[#7D89CC]"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white">
                                                Buat Manual
                                            </h3>
                                            <p className="text-sm text-neutral-400">
                                                Kamu tulis sendiri isi flashcard
                                            </p>
                                        </div>
                                        <BiChevronRight
                                            size={24}
                                            className="text-neutral-400"
                                        />
                                    </Link>

                                    <Link
                                        href="/flashcards/create-ai"
                                        className="flex items-center gap-3 p-4 rounded-xl border border-[#333333] hover:bg-neutral-800/50 transition-colors">
                                        <div className="w-10 h-10 bg-[#2C2C2C] rounded-full flex items-center justify-center">
                                            <RiRobot2Fill
                                                size={20}
                                                className="text-[#7D89CC]"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white">
                                                Pakai Copilot AI
                                            </h3>
                                            <p className="text-sm text-neutral-400">
                                                Buat flashcard secara otomatis
                                            </p>
                                        </div>
                                        <BiChevronRight
                                            size={24}
                                            className="text-neutral-400"
                                        />
                                    </Link>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddFlashcardDialog;
