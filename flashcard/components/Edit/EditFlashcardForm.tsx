import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { IoEyeOutline } from 'react-icons/io5';
import { IoCamera, IoImage } from 'react-icons/io5';
import DaftarIsi from './FlashcardDaftarIsi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { BiSave } from 'react-icons/bi';
import { ImOmega } from 'react-icons/im';
import { BsThreeDots } from 'react-icons/bs';
import { Menu, Transition } from '@headlessui/react';
import { useDeleteCardMutation } from 'flashcard/redux/api/flashcardsApi';
import DeleteModal from '../Detail/DeleteModal';
import { Fragment } from 'react';

const createTipTapContent = (
    text: string,
    image?: { src: string; width?: number; height?: string }
) => {
    const content: Array<any> = [
        {
            type: 'paragraph',
            attrs: { textAlign: 'justify' },
            content: [{ type: 'text', text }]
        }
    ];

    if (image) {
        content.push({
            type: 'image',
            attrs: {
                src: image.src,
                alt: null,
                title: null,
                width: image.width || 640,
                height: image.height || 'auto',
                'data-align': 'center'
            }
        });
    }

    return {
        type: 'doc',
        content
    };
};

const extractTextFromTipTap = (content: Record<string, any>): string => {
    try {
        return content?.content?.[0]?.content?.[0]?.text || '';
    } catch {
        return '';
    }
};

interface EditFlashcardFormProps {
    flashcardData: {
        title: string;
        lastSaved: string;
        totalCards: number;
        isPublic: boolean;
        cards: Array<{
            id: string;
            question: Record<string, any>;
            answer: Record<string, any>;
        }>;
    };
    currentIndex: number;
    hasChanges: boolean;
    onUpdateCard: (
        cardId: string,
        field: 'question' | 'answer',
        value: Record<string, any>
    ) => void;
    onAddCard: () => void;
    onSave: () => void;
    onNavigate: (direction: 'prev' | 'next') => void;
}

