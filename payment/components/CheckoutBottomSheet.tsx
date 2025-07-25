'use client';

import type React from 'react';
import { useState } from 'react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { formatCurrency } from 'commons/utils';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import { BsShieldFillCheck } from 'react-icons/bs';
import { PromoCodeModal } from './PromoCodeModal';

const CheckoutBottomSheet: React.FC = () => {
    const {
        packet,
        paymentMethod,
        phoneNumber,
        phoneNumberError,
        appliedPromo
    } = usePayment();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);

    const handlePromoClick = () => {
        setIsPromoModalOpen(true);
    };

    const calculateFinalPrice = () => {
        if (appliedPromo?.is_valid && appliedPromo?.payment_amount) {
            return appliedPromo.payment_amount;
        }
        return packet?.price || '0';
    };

    const getPromoButtonText = () => {
        if (appliedPromo) {
            if (appliedPromo.promo_type === 'REFERRAL') {
                return `Referral (-${formatCurrency(
                    appliedPromo.discount_amount.toString()
                )})`;
            } else {
                if (appliedPromo.discount_amount_original) {
                    return `Diskon ${appliedPromo.discount_amount_original}`;
                } else {
                    return `Diskon ${formatCurrency(
                        appliedPromo.discount_amount.toString()
                    )}`;
                }
            }
        }
        return 'Pakai kode promo/referral';
    };

    return (
        <div className="fixed inset-x-32 bottom-0 bg-graphite-900 border border-graphite-700 rounded-t-xl shadow-lg overflow-hidden">
            {/* Promo Code Section */}
            {!isExpanded && (
                <div className="px-4 py-3 relative overflow-visible">
                    <button
                        onClick={handlePromoClick}
                        className={`relative overflow-hidden w-full rounded-lg py-4 flex items-center gap-3 ${
                            appliedPromo
                                ? 'pl-10 bg-emerald-900'
                                : 'pl-[50px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        }`}>
                        <>
                            {/* half circles */}
                            <span className="absolute w-8 h-8 bg-graphite-900 rounded-full -left-4 top-1/2 -translate-y-1/2 z-10" />
                            <span className="absolute w-8 h-8 bg-graphite-900 rounded-full -right-4 top-1/2 -translate-y-1/2 z-10" />

                            {/* dashed lines */}
                            <div className="absolute top-0 bottom-0 left-8 border-l-2 border-dashed border-gray-900 pointer-events-none" />
                        </>

                        {appliedPromo && (
                            <Check className="relative w-6 h-6 text-green-500 z-10" />
                        )}
                        <span className="relative z-10 text-white font-bold text-sm">
                            {getPromoButtonText()}
                        </span>
                    </button>
                </div>
            )}

            {/* Checkout Section */}
            <div className="px-4 pb-4">
                <div>
                    {/* Expanded Summary */}
                    {isExpanded && (
                        <div className="mb-4 mt-3 rounded-lg bg-graphite-800 p-4">
                            <h3 className="text-neutral-50 font-semibold text-sm mb-2">
                                Ringkasan Pembayaran
                            </h3>

                            <div className="flex justify-between items-center">
                                <span className="text-neutral-200 text-sm font-normal">
                                    {packet?.packet_name}
                                </span>
                                <span className="text-neutral-50 text-sm font-normal">
                                    {formatCurrency(packet?.price || '0')}
                                </span>
                            </div>

                            {appliedPromo?.is_valid && (
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-neutral-200 text-sm font-normal">
                                        Diskon {appliedPromo.promo_code}
                                    </span>
                                    <span className="text-state-success text-sm font-normal">
                                        -
                                        {formatCurrency(
                                            appliedPromo.discount_amount.toString()
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Total and Checkout Button Row */}
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => setIsExpanded(!isExpanded)}>
                            <div>
                                <p className="text-neutral-400 text-xs font-normal">
                                    Total Bayar
                                </p>
                                <p className="text-neutral-50 font-bold text-xl">
                                    {formatCurrency(
                                        calculateFinalPrice().toString()
                                    )}
                                </p>
                            </div>
                            <div className="ml-2 text-neutral-50">
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
                            promoCode={appliedPromo?.promo_code}
                            disabled={
                                (paymentMethod === 'VOUCHER' &&
                                    !appliedPromo) ||
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
            <PromoCodeModal
                isOpen={isPromoModalOpen}
                setOpen={setIsPromoModalOpen}
            />
        </div>
    );
};

export default CheckoutBottomSheet;
