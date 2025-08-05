'use client';

import type React from 'react';
import Image from 'next/image';
import { LOGO_PAYMENT, NAME_PAYMENT } from './constant';
import { CDN_URL } from 'commons/constants';
import { useTracker } from 'tracker/tracker';
import { addZeroBefore, getCSChatRoom } from 'commons/utils';
import { usePayment } from 'payment/contexts/PaymentProvider';
import PromoCodeInput from './PromoCodeInput2';
import Input from 'commons/components/elements/Form/input';
import { HiOutlineCreditCard } from 'react-icons/hi';
import { Gift } from 'lucide-react';

interface PaymentMethodItemProps {
    methodCode: PaymentMethod;
    isSelected: boolean;
    onClick?: () => void;
    isManual?: boolean;
    isLast?: boolean;
    cardId?: string;
    cardName?: string;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
    methodCode,
    isSelected,
    onClick,
    isManual,
    isLast = false,
    cardId,
    cardName
}) => {
    const tracker = useTracker();
    const {
        setPaymentMethod,
        setPhoneNumber,
        phoneNumberError,
        setPhoneNumberError,
        setCardId
    } = usePayment();

    const getLogo = (): JSX.Element => {
        if (methodCode.startsWith('CARD_')) {
            if (
                ['MASTERCARD', 'VISA', 'AMEX', 'JCB'].includes(
                    methodCode.substring('CARD_'.length)
                )
            ) {
                return (
                    <div className="relative w-7 h-7">
                        <Image
                            src={`${CDN_URL}/assets/payments/${
                                LOGO_PAYMENT[methodCode as PaymentMethod]
                            }`}
                            layout="fill"
                            className="object-contain"
                        />
                    </div>
                );
            } else {
                return (
                    <HiOutlineCreditCard className="text-[#5F2BCE]" size={24} />
                );
            }
        } else if (methodCode === 'FREE') {
            return <Gift className="text-[#5F2BCE]" size={24} />;
        } else {
            return (
                <Image
                    src={`${CDN_URL}/assets/mobile-${
                        LOGO_PAYMENT[methodCode as PaymentMethod]
                    }`}
                    alt={NAME_PAYMENT[methodCode]}
                    layout="fill"
                    objectFit="cover"
                />
            );
        }
    };

    const selectOption = (): void => {
        if (isManual) {
            tracker?.genericTrack('Click Manual Payment Method', {
                'Method Name': methodCode
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
                'Method Name': methodCode
            });
            setPaymentMethod(methodCode);
            if (methodCode.startsWith('CARD_')) {
                setCardId(cardId);
            }
        }
    };

    function handleSetPhoneNumber(phoneNumber: string): void {
        if (!phoneNumber.match(/^\d{1,14}$/)) {
            setPhoneNumberError('Invalid phone number format');
        } else {
            setPhoneNumberError('');
        }
        setPhoneNumber(phoneNumber);
    }

    return (
        <div className={`${!isLast ? 'border-b border-graphite-600/50' : ''}`}>
            <button
                className="text-left flex items-center w-full p-4 space-x-4 cursor-pointer hover:bg-graphite-800/50 transition-colors"
                onClick={onClick ?? selectOption}>
                <div
                    className={`relative w-8 h-8 shrink-0 flex rounded-md items-center justify-center ${
                        methodCode.startsWith('CARD_') || methodCode === 'FREE'
                            ? 'bg-white'
                            : ''
                    }`}>
                    {getLogo()}
                </div>
                <span className="text-white font-medium text-md flex-1">
                    {cardName ?? NAME_PAYMENT[methodCode]}
                </span>

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
            </button>

            {/* Phone Number Input for OVO */}
            {isSelected && methodCode === 'ID_OVO' && (
                <div className="ml-16 mb-4 mr-4">
                    <Input
                        type="tel"
                        name="telnum"
                        placeholder="8211234567"
                        onChange={(e) => handleSetPhoneNumber(e.target.value)}
                        startAddorment={
                            <span className="text-neutral-400">+62</span>
                        }
                        error={
                            !!phoneNumberError ? phoneNumberError : undefined
                        }
                        className="text-sm rounded-lg border border-graphite-700"
                    />
                </div>
            )}

            {/* Voucher Code Input for VOUCHER */}
            {isSelected && methodCode === 'VOUCHER' && (
                <div className="ml-16 mr-4 mb-4">
                    <PromoCodeInput
                        placeholder="Masukkan kode voucher"
                        className="w-full"
                        applyAfterValid={true}
                    />
                </div>
            )}
        </div>
    );
};

export default PaymentMethodItem;
