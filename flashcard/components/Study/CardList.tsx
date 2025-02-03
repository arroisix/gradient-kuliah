import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoClose } from 'react-icons/io5';
import { Switch } from '@headlessui/react';
import { cn } from 'commons/utils';
import Cards from 'flashcard/assets/Cards';

interface CardListProps {
    cards: Array<{
        id: string;
        question: string;
        answer: string;
        is_favorite?: boolean;
    }>;
    currentIndex: number;
    onSelectCard: (index: number) => void;
    showAnswer: boolean;
    setShowAnswer: (show: boolean) => void;
    isOpen: boolean;
    onClose: () => void;
    title: string;
    authorName: string;
    authorInitials: string;
    photo_profile?: string;
}

const CardList = ({
    cards,
    currentIndex,
    onSelectCard,
    showAnswer,
    setShowAnswer,
    isOpen,
    onClose,
    title,
    authorName,
    authorInitials,
    photo_profile
}: CardListProps): JSX.Element => {
    const getTextContent = (content: string) => {
        return content
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/\n{2,}/g, '\n')
            .trim();
    };

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
                            <Dialog.Panel className="w-full transform bg-[#1D1D1D] shadow-xl rounded-t-2xl">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <Dialog.Title className="text-xl font-bold text-white">
                                            {title}
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="text-neutral-400 hover:text-white">
                                            <IoClose size={24} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-6">
                                        {photo_profile ? (
                                            <img
                                                src={photo_profile}
                                                alt={authorName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-[#5F2BCE] flex items-center justify-center text-white text-sm">
                                                {authorInitials}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className="text-white">
                                                {authorName}
                                            </span>
                                            <span className="text-[#333333]">
                                                |
                                            </span>
                                            <span className="flex flex-row gap-2 text-white items-center">
                                                <Cards />
                                                {cards.length} Cards
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-base text-white">
                                            Tampilkan Jawaban
                                        </span>
                                        <Switch
                                            checked={showAnswer}
                                            onChange={setShowAnswer}
                                            className={`${
                                                showAnswer
                                                    ? 'bg-[#03AC5C]'
                                                    : 'bg-neutral-700'
                                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                                            <span
                                                className={`${
                                                    showAnswer
                                                        ? 'translate-x-6'
                                                        : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                            />
                                        </Switch>
                                    </div>

                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                        {cards.map((card, index) => (
                                            <button
                                                key={card.id}
                                                onClick={() => {
                                                    onSelectCard(index);
                                                    onClose();
                                                }}
                                                className={cn(
                                                    'w-full p-4 text-left rounded-lg transition-colors',
                                                    index === currentIndex
                                                        ? 'bg-[#252246]'
                                                        : 'bg-[#222222]'
                                                )}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-white ">
                                                            {getTextContent(
                                                                card.question
                                                            )}
                                                        </p>
                                                        {showAnswer && (
                                                            <p className="text-sm text-[#666666]">
                                                                {getTextContent(
                                                                    card.answer
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span
                                                        className={cn(
                                                            'text-2xl flex-shrink-0 ml-2',
                                                            card.is_favorite
                                                                ? 'text-[#F2C04C]'
                                                                : 'text-[#666666]'
                                                        )}>
                                                        ★
                                                    </span>
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
        </Transition>
    );
};

export default CardList;
