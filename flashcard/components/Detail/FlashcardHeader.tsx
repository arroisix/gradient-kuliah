import { BsFillPencilFill } from 'react-icons/bs';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { IoEyeOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';

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
    const { id } = router.query;

    const handleStudy = () => {
        router.push(`/flashcard/${id}/study`);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <div className="flex items-center gap-2">
                    {mode === 'detail' && (
                        <div className="fixed p-4 bg-black md:bg-transparent md:static bottom-0 left-0 right-0 w-full flex gap-2 border-t border-[#222222] md:border-t-0 z-50">
                            {createdByMe && (
                                <button
                                    onClick={onWriteCard}
                                    className={`inline-flex items-center gap-2 ${
                                        hasCards
                                            ? 'bg-[#333333]'
                                            : 'bg-[#5F2BCE]'
                                    } text-white p-4 md:p-3 rounded-full hover:opacity-90 transition-colors`}>
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
                    <HiOutlineDocumentText
                        size={20}
                        className="text-[#7D89CC]"
                    />
                    <span className="text-white">{cardCount} Cards</span>
                </div>
                <div className="text-[#333333]">|</div>
                <div className="flex items-center gap-2">
                    <IoEyeOutline size={20} className="text-[#7D89CC]" />
                    <span className="text-white">
                        {isPrivate ? 'Privat' : 'Publik'}
                    </span>
                </div>
            </div>
        </>
    );
};

export default FlashcardHeader;
