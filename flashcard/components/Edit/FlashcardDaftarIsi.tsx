import React, { Fragment } from 'react';
import { cn } from 'commons/utils';
import { Dialog, Transition } from '@headlessui/react';
import { IoClose } from 'react-icons/io5';

interface DaftarIsiProps {
    onAddCard: () => void;
    canAdd: boolean;
    cards?: Array<{
        id: string;
        question: string;
        answer: string;
    }>;
    currentIndex?: number;
    onSelectCard?: (index: number) => void;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

const DaftarIsi = ({
    onAddCard,
    canAdd,
    cards = [],
    currentIndex = 0,
    onSelectCard,
    isOpen = false,
    onClose = () => undefined,
    isMobile
}: DaftarIsiProps): JSX.Element => {
    const getTextContent = (content: string) => {
        return content
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/\n{2,}/g, '\n')
            .trim();
    };

    if (isMobile) {
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-end">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="translate-y-full"
                                enterTo="translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="translate-y-0"
                                leaveTo="translate-y-full">
                                <Dialog.Panel className="w-full transform bg-[#1D1D1D] shadow-xl rounded-t-2xl">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <Dialog.Title className="text-xl font-bold text-white">
                                                Daftar Isi
                                            </Dialog.Title>
                                            <button
                                                onClick={onClose}
                                                className="text-neutral-400 hover:text-white">
                                                <IoClose size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                            {cards.map((card, index) => (
                                                <button
                                                    key={card.id}
                                                    onClick={() => {
                                                        onSelectCard?.(index);
                                                        onClose?.();
                                                    }}
                                                    className={cn(
                                                        'w-full p-4 text-left rounded-lg text-white transition-colors',
                                                        index === currentIndex
                                                            ? 'bg-[#252246]'
                                                            : 'bg-[#222222]'
                                                    )}>
                                                    <div className="flex items-start">
                                                        <div className="flex-1">
                                                            {getTextContent(
                                                                card.question
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Daftar Isi</h2>
                <button
                    onClick={onAddCard}
                    disabled={!canAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-[#5F2BCE] text-white hover:bg-opacity-90 transition-colors">
                    + Tambah Flashcard
                </button>
            </div>

            {cards.length > 0 ? (
                <div className="space-y-2">
                    {cards.map((card, index) => (
                        <button
                            key={card.id}
                            onClick={() => onSelectCard?.(index)}
                            className={cn(
                                'w-full p-4 text-left rounded-lg transition-colors',
                                index === currentIndex
                                    ? 'bg-[#252246]'
                                    : 'bg-[#222222]'
                            )}>
                            <div className="flex items-start">
                                <div className="flex-1">
                                    {getTextContent(card.question)}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 bg-neutral-800 rounded-full mb-4" />
                    <p className="text-neutral-400">
                        Flashcard yang kamu buat akan muncul di sini
                    </p>
                </div>
            )}
        </div>
    );
};

export default DaftarIsi;
