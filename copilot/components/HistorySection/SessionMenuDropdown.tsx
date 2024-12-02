import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BsThreeDots } from 'react-icons/bs';

const SessionMenuDropdown = ({
    sessionId,
    onRename,
    onDelete
}: {
    sessionId: string;
    onRename: (sessionId: string) => void;
    onDelete: (sessionId: string) => void;
}) => {
    return (
        <Menu as="div" className="relative">
            <Menu.Button className="opacity-100 group-hover:opacity-100 transition-opacity hover:bg-neutral-700 rounded">
                <BsThreeDots className="text-neutral-400" />
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
                                onClick={() => onRename(sessionId)}
                                className={`${
                                    active ? 'bg-neutral-700' : ''
                                } w-full text-left px-4 py-2 text-sm text-white`}>
                                Rename
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onDelete(sessionId)}
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

export default SessionMenuDropdown;
