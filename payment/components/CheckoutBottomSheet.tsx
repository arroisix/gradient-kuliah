'use client';

import type React from 'react';
import { useState } from 'react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { formatCurrency } from 'commons/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import { BsShieldFillCheck } from 'react-icons/bs';

const CheckoutBottomSheet: React.FC = () => {
    const { packet, paymentMethod, promoCode, phoneNumber, phoneNumberError } =
        usePayment();
    const [isExpanded, setIsExpanded] = useState(false);

    const handlePromoClick = () => {
        // TODO: Implement promo code modal
        console.log('Open promo modal');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700">
            {/* Promo Code Section */}
            <div className="px-4 py-3">
                <div className="mx-32">
                    <button
                        onClick={handlePromoClick}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium text-sm">
                        Pakai kode promo/referral
                    </button>
                </div>
            </div>

            {/* Checkout Section */}
            <div className="px-4 pb-4">
                <div className="mx-32">
                    {/* Expanded Summary */}
                    {isExpanded && (
                        <div className="mb-4 pb-4 border-b border-gray-700">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">
                                        Harga Paket
                                    </span>
                                    <span className="text-white">
                                        {formatCurrency(packet?.price || '0')}
                                    </span>
                                </div>
                                {/* Add discount rows here when promo is applied */}
                                <div className="flex justify-between font-semibold pt-2 border-t border-gray-700">
                                    <span className="text-white">Subtotal</span>
                                    <span className="text-white">
                                        {formatCurrency(packet?.price || '0')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Total and Checkout Button Row */}
                <div className="flex items-center justify-between mx-32">
                    <div className="flex-1">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => setIsExpanded(!isExpanded)}>
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Total Bayar
                                </p>
                                <p className="text-white font-bold text-lg">
                                    {formatCurrency(packet?.price || '0')}
                                </p>
                            </div>
                            <div className="ml-2 text-white">
                                {isExpanded ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronUp size={16} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="ml-4">
                        <CheckoutButton
                            packetId={packet?.id as string}
                            paymentMethod={paymentMethod}
                            promoCode={promoCode}
                            disabled={
                                (paymentMethod === 'VOUCHER' && !promoCode) ||
                                (paymentMethod === 'ID_OVO' &&
                                    (!phoneNumber ||
                                        phoneNumber === '+62' ||
                                        !!phoneNumberError))
                            }
                            phoneNumber={phoneNumber}
                        />
                        <span className="flex items-center mt-2 text-xs">
                            <BsShieldFillCheck className="mr-2" />
                            Secure Payment
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutBottomSheet;
