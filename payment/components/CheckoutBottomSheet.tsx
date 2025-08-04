'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { formatCurrency } from 'commons/utils';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import { BsShieldFillCheck } from 'react-icons/bs';

interface Props {
    onPromoClick: () => void;
}

const CheckoutBottomSheet: React.FC<Props> = ({ onPromoClick }) => {
    const sheetRef = useRef<HTMLDivElement>(null);
    const {
        packet,
        paymentMethod,
        phoneNumber,
        phoneNumberError,
        cardId,
        appliedPromo
    } = usePayment();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [mode, setMode] = useState<'fixed' | 'absolute'>('fixed');
    const [bottomOffset, setBottomOffset] = useState(0);

    useEffect(() => {
        const footer = document.getElementById('footer');
        if (!footer) return;

        const measure = () => {
            setBottomOffset(footer.offsetHeight);
        };

        measure();

        window.addEventListener('resize', measure);

        // when footer scrolls into view, switch to "absolute"
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setMode('absolute');
                } else {
                    setMode('fixed');
                }
            },
            { root: null, threshold: 0 }
        );

        obs.observe(footer);
        return () => {
            obs.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

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
        <div
            ref={sheetRef}
            style={{ bottom: mode === 'fixed' ? 0 : bottomOffset }}
            className={`${
                mode === 'fixed' ? 'fixed' : 'absolute'
            } z-10 inset-x-4 sm:inset-x-8 lg:inset-x-32 bottom-0 bg-[#181818] rounded-t-xl shadow-lg overflow-hidden`}>
            {/* Promo Code Section */}
            <div className="px-4 py-3 relative overflow-visible">
                <button
                    onClick={onPromoClick}
                    className={`relative overflow-hidden w-full rounded-lg py-4 flex items-center gap-3 ${
                        appliedPromo
                            ? 'pl-10 bg-[#03AC5C]/20'
                            : 'pl-[50px] bg-gradient-to-r from-[#741F86] via-[#965084] to-[#A82C56] hover:from-[#8B25A0] hover:to-[#C93467] transition-colors'
                    }`}>
                    <>
                        {/* half circles */}
                        <span className="absolute w-8 h-8 bg-[#181818] rounded-full -left-4 top-1/2 -translate-y-1/2 z-10" />
                        <span className="absolute w-8 h-8 bg-[#181818] rounded-full -right-4 top-1/2 -translate-y-1/2 z-10" />

                        {/* dashed lines */}
                        <div className="absolute top-0 bottom-0 left-8 border-l-[3px] border-dashed border-[#181818] pointer-events-none" />
                    </>

                    {appliedPromo && (
                        <div className="relative w-5 h-5 bg-[#03AC5C] flex items-center justify-center rounded-full ml-1">
                            <Check className="w-4 h-4 text-[#181818] z-10" />
                        </div>
                    )}
                    <span className="relative z-10 text-white text-sm font-body font-bold">
                        {getPromoButtonText()}
                    </span>
                </button>
            </div>

            {/* Checkout Section */}
            <div className="px-4 pb-4">
                <div>
                    {/* Expanded Summary */}
                    {isExpanded && (
                        <div className="mb-4 rounded-lg bg-graphite-800 p-4">
                            <h3 className="text-neutral-50 font-semibold text-sm mb-2 font-body">
                                Ringkasan Pembayaran
                            </h3>

                            <div className="flex justify-between items-center">
                                <span className="text-neutral-200 text-sm font-body">
                                    {packet?.packet_name}
                                </span>
                                <span className="text-neutral-50 text-sm font-body">
                                    {formatCurrency(packet?.price || '0')}
                                </span>
                            </div>

                            {appliedPromo?.is_valid && (
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-neutral-200 text-sm font-body">
                                        Diskon {appliedPromo.promo_code}
                                    </span>
                                    <span className="text-state-success text-sm font-body">
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
                    <button
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}>
                        <div>
                            <p className="text-neutral-400 text-xs font-normal text-left">
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
                    </button>

                    {/* Checkout Button */}
                    <div className="ml-4 min-w-[12rem]">
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
                            userCardId={cardId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutBottomSheet;
