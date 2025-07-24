'use client';

import type React from 'react';
import Image from 'next/image';

interface PaymentMethodItemProps {
    onClick: () => void;
    isLast?: boolean;
}

const PaymentMethodOtherItem: React.FC<PaymentMethodItemProps> = ({
    onClick,
    isLast = false
}) => {
    return (
        <div
            className={`flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                !isLast ? 'border-b border-gray-700/50' : ''
            }`}
            onClick={onClick}>
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                        src="https://assets.gradient.academy/assets/mobile-other.png"
                        alt="OTHER"
                        width={32}
                        height={32}
                        className="rounded"
                    />
                </div>
                <span className="text-white font-medium text-sm">Lainnya</span>
            </div>
        </div>
    );
};

export default PaymentMethodOtherItem;
