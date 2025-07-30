'use client';

import type React from 'react';
import Image from 'next/image';
import { LOGO_PAYMENT, NAME_PAYMENT } from './constant';
import { CDN_URL } from 'commons/constants';
import { useTracker } from 'tracker/tracker';
import { addZeroBefore, getCSChatRoom } from 'commons/utils';
import { usePayment } from 'payment/contexts/PaymentProvider';
import PromoCodeInput from './PromoCodeInput';
import Input from 'commons/components/elements/Form/input';

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
    const {
        setPaymentMethod,
        phoneNumber,
        setPhoneNumber,
        phoneNumberError,
        setPhoneNumberError
    } = usePayment();

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
                <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                        src={method.mobile_logo || getLogoUrl()}
                        alt={method.payment_name}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded"
                    />
                </div>
                <span className="text-white font-medium text-md flex-1">
                    {NAME_PAYMENT[method.payment_code]}
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
            {isSelected && method.payment_code === 'ID_OVO' && (
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
            {isSelected && method.payment_code === 'VOUCHER' && (
                <div className="ml-16 mr-4 mb-4">
                    <PromoCodeInput
                        placeholder="Masukkan kode voucher"
                        variant="inline"
                        className="w-full"
                        applyAfterValid={true}
                    />
                </div>
            )}
        </div>
    );
};

export default PaymentMethodItem;
