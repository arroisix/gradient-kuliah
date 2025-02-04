import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';

interface DeleteConfirmationBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationBottomSheet = ({
    isOpen,
    onClose,
    onConfirm
}: DeleteConfirmationBottomSheetProps): JSX.Element => {
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
                            <Dialog.Panel className="w-full transform bg-[#1D1D1D] shadow-xl rounded-t-2xl p-4 space-y-4">
                                <Dialog.Title className="text-xl font-bold text-white">
                                    Hapus card ini?
                                </Dialog.Title>
                                <p className="text-neutral-400">
                                    Hanya card ini yang akan terhapus, card
                                    lainnya tidak ikut terhapus
                                </p>
                                <div className="space-y-2">
                                    <button
                                        onClick={onConfirm}
                                        className="w-full px-4 py-3 bg-red-500 text-white rounded-full text-base font-semibold">
                                        Hapus Card Ini
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full px-4 py-3 bg-[#333333] text-white rounded-full text-base font-semibold">
                                        Batalkan
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default DeleteConfirmationBottomSheet;
