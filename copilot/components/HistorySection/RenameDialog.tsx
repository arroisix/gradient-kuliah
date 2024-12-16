import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useTracker } from 'tracker/tracker';

interface RenameDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRename: (name: string) => Promise<void>;
    initialName: string;
}

const RenameDialog = ({
    isOpen,
    onClose,
    onRename,
    initialName
}: RenameDialogProps) => {
    const [name, setName] = useState(initialName);
    const [isLoading, setIsLoading] = useState(false);
    const MAX_CHARS = 100;
    const tracker = useTracker();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            tracker?.genericTrack('Rename Chat History Session', {
                SESSION_ID: name
            });
            await onRename(name);
            onClose();
        } catch (error) {
            console.error('Failed to rename:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARS) {
            setName(value);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClose={onClose}>
                <div className="min-h-screen px-4 text-center flex items-center justify-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <div className="inline-block w-full max-w-[360px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-neutral-900 rounded-lg relative">
                            <div className="w-full flex flex-row items-center justify-between">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-semibold text-white">
                                    Rename
                                </Dialog.Title>

                                <button
                                    onClick={onClose}
                                    className="text-neutral-400 hover:text-white">
                                    <IoClose size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="relative">
                                    <textarea
                                        value={name}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-neutral-800 border-none rounded-[8px] py-4 px-3 text-white focus:ring-2 focus:ring-[#5F2BCE] resize-none"
                                        placeholder="Enter new name"
                                    />
                                    <span className="absolute right-2 bottom-2 text-xs text-neutral-400">
                                        {name.length}/{MAX_CHARS}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading || !name.trim()}
                                        className="w-full font-semibold px-4 py-2 text-sm bg-[#5F2BCE] text-white rounded-[70px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isLoading ? 'Simpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default RenameDialog;
