'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { formatCurrency } from 'commons/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import TopupButton from './TopupButton';

interface Props {
    onPromoClick: () => void;
}

const CheckoutTopupBottomSheet: React.FC<Props> = () => {
    const sheetRef = useRef<HTMLDivElement>(null);
    const {
        topupAmount,
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
        return topupAmount || 0;
    };

    const getDisplayPrice = (): string => {
        const raw = calculateFinalPrice();
        if (topupAmount === 0 || Number(raw) <= 0) {
            return 'GRATIS';
        }
        return formatCurrency(raw.toString());
    };

    return (
        <div
            ref={sheetRef}
            style={{ bottom: mode === 'fixed' ? 0 : bottomOffset }}
            className={`${
                mode === 'fixed' ? 'fixed' : 'absolute'
            } mx-auto z-10 p-2 inset-x-0 sm:inset-x-8 lg:inset-x-32 bottom-0 bg-[#181818] rounded-t-xl shadow-lg overflow-hidden max-w-screen-xl`}>
            {/* Checkout Section */}
            <div
                className={`px-4 pb-4 ${
                    paymentMethod === 'VOUCHER' && 'pt-4'
                }`}>
                <div>
                    {/* Expanded Summary */}
                    {isExpanded && (
                        <div className="mb-4 rounded-lg bg-graphite-800 p-4">
                            <h3 className="text-neutral-50 font-semibold text-sm mb-2 font-body">
                                Ringkasan Pembayaran
                            </h3>

                            <div className="flex justify-between items-center">
                                <span className="text-neutral-50 text-sm font-body">
                                    {topupAmount === 0
                                        ? 'GRATIS'
                                        : formatCurrency(
                                              topupAmount.toString()
                                          )}
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
                <div className="flex gap-3 pb-2 flex-col md:flex-row md:justify-between md:items-center md:pb-0">
                    <button
                        className="flex items-center cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setIsExpanded(!isExpanded)}>
                        <div className="flex flex-row items-center md:items-start md:flex-col flex-1 min-w-0">
                            <p className="text-white md:text-neutral-400 text-xs font-normal text-left">
                                Total Bayar
                            </p>
                            <p className="text-neutral-50 text-md font-semibold md:font-bold md:text-xl flex-1 text-right">
                                {getDisplayPrice()}
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
                    <div className="min-w-[12rem]">
                        <TopupButton
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

export default CheckoutTopupBottomSheet;
