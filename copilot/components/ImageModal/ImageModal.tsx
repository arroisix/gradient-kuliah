import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
}

const ImageModal = ({ isOpen, onClose, imageUrl }: ImageModalProps) => {
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

                <div className="fixed inset-0 max-w-[480px] overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-16">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="relative">
                                <button
                                    onClick={onClose}
                                    className="absolute -top-4 -right-4 p-2 bg-[#222222] hover:bg-[#333333] rounded-full transition-colors">
                                    <IoClose size={24} className="text-white" />
                                </button>
                                <div className="relative max-w-3xl max-h-[80vh]">
                                    <Image
                                        src={imageUrl}
                                        alt="Full size image"
                                        width={1200}
                                        height={800}
                                        className="rounded-lg object-contain max-h-[80vh] w-auto h-auto"
                                        priority
                                    />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ImageModal;
