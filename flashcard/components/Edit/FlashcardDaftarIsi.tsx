import React from 'react';
import TiptapViewer from 'courses/components/Textbook/TiptapViewer';
import { cn } from 'commons/utils';
import { type Content } from '@tiptap/react';

interface DaftarIsiProps {
    onAddCard: () => void;
    canAdd: boolean;
    cards?: Array<{
        id: string;
        question: Content;
        answer: Content;
    }>;
    currentIndex?: number;
    onSelectCard?: (index: number) => void;
}

const DaftarIsi = ({
    onAddCard,
    canAdd,
    cards = [],
    currentIndex = 0,
    onSelectCard
}: DaftarIsiProps): JSX.Element => {
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
                                    <TiptapViewer
                                        content={card.question}
                                        className="text-white"
                                    />
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
