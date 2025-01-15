import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DaftarIsi from './FlashcardDaftarIsi';
import { BiSave } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { Menu, Transition } from '@headlessui/react';
import { useDeleteCardMutation } from 'flashcard/redux/api/flashcardsApi';
import DeleteModal from '../Detail/DeleteModal';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import Visibility from 'flashcard/assets/Visibility';
import Cards from 'flashcard/assets/Cards';
import useUploadFile from 'commons/hooks/useUploadFile';
import ImageUploadControls from './ImageUploadControls';

interface EditFlashcardFormProps {
    flashcardData: {
        title: string;
        lastSaved: string;
        totalCards: number;
        isPublic: boolean;
        cards: Array<{
            id: string;
            question: string;
            answer: string;
        }>;
    };
    currentIndex: number;
    hasChanges: boolean;
    onUpdateCard: (
        cardId: string,
        field: 'question' | 'answer',
        value: string
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
    const { uploadFile } = useUploadFile('flashcards');
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
            toast.success('Card berhasil dihapus', {
                position: toast.POSITION.TOP_CENTER
            });
            router.push(`/flashcard/${router.query.id}`);
        } catch (error) {
            console.error('Failed to delete card:', error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
    };

    const handleTextChange = (
        cardId: string,
        field: 'question' | 'answer',
        value: string
    ) => {
        onUpdateCard(cardId, field, value);
    };

    const handleImageUpload = async (
        file: File,
        field: 'question' | 'answer'
    ) => {
        try {
            const urls = await uploadFile([file]);
            if (urls && urls.length > 0) {
                const imageMarkdown = `\n\n[![image](${urls[0]})](${urls[0]})`;
                handleTextChange(
                    currentCard.id,
                    field,
                    currentCard[field] + imageMarkdown
                );
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error('Gagal mengupload gambar', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };

    const handlePaste = async (
        e: React.ClipboardEvent,
        field: 'question' | 'answer'
    ) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    await handleImageUpload(file, field);
                    break;
                }
            }
        }
    };

    if (!currentCard) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen md:py-6">
            <div className="max-w-4xl mx-auto md:px-4">
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
                                <Cards />
                                <span className="text-white">
                                    {totalCards} Cards
                                </span>
                            </div>
                            <div className="text-[#333333]">|</div>
                            <div className="flex items-center gap-2">
                                <Visibility />
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
                                value={currentCard.question}
                                onChange={(e) =>
                                    handleTextChange(
                                        currentCard.id,
                                        'question',
                                        e.target.value
                                    )
                                }
                                onPaste={(e) => handlePaste(e, 'question')}
                                placeholder="Istilah atau pertanyaan"
                                className="w-full min-h-[120px] bg-[#222222] rounded-lg p-3 pb-10 text-white resize-none border-none outline-none placeholder:text-neutral-500"
                            />
                            <ImageUploadControls
                                onImageUpload={(file) =>
                                    handleImageUpload(file, 'question')
                                }
                            />
                        </div>

                        <div className="relative">
                            <textarea
                                value={currentCard.answer}
                                onChange={(e) =>
                                    handleTextChange(
                                        currentCard.id,
                                        'answer',
                                        e.target.value
                                    )
                                }
                                onPaste={(e) => handlePaste(e, 'question')}
                                placeholder="Definisi atau jawaban"
                                className="w-full min-h-[120px] bg-[#222222] rounded-lg p-3 pb-10 text-white resize-none border-none outline-none placeholder:text-neutral-500"
                            />
                            <ImageUploadControls
                                onImageUpload={(file) =>
                                    handleImageUpload(file, 'answer')
                                }
                            />
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
                    cards={flashcardData.cards}
                    currentIndex={currentIndex}
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
