import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DaftarIsi from './FlashcardDaftarIsi';
import { BiSave } from 'react-icons/bi';
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { Menu, Transition } from '@headlessui/react';
import { useDeleteCardMutation } from 'flashcard/redux/api/flashcardsApi';
import DeleteModal from '../Detail/DeleteModal';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import Visibility from 'flashcard/assets/Visibility';
import Cards from 'flashcard/assets/Cards';
import useUploadFile from 'commons/hooks/useUploadFile';
import ImageUploadControls from './ImageUploadControls';
import LoadingBackdrop from '../../../commons/components/elements/LoadingBackdrop';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { ChevronLeft, Plus } from 'lucide-react';
import { FaListUl } from 'react-icons/fa';
import DeleteBottomSheet from './DeleteBottomSheet';
import DeleteConfirmationBottomSheet from './DeleteConfirmationBottomSheet';
import FlashcardEditor from './FlashcardEditor';

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
    setCurrentIndex: (index: number) => void;
}

const EditFlashcardForm = ({
    flashcardData,
    currentIndex,
    hasChanges,
    onUpdateCard,
    onAddCard,
    onSave,
    onNavigate,
    setCurrentIndex
}: EditFlashcardFormProps): JSX.Element => {
    const router = useRouter();
    const { uploadFile } = useUploadFile('flashcards');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteCard] = useDeleteCardMutation();
    const currentCard = flashcardData.cards[currentIndex];
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const [isListOpen, setIsListOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const EMPTY_CONTENT_MARKER = '{{EMPTY}}';

    const totalCards = flashcardData.cards.length;

    const handleBack = () => {
        router.back();
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteCard({
                card_id: currentCard.id
            }).unwrap();
            setIsDeleteConfirmOpen(false);
            toast.success('Card berhasil dihapus', {
                position: toast.POSITION.TOP_CENTER
            });
            router.push(`/flashcard/${router.query.slug}`);
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

    if (!currentCard) {
        return <LoadingBackdrop />;
    }

    return (
        <div className="md:min-h-screen md:py-6">
            <div
                className={cn(
                    'fixed top-0 left-0 right-0 bg-black z-50 px-4 py-3',
                    'flex items-center justify-between',
                    'md:hidden'
                )}>
                <button onClick={handleBack} className="text-white">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onSave}
                        disabled={!hasChanges}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                            hasChanges
                                ? 'bg-[#333333] text-white hover:bg-opacity-80'
                                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                        } transition-colors`}>
                        <BiSave size={20} />
                        Simpan
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 rounded-full text-white">
                        <BsThreeDotsVertical size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto md:px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-neutral-400 text-sm">
                            Terakhir disimpan {flashcardData.lastSaved}
                        </p>
                        <h1 className="text-2xl font-bold text-white">
                            {flashcardData.title}
                        </h1>
                        <div className="hidden md:flex items-center gap-4 mt-2">
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
                    <div className="hidden md:flex items-center gap-3">
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

                <div className="rounded-lg md:h-auto h-[75vh] bg-[#181818] p-6 mb-6">
                    <div className="space-y-6 h-full">
                        <div className="relative">
                            <FlashcardEditor
                                value={
                                    currentCard.question ===
                                    EMPTY_CONTENT_MARKER
                                        ? ''
                                        : currentCard.question
                                }
                                onChange={(value) => {
                                    if (
                                        value ||
                                        currentCard.question !==
                                            EMPTY_CONTENT_MARKER
                                    ) {
                                        handleTextChange(
                                            currentCard.id,
                                            'question',
                                            value
                                        );
                                    }
                                }}
                                placeholder="Istilah atau pertanyaan"
                                cardId={currentCard.id}
                            />
                            <ImageUploadControls
                                onImageUpload={(file) =>
                                    handleImageUpload(file, 'question')
                                }
                            />
                        </div>

                        <div className="relative h-[73%]">
                            <FlashcardEditor
                                value={
                                    currentCard.answer === EMPTY_CONTENT_MARKER
                                        ? ''
                                        : currentCard.answer
                                }
                                onChange={(value) => {
                                    if (
                                        value ||
                                        currentCard.answer !==
                                            EMPTY_CONTENT_MARKER
                                    ) {
                                        handleTextChange(
                                            currentCard.id,
                                            'answer',
                                            value
                                        );
                                    }
                                }}
                                placeholder="Definisi atau jawaban"
                                isAnswer
                                cardId={currentCard.id}
                            />
                            <ImageUploadControls
                                onImageUpload={(file) =>
                                    handleImageUpload(file, 'answer')
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex justify-center items-center mb-6">
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

                <div className="hidden md:block h-[0.5px] bg-[#333333] mb-6" />

                <DaftarIsi
                    onAddCard={onAddCard}
                    canAdd={flashcardData.cards.some(
                        (card) => card.id !== 'temp'
                    )}
                    cards={flashcardData.cards}
                    currentIndex={currentIndex}
                    onSelectCard={(index) => {
                        setCurrentIndex(index);
                        setIsListOpen(false);
                    }}
                    isOpen={isListOpen}
                    onClose={() => setIsListOpen(false)}
                    isMobile={isMobileBreakpoints}
                />
            </div>

            <div className="fixed bottom-0 inset-x-0 p-4 flex justify-between items-center md:hidden bg-black">
                <button
                    onClick={() => setIsListOpen(true)}
                    className="p-2 rounded-full text-white">
                    <FaListUl size={24} />
                </button>
                <div className="text-[#666666]">|</div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onNavigate('prev')}
                        disabled={currentIndex === 0}
                        className={`px-2 py-1 rounded-full text-white ${
                            currentIndex === 0
                                ? 'bg-[#333333] opacity-20 cursor-not-allowed'
                                : 'bg-[#333333] hover:bg-opacity-80'
                        }`}>
                        ←
                    </button>
                    <span className="text-[#999999]">
                        {currentIndex + 1}/{flashcardData.cards.length}
                    </span>
                    <button
                        onClick={() => onNavigate('next')}
                        disabled={currentIndex === totalCards - 1}
                        className={`px-2 py-1 rounded-full text-white ${
                            currentIndex === totalCards - 1
                                ? 'bg-[#333333] opacity-20 cursor-not-allowed'
                                : 'bg-[#333333] hover:bg-opacity-80'
                        }`}>
                        →
                    </button>
                </div>
                <div className="text-[#666666]">|</div>
                <button
                    onClick={onAddCard}
                    className="p-2 rounded-full bg-[#5F2BCE] text-white">
                    <Plus size={24} />
                </button>
            </div>

            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}

            <DeleteBottomSheet
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onDelete={handleDelete}
            />

            <DeleteConfirmationBottomSheet
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default EditFlashcardForm;
