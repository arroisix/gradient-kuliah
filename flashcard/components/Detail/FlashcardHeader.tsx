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
}

const FlashcardHeader = ({
    title,
    cardCount,
    isPrivate,
    hasCards,
    onWriteCard,
    mode = 'detail'
}: FlashcardHeaderProps): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;

    const handleStudy = () => {
        router.push(`/flashcard/${id}/study`);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <div className="flex items-center gap-2">
                    {mode === 'detail' && (
                        <>
                            <button
                                onClick={onWriteCard}
                                className={`inline-flex items-center gap-2 ${
                                    hasCards ? 'bg-[#333333]' : 'bg-[#5F2BCE]'
                                } text-white p-3 rounded-full hover:opacity-90 transition-colors`}>
                                <BsFillPencilFill size={14} />
                                {!hasCards && <span>Tulis Flashcard</span>}
                            </button>
                            {hasCards && (
                                <button
                                    onClick={handleStudy}
                                    className="inline-flex items-center gap-2 bg-[#5F2BCE] text-white px-4 py-2 rounded-full hover:opacity-90 transition-colors font-semibold">
                                    <span>Pelajari Flashcard</span>
                                </button>
                            )}
                        </>
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
