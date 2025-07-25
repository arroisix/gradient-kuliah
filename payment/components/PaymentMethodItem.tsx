'use client';

import type React from 'react';
import Image from 'next/image';
import { LOGO_PAYMENT, NAME_PAYMENT } from './constant';
import { CDN_URL } from 'commons/constants';
import { useTracker } from 'tracker/tracker';
import { addZeroBefore, getCSChatRoom } from 'commons/utils';
import { usePayment } from 'payment/contexts/PaymentProvider';

interface PaymentMethodItemProps {
    method: PaymentMethodData;
    isSelected: boolean;
    onClick?: () => void;
    isManual?: boolean;
    isLast?: boolean;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
    method,
    isSelected,
    onClick,
    isManual,
    isLast = false
}) => {
    const tracker = useTracker();
    const { setPaymentMethod } = usePayment();

    const getLogoUrl = (): string => {
        return `${CDN_URL}/assets/payments/${
            LOGO_PAYMENT[method.payment_code as PaymentMethod]
        }`;
    };

    const selectOption = (): void => {
        if (isManual) {
            tracker?.genericTrack('Click Manual Payment Method', {
                'Method Name': method.payment_code
            });
            const currentDate = new Date();
            window.open(
                getCSChatRoom(
                    'WA',
                    encodeURIComponent(
                        `Halo, Saya tertarik untuk berlangganan dan membayar via transfer BCA\n\n[ID:${currentDate.getDate()}${addZeroBefore(
                            currentDate.getMonth() + 1
                        )}${currentDate.getFullYear()}:BCA]`
                    )
                )
            );
        } else {
            tracker?.genericTrack('Click Payment Method', {
                'Method Name': method.payment_code
            });
            setPaymentMethod(method.payment_code);
        }
    };

    return (
        <div
            className={`flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                !isLast ? 'border-b border-gray-700/50' : ''
            }`}
            onClick={onClick ?? selectOption}>
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                        src={method.mobile_logo || getLogoUrl()}
                        alt={method.payment_name}
                        width={32}
                        height={32}
                        className="rounded"
                    />
                </div>
                <span className="text-white font-medium text-sm">
                    {NAME_PAYMENT[method.payment_code]}
                </span>
            </div>

            {!((method.payment_code as string) === 'MANUAL') && (
                <div className="flex-shrink-0">
                    <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-400'
                        }`}>
                        {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodItem;
