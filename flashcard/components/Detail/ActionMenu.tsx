import { Dialog, Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { BsThreeDots } from 'react-icons/bs';

interface ActionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

const ActionMenu = ({ onEdit, onDelete }: ActionMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isMobileBreakpoints } = useWindowBreakpoints();

    if (isMobileBreakpoints) {
        return (
            <>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 bg-[#333333] text-white hover:bg-opacity-80 transition-colors rounded-full">
                    <BsThreeDots size={20} />
                </button>

                <Transition.Root show={isOpen} as={Fragment}>
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
                                    <Dialog.Panel className="w-full transform bg-[#1D1D1D] shadow-xl pb-4 rounded-t-2xl">
                                        <Dialog.Title className="text-xl font-bold text-white p-4">
                                            Pengaturan
                                        </Dialog.Title>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                onEdit();
                                            }}
                                            className="w-full text-left px-4 py-3 text-white text-base">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                onDelete();
                                            }}
                                            className="w-full text-left px-4 py-3 text-red-500 text-base">
                                            Hapus
                                        </button>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </>
        );
    }

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="p-2 bg-[#333333] text-white hover:bg-opacity-80 transition-colors rounded-full">
                <BsThreeDots size={20} />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0">
                <Menu.Items className="absolute right-0 mt-1 w-40 bg-neutral-800 rounded-lg shadow-lg py-1 z-50">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={onEdit}
                                className={`${
                                    active ? 'bg-neutral-700' : ''
                                } w-full text-left px-4 py-2 text-sm text-white`}>
                                Edit
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={onDelete}
                                className={`${
                                    active ? 'bg-neutral-700' : ''
                                } w-full text-left px-4 py-2 text-sm text-red-500`}>
                                Hapus
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default ActionMenu;
