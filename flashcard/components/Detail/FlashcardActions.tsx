import React from 'react';
import { BiShare } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface FlashcardActionsProps {
    userInitials: string;
    userName: string;
    onEdit: () => void;
    onDelete: () => void;
    createdByMe?: boolean;
}

const FlashcardActions = ({
    userInitials,
    userName,
    onEdit,
    onDelete,
    createdByMe = true
}: FlashcardActionsProps): JSX.Element => {
    return (
        <div className="flex gap-6 md:gap-0 md:items-center flex-col md:flex-row justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#5F2BCE] flex items-center justify-center text-white text-sm">
                    {userInitials}
                </div>
                <div>
                    <p className="text-sm text-neutral-400">Dibuat oleh</p>
                    <p className="font-medium text-white">{userName}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 px-4 text-sm font-semibold py-2 bg-[#333333] text-white hover:bg-opacity-80 transition-colors rounded-full">
                    <BiShare size={20} />
                    <span>Bagikan</span>
                </button>

                {createdByMe && (
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
                )}
            </div>
        </div>
    );
};

export default FlashcardActions;
