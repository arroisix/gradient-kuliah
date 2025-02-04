import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Clock from 'flashcard/assets/Clock';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

interface FlashcardGeneratingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FlashcardGeneratingModal = ({
    isOpen,
    onClose
}: FlashcardGeneratingModalProps): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/75" />
                </Transition.Child>

                {isMobileBreakpoints ? (
                    <div className="fixed inset-x-0 bottom-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-full p-0">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="translate-y-full"
                                enterTo="translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="translate-y-0"
                                leaveTo="translate-y-full">
                                <Dialog.Panel className="w-full transform overflow-hidden rounded-t-2xl bg-[#222222] p-6 flex flex-col items-center align-middle shadow-xl transition-all">
                                    <Clock />
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-white text-center mt-4">
                                        Sedang menyusun flashcard
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-neutral-400 text-center">
                                            Kamu akan mendapat notifikasi lewat
                                            email saat flashcard selesai dibuat
                                        </p>
                                    </div>

                                    <div className="w-full mt-6">
                                        <button
                                            type="button"
                                            className="w-full justify-center rounded-full bg-[#5F2BCE] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-colors"
                                            onClick={onClose}>
                                            Mengerti
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                ) : (
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#222222] p-6 flex flex-col items-center align-middle shadow-xl transition-all">
                                    <Clock />
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-white text-center mt-4">
                                        Sedang menyusun flashcard
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-neutral-400 text-center">
                                            Kamu akan mendapat notifikasi lewat
                                            email saat flashcard selesai dibuat
                                        </p>
                                    </div>

                                    <div className="w-full mt-6">
                                        <button
                                            type="button"
                                            className="w-full justify-center rounded-full bg-[#5F2BCE] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-colors"
                                            onClick={onClose}>
                                            Mengerti
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                )}
            </Dialog>
        </Transition>
    );
};

export default FlashcardGeneratingModal;
