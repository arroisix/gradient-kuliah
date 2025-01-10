import React, { useState } from 'react';
import { BsFillPencilFill } from 'react-icons/bs';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { IoEyeOutline } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { BiShare } from 'react-icons/bi';
import { useRouter } from 'next/router';
import {
    useAddCardMutation,
    useDeleteFlashcardMutation,
    useGetFlashcardDetailQuery
} from '../redux/api/flashcardsApi';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import DeleteModal from '../components/Detail/DeleteModal';

const FlashcardDetailContainer = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteFlashcard] = useDeleteFlashcardMutation();
    const [addCard] = useAddCardMutation();

    const { data: flashcard, isLoading, refetch } = useGetFlashcardDetailQuery(
        { flashcard_id: id as string },
        {
            skip: !id
        }
    );

    const handleEdit = async () => {
        if (!flashcard) return;
    
        if (!flashcard.cards || flashcard.cards.length === 0) {
            try {
                const newCard = await addCard({
                    flashcard_id: id as string,
                    question: {
                        type: 'doc',
                        content: [
                            {
                                type: 'paragraph',
                                attrs: { textAlign: 'justify' },
                                content: [{ type: 'text', text: '' }]
                            }
                        ]
                    },
                    answer: {
                        type: 'doc',
                        content: [
                            {
                                type: 'paragraph',
                                attrs: { textAlign: 'justify' },
                                content: [{ type: 'text', text: '' }]
                            }
                        ]
                    }
                }).unwrap();
    
                await refetch();
    
                router.push(`/flashcard/${id}/edit`);
            } catch (error) {
                console.error('Failed to create initial card:', error);
                return;
            }
        } else {
            router.push(`/flashcard/${id}/edit`);
        }
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (id) {
                const response = await deleteFlashcard({
                    flashcard_id: id as string
                }).unwrap();
                console.log(
                    'Flashcard deleted successfully:',
                    response.message
                );
                setIsDeleteModalOpen(false);
                router.push('/flashcard');
            }
        } catch (error) {
            console.error('Failed to delete flashcard:', error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!flashcard) {
        return <></>;
    }

    const truncatedDesc = flashcard.description.slice(0, 132);
    const shouldTruncate = flashcard.description.length > 132;
    const userInitials = flashcard.created_by.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('');

    return (
        <div className="px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">
                    {flashcard.title}
                </h1>
                <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 bg-[#5F2BCE] text-white px-4 py-2 rounded-full hover:opacity-90 transition-colors font-semibold">
                    <BsFillPencilFill size={20} />
                    <span>Tulis Flashcard</span>
                </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <HiOutlineDocumentText
                        size={20}
                        className="text-[#7D89CC]"
                    />
                    <span className="text-white">
                        {flashcard.card_count} Cards
                    </span>
                </div>
                <div className="text-[#333333]">|</div>
                <div className="flex items-center gap-2">
                    <IoEyeOutline size={20} className="text-[#7D89CC]" />
                    <span className="text-white">
                        {flashcard.is_private ? 'Privat' : 'Publik'}
                    </span>
                </div>
            </div>

            {(!flashcard.cards || flashcard.cards.length === 0) && (
                <div className="bg-[#222222] rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-white mb-4">
                                Yah... flashcard kamu masih kosong
                            </h2>
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center gap-2 bg-[#5F2BCE] text-white px-4 py-2 rounded-full hover:opacity-90 transition-colors text-sm font-semibold">
                                <BsFillPencilFill size={16} />
                                <span>Tulis Flashcard</span>
                            </button>
                        </div>
                        <div className="w-24 h-24"></div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <p className="text-sm text-neutral-400">Deskripsi</p>
                <div>
                    <p className="text-neutral-200">
                        {isDescExpanded ? flashcard.description : truncatedDesc}
                        {shouldTruncate && !isDescExpanded && '...'}
                    </p>
                    {shouldTruncate && (
                        <button
                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                            className="text-[#B6A6F3] hover:opacity-80 text-sm font-medium mt-1">
                            {isDescExpanded ? 'Show Less' : 'Read More'}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#5F2BCE] flex items-center justify-center text-white text-sm">
                        {userInitials}
                    </div>
                    <div>
                        <p className="text-sm text-neutral-400">Dibuat oleh</p>
                        <p className="font-medium text-white">
                            {flashcard.created_by.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 px-4 text-sm font-semibold py-2 bg-[#333333] text-white hover:bg-opacity-80 transition-colors rounded-full">
                        <BiShare size={20} />
                        <span>Bagikan</span>
                    </button>

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
                                            onClick={handleEdit}
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
                                            onClick={handleDelete}
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
                </div>
            </div>

            <div className="h-[0.5px] bg-[#333333] mb-6" />

            <div>
                <h2 className="text-xl font-bold text-white mb-4">Favorit</h2>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-24 h-24 mb-4" />
                    <p className="text-neutral-400">
                        Belum ada flashcard favorit
                    </p>
                </div>
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

export default FlashcardDetailContainer;
