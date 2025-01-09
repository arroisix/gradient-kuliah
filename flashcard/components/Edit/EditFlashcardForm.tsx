import React from 'react';
import { useRouter } from 'next/router';
import { IoEyeOutline } from 'react-icons/io5';
import { IoCamera, IoImage } from 'react-icons/io5';
import DaftarIsi from './FlashcardDaftarIsi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { BiSave } from 'react-icons/bi';
import { ImOmega } from 'react-icons/im';
import { BsThreeDots } from 'react-icons/bs';

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
    const currentCard = flashcardData.cards[currentIndex] || {
        id: 'temp',
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
    };

    const totalCards = flashcardData.cards.length;

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
                        <button
                            onClick={() =>
                                router.push(`/flashcard/${router.query.id}`)
                            }
                            className="p-2 rounded-full bg-[#333333] text-white hover:bg-opacity-80 transition-colors">
                            <BsThreeDots size={20} />
                        </button>
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
                            {currentIndex + 1}/{totalCards}
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

                <DaftarIsi onAddCard={onAddCard} />
            </div>
        </div>
    );
};

export default EditFlashcardForm;
