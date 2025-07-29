'use client';

import type React from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { HiOutlineCreditCard } from 'react-icons/hi';

const AddCardButton: React.FC = () => {
    const router = useRouter();

    const handleAddCard = (): void => {
        router.push('/profil/kartu-kredit/tambah-kartu');
    };

    return (
        <button
            onClick={handleAddCard}
            className="flex items-center space-x-4 p-4 hover:bg-graphite-800 transition-colors w-full text-left border-b border-graphite-600 rounded-md">
            <div className="bg-white rounded-md flex items-center justify-center p-1">
                <HiOutlineCreditCard className="text-[#5F2BCE]" size={24} />
            </div>

            <span className="text-white font-medium text-md flex-1">
                Tambah Kartu Baru
            </span>

            <Plus size={24} className="text-gray-400" />
        </button>
    );
};

export default AddCardButton;
