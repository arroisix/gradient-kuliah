'use client';

import type React from 'react';
import Image from 'next/image';
import { LOGO_PAYMENT, NAME_PAYMENT } from './constant';
import { CDN_URL } from 'commons/constants';
import { useTracker } from 'tracker/tracker';
import { addZeroBefore, getCSChatRoom } from 'commons/utils';
import { usePayment } from 'payment/contexts/PaymentProvider';
import PromoCodeInput from './PromoCodeInput';

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
        <div className={`${!isLast ? 'border-b border-gray-700/50' : ''}`}>
            <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
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
            </div>

            {/* Phone Number Input for OVO */}
            {isSelected && method.payment_code === 'ID_OVO' && (
                <div className="px-4 pb-4 pt-2">
                    <div className="ml-11">
                        <div className="flex justify-between items-center gap-3 w-full mt-2 px-4 bg-[#2D2D2D] rounded-[6px]">
                            <div>
                                <span className="text-neutral-400">+62</span>
                            </div>
                            <input
                                type="tel"
                                placeholder="8211234567"
                                required={true}
                                pattern="\+[1-9]\d{10,14}"
                                onChange={(event) =>
                                    handleSetPhoneNumber(event.target.value)
                                }
                                className="w-full px-0 py-4 text-xs bg-transparent border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 focus:appearance-none"
                            />
                        </div>
                        {phoneNumberError && (
                            <div className="px-2 pt-2 text-xs font-body text-state-error">
                                {phoneNumberError}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Voucher Code Input for VOUCHER */}
            {isSelected && method.payment_code === 'VOUCHER' && (
                <div className="px-4 pb-4 pt-2">
                    <div className="ml-11 flex items-center space-x-3">
                        <PromoCodeInput
                            placeholder="Masukkan kode voucher"
                            variant="inline"
                            className="w-full"
                            applyAfterValid={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodItem;
