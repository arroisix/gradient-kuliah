import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const DeleteModal = ({
    isOpen,
    onConfirm,
    onCancel
}: {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) => (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onCancel}>
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
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="scale-95 opacity-0"
                    enterTo="scale-100 opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="scale-100 opacity-100"
                    leaveTo="scale-95 opacity-0">
                    <Dialog.Panel className="max-w-sm bg-neutral-900 rounded-lg p-6 text-center">
                        <Dialog.Title className="text-lg font-bold text-white mb-4">
                            Hapus flashcard?
                        </Dialog.Title>
                        <p className="text-sm text-neutral-400 mb-6">
                            Setelah dihapus, flashcard dan seluruh isinya tidak
                            dapat kamu akses lagi
                        </p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={onConfirm}
                                className="w-full px-4 py-3 bg-red-500 text-white rounded-full text-sm font-semibold">
                                Hapus Flashcard
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-full px-4 py-3 bg-neutral-700 text-white rounded-full text-sm font-semibold">
                                Batalkan
                            </button>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition>
);

export default DeleteModal;
