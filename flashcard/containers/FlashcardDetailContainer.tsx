import React, { useState } from 'react';
import { BsFillPencilFill } from 'react-icons/bs';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { IoEyeOutline } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { BiShare } from 'react-icons/bi';
import { useRouter } from 'next/router';

const MOCK_DATA = {
    id: '7f7bcfc9-50bd-4cd9-b65c-945dc5d99bf7',
    title: 'UTS DDP 1',
    description:
        'Bahas materi Python, mulai dari basic rules, looping, rekursif, dan OOP lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit...',
    is_private: false,
    card_count: 0,
    created_by: {
        name: 'Astrida Nayla Fauzia',
        photo_profile: ''
    }
};

const FlashcardDetailContainer = () => {
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const router = useRouter();
    const { description } = MOCK_DATA;

    const truncatedDesc = description.slice(0, 132);
    const shouldTruncate = description.length > 132;
    const userInitials = MOCK_DATA.created_by.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('');

    const handleEdit = () => {
        router.push(`/flashcard/${MOCK_DATA.id}/edit`);
    };

    return (
        <div className="px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">
                    {MOCK_DATA.title}
                </h1>
                <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 bg-[#5F2BCE] text-white px-6 py-3 rounded-full hover:opacity-90 transition-colors font-semibold">
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
                        {MOCK_DATA.card_count} Cards
                    </span>
                </div>
                <div className="text-[#333333]">|</div>
                <div className="flex items-center gap-2">
                    <IoEyeOutline size={20} className="text-[#7D89CC]" />
                    <span className="text-white">Publik</span>
                </div>
            </div>

            <div className="bg-[#222222] rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-white mb-4">
                            Yah... flashcard kamu masih kosong
                        </h2>
                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-2 bg-[#5F2BCE] text-white px-6 py-3 rounded-full hover:opacity-90 transition-colors text-sm font-semibold">
                            <BsFillPencilFill size={16} />
                            <span>Tulis Flashcard</span>
                        </button>
                    </div>
                    {/* Icon placeholder */}
                    <div className="w-24 h-24"></div>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-neutral-400">Deskripsi</p>
                <div>
                    <p className="text-neutral-200">
                        {isDescExpanded ? description : truncatedDesc}
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
                            {MOCK_DATA.created_by.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 px-4 text-sm font-semibold py-2 bg-[#333333] text-white hover:bg-opacity-80 transition-colors rounded-full">
                        <BiShare size={20} />
                        <span>Bagikan</span>
                    </button>
                    <button className="p-2 bg-[#333333] text-white hover:bg-opacity-80 transition-colors rounded-full">
                        <BsThreeDots size={20} />
                    </button>
                </div>
            </div>

            <div className="h-[0.5px] bg-[#333333] mb-6" />

            <div>
                <h2 className="text-xl font-bold text-white mb-4">Favorit</h2>
                <div className="flex flex-col items-center justify-center py-12">
                    {/* Icon placeholder */}
                    <div className="w-24 h-24 mb-4" />
                    <p className="text-neutral-400">
                        Belum ada flashcard favorit
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FlashcardDetailContainer;
