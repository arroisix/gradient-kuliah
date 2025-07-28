'use client';

import type React from 'react';
import { ChevronRight, CreditCardIcon } from 'lucide-react';
import Image from 'next/image';
import { HiOutlineCreditCard } from 'react-icons/hi';

interface CreditCardItemProps {
    card: CreditCard;
    onClick?: () => void;
}

const CreditCardItem: React.FC<CreditCardItemProps> = ({ card, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center space-x-4 p-4 hover:bg-graphite-800 transition-colors w-full text-left border-b border-graphite-600 rounded-md">
            <div className="bg-white rounded-md flex items-center justify-center p-1">
                <HiOutlineCreditCard className="text-[#5F2BCE]" size={24} />
            </div>

            <div className="flex-1">
                <div className="text-white font-medium">{card.name}</div>
                <div className="text-gray-400 text-sm">{card.brand}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
    );
};

export default CreditCardItem;
