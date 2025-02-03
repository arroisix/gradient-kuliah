import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';

interface DeleteBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteBottomSheet = ({
    isOpen,
    onClose,
    onDelete
}: DeleteBottomSheetProps): JSX.Element => {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
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

                <div className="fixed inset-0">
                    <div className="flex min-h-full items-end">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="translate-y-full"
                            enterTo="translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="translate-y-0"
                            leaveTo="translate-y-full">
                            <Dialog.Panel className="w-full transform bg-[#1D1D1D] shadow-xl rounded-t-2xl pb-4">
                                <Dialog.Title className="text-xl font-bold text-white p-4">
                                    Pengaturan
                                </Dialog.Title>
                                <button
                                    onClick={onDelete}
                                    className="w-full text-left px-4 py-3 text-red-500 text-base">
                                    Hapus Card Ini
                                </button>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default DeleteBottomSheet;