const EditFlashcardForm = ({
    flashcardData,
    currentIndex,
    hasChanges,
    onUpdateCard,
    onAddCard,
    onSave,
    onNavigate
}: EditFlashcardFormProps): JSX.Element => {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteCard] = useDeleteCardMutation();
    const currentCard = flashcardData.cards[currentIndex];

    const totalCards = flashcardData.cards.length;

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteCard({
                card_id: currentCard.id
            }).unwrap();
            setIsDeleteModalOpen(false);
            router.push(`/flashcard/${router.query.id}/edit`);
        } catch (error) {
            console.error('Failed to delete card:', error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
    };

    const handleImageUpload = async (
        cardId: string,
        field: 'question' | 'answer'
    ) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const imageUrl = 'https://example.com/image.jpg'; // Replace with actual upload

                const currentText = extractTextFromTipTap(currentCard[field]);
                const newContent = createTipTapContent(currentText, {
                    src: imageUrl
                });

                onUpdateCard(cardId, field, newContent);
            }
        };

        input.click();
    };

    const handleTextChange = (
        cardId: string,
        field: 'question' | 'answer',
        value: string
    ) => {
        const existingImage = currentCard[field]?.content?.find(
            (item: any) => item.type === 'image'
        );

        const newContent = createTipTapContent(value, existingImage?.attrs);

        onUpdateCard(cardId, field, newContent);
    };

    if (!currentCard) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen py-6">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-neutral-400 text-sm">
                            Terakhir disimpan {flashcardData.lastSaved}
                        </p>
                        <h1 className="text-2xl font-bold text-white">
                            {flashcardData.title}
                        </h1>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <HiOutlineDocumentText
                                    size={20}
                                    className="text-[#7D89CC]"
                                />
                                <span className="text-white">
                                    {totalCards} Cards
                                </span>
                            </div>
                            <div className="text-[#333333]">|</div>
                            <div className="flex items-center gap-2">
                                <IoEyeOutline
                                    size={20}
                                    className="text-[#7D89CC]"
                                />
                                <span className="text-white">
                                    {flashcardData.isPublic
                                        ? 'Publik'
                                        : 'Privat'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onSave}
                            disabled={!hasChanges}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                                hasChanges
                                    ? 'bg-[#333333] text-white hover:bg-opacity-80'
                                    : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                            } transition-colors`}>
                            <BiSave size={20} />
                            <span>Simpan</span>
                        </button>
                        <Menu as="div" className="relative">
                            <Menu.Button className="p-2 rounded-full bg-[#333333] text-white hover:bg-opacity-80 transition-colors">
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
                                                onClick={handleDelete}
                                                className={`${
                                                    active
                                                        ? 'bg-neutral-700'
                                                        : ''
                                                } w-full text-left px-4 py-2 text-sm text-red-500`}>
                                                Hapus Card Ini
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>

                <div className="rounded-lg bg-[#181818] p-6 mb-6">
                    <div className="space-y-6">
                        <div className="relative">
                            <textarea
                                value={extractTextFromTipTap(
                                    currentCard?.question
                                )}
                                onChange={(e) =>
                                    handleTextChange(
                                        currentCard.id,
                                        'question',
                                        e.target.value
                                    )
                                }
                                placeholder="Istilah atau pertanyaan"
                                className="w-full min-h-[120px] bg-[#222222] rounded-lg p-3 text-white resize-none border-none outline-none placeholder:text-neutral-500"
                            />
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <button
                                    onClick={() =>
                                        handleImageUpload(
                                            currentCard.id,
                                            'question'
                                        )
                                    }
                                    className="text-neutral-400 hover:text-white p-2 rounded-lg transition-colors"
                                    aria-label="Upload image">
                                    <IoCamera size={20} />
                                </button>
                                <button
                                    className="text-neutral-400 hover:text-white p-2 rounded-lg transition-colors"
                                    aria-label="Insert image">
                                    <IoImage size={20} />
                                </button>
                                <button
                                    className="text-neutral-400 hover:text-white p-2 rounded-lg transition-colors"
                                    aria-label="Math formula">
                                    <ImOmega size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <textarea
                                value={extractTextFromTipTap(
                                    currentCard?.answer
                                )}
                                onChange={(e) =>
                                    handleTextChange(
                                        currentCard.id,
                                        'answer',
                                        e.target.value
                                    )
                                }
                                placeholder="Definisi atau jawaban"
                                className="w-full min-h-[120px] bg-[#222222] rounded-lg p-3 text-white resize-none border-none outline-none placeholder:text-neutral-500"
                            />
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <button
                                    onClick={() =>
                                        handleImageUpload(
                                            currentCard.id,
                                            'answer'
                                        )
                                    }
                                    className="text-neutral-400 hover:text-white p-2 rounded-lg transition-colors"
                                    aria-label="Upload image">
                                    <IoCamera size={20} />
                                </button>
                                <button
                                    className="text-neutral-400 hover:text-white p-2 rounded-lg transition-colors"
                                    aria-label="Insert image">
                                    <IoImage size={20} />
                                </button>
                                <button
                                    className="text-neutral-400 hover:text-white p-2 rounded-lg transition-colors"
                                    aria-label="Math formula">
                                    <ImOmega size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => onNavigate('prev')}
                            disabled={currentIndex === 0}
                            className={`py-2 px-3 rounded-full text-white ${
                                currentIndex === 0
                                    ? 'bg-[#333333] opacity-20 cursor-not-allowed'
                                    : 'bg-[#333333] hover:bg-opacity-80'
                            }`}>
                            ←
                        </button>
                        <span className="text-neutral-400 mx-12">
                            {totalCards > 0
                                ? `${currentIndex + 1}/${totalCards}`
                                : '0/0'}
                        </span>
                        <button
                            onClick={() => onNavigate('next')}
                            disabled={currentIndex === totalCards - 1}
                            className={`py-2 px-3 rounded-full text-white ${
                                currentIndex === totalCards - 1
                                    ? 'bg-[#333333] opacity-20 cursor-not-allowed'
                                    : 'bg-[#333333] hover:bg-opacity-80'
                            }`}>
                            →
                        </button>
                    </div>
                </div>

                <div className="h-[0.5px] bg-[#333333] mb-6" />

                <DaftarIsi
                    onAddCard={onAddCard}
                    canAdd={flashcardData.cards.some(
                        (card) => card.id !== 'temp'
                    )}
                />
            </div>

            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
};

export default EditFlashcardForm;
