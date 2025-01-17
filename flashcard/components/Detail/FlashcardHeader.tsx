import React from 'react';
import { useRouter } from 'next/router';
import { BsFillPencilFill } from 'react-icons/bs';
import { X } from 'lucide-react';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Visibility from 'flashcard/assets/Visibility';
import Cards from 'flashcard/assets/Cards';

interface FlashcardHeaderProps {
    title: string;
    cardCount: number;
    isPrivate: boolean;
    hasCards: boolean;
    onWriteCard?: () => void;
    mode?: 'detail' | 'study';
    createdByMe?: boolean;
}

const FlashcardHeader = ({
    title,
    cardCount,
    isPrivate,
    hasCards,
    onWriteCard,
    mode = 'detail',
    createdByMe = true
}: FlashcardHeaderProps): JSX.Element => {
    const router = useRouter();
    const { isMobileBreakpoints } = useWindowBreakpoints();

    const handleClose = () => {
        router.back();
    };

    const handleStudy = () => {
        router.push(`/flashcard/${router.query.slug}/study`);
    };

    if (mode === 'study' && isMobileBreakpoints) {
        return (
            <div className="flex items-center justify-between w-full p-3 text-white">
                <h1 className="text-xl font-medium">{title}</h1>
                <button
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-800 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{title}</h1>
                <div className="flex items-center gap-2">
                    {mode === 'detail' && (
                        <div className="fixed p-4 md:p-0 bg-black md:bg-transparent md:static bottom-0 left-0 right-0 w-full flex gap-2 border-t border-[#222222] md:border-t-0 z-50">
                            {createdByMe && (
                                <button
                                    onClick={onWriteCard}
                                    className={`inline-flex items-center gap-2 ${
                                        hasCards
                                            ? 'bg-[#333333]'
                                            : 'bg-[#5F2BCE]'
                                    } text-white px-5 py-3 md:px-4 md:py-2 md:p-3 rounded-full hover:opacity-90 transition-colors`}>
                                    <BsFillPencilFill size={14} />
                                    {!hasCards && <span>Tulis Flashcard</span>}
                                </button>
                            )}
                            {hasCards && (
                                <button
                                    onClick={handleStudy}
                                    className="inline-flex items-center gap-2 bg-[#5F2BCE] text-white px-5 py-3 md:px-4 md:py-2 rounded-full w-full justify-center hover:opacity-90 transition-colors font-semibold">
                                    <span>Pelajari Flashcard</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Cards />
                    <span className="text-white">{cardCount} Cards</span>
                </div>
                <div className="text-[#333333]">|</div>
                <div className="flex items-center gap-2">
                    <Visibility />
                    <span className="text-white">
                        {isPrivate ? 'Privat' : 'Publik'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FlashcardHeader;
