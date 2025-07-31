'use client';

import type React from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { HiOutlineCreditCard } from 'react-icons/hi';

interface AddCardButtonProps {
    bottomBorder: boolean;
    redirect?: string;
    fromCheckout: boolean;
}

const AddCardButton: React.FC<AddCardButtonProps> = ({
    bottomBorder = true,
    redirect,
    fromCheckout = false
}) => {
    const router = useRouter();

    const handleAddCard = (): void => {
        if (fromCheckout && redirect) {
            router.push({
                pathname: '/profil/kartu-kredit/tambah-kartu',
                query: { redirect }
            });
        } else {
            router.push('/profil/kartu-kredit/tambah-kartu');
        }
    };

    return (
        <button
            onClick={handleAddCard}
            className={`flex items-center space-x-4 p-4 hover:bg-graphite-800 transition-colors w-full text-left border-graphite-600 rounded-md ${
                bottomBorder ? 'border-b' : ''
            }`}>
            <div className="relative w-8 h-8 shrink-0 bg-white rounded-md flex items-center justify-center">
                <HiOutlineCreditCard className="text-[#5F2BCE]" size={24} />
            </div>
            <span className="text-white font-medium text-md flex-1">
                Tambah Kartu Baru
            </span>
            <Plus size={24} className="text-gray-400 shrink-0" />
        </button>
    );
};

export default AddCardButton;
