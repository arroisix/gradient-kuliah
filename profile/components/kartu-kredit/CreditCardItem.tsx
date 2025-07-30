'use client';

import type React from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { HiOutlineCreditCard } from 'react-icons/hi';
import { CDN_URL } from 'commons/constants';
import Link from 'next/link';
import { LOGO_PAYMENT } from 'payment/components/constant';

interface CreditCardItemProps {
    card: CreditCard;
}

const CreditCardItem: React.FC<CreditCardItemProps> = ({ card }) => {
    const getCardLogo = (brand: string): JSX.Element => {
        if (['MASTERCARD', 'VISA', 'AMEX', 'JCB'].includes(brand)) {
            return (
                <Image
                    src={`${CDN_URL}/assets/payments/${
                        LOGO_PAYMENT[`CARD_${brand}` as PaymentMethod]
                    }`}
                    className="object-contain"
                    width={24}
                    height={24}
                />
            );
        } else {
            return <HiOutlineCreditCard className="text-[#5F2BCE]" size={24} />;
        }
    };

    return (
        <Link
            href={`/profil/kartu-kredit/${card.id}`}
            className="flex items-center space-x-4 p-4 hover:bg-graphite-800 transition-colors w-full text-left border-b border-graphite-600 rounded-md">
            <div className="bg-white rounded-md flex items-center justify-center p-1 overflow-hidden">
                {getCardLogo(card.brand)}
            </div>

            <p className="text-white font-medium">{card.brand}</p>
            <p
                className={`text-gray-400 text-sm ${
                    card.needs_refresh ? '' : 'flex-1'
                }`}>
                {card.name}
            </p>
            {card.needs_refresh && (
                <div className="flex-1 text-red-400 text-sm">Expired</div>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
    );
};

export default CreditCardItem;
