'use client';

import { useState, useEffect } from 'react';
import { Search, X, Check, Loader2 } from 'lucide-react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useValidatePromoMutation } from 'referral/redux/referalApi';

interface PromoCodeInputProps {
    placeholder?: string;
    onValidPromo?: (promo: ValidatePromoResponse) => void;
    showApplyButton?: boolean;
    className?: string;
    variant?: 'modal' | 'inline';
    applyAfterValid: boolean;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
    placeholder = 'Masukkan kode referral',
    onValidPromo,
    showApplyButton = false,
    className = '',
    variant = 'modal',
    applyAfterValid = false
}) => {
    const { packet, setAppliedPromo, appliedPromo } = usePayment();
    const [inputCode, setInputCode] = useState<string>('');
    const [validationState, setValidationState] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    const [validate, { data: validationResult }] = useValidatePromoMutation();

    // Initialize input with applied promo code
    useEffect(() => {
        if (appliedPromo?.promo_code && !inputCode) {
            setInputCode(appliedPromo.promo_code);
            setValidationState('success');
        }
    }, [appliedPromo, inputCode]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (inputCode && inputCode.length > 0) {
            // If the input matches the already applied promo, show success state
            if (appliedPromo?.promo_code === inputCode) {
                setValidationState('success');
                setShowError(false);
                return;
            }

            setValidationState('loading');
            timeoutId = setTimeout(() => {
                handleValidateCode(inputCode);
            }, 1000);
        } else {
            setValidationState('idle');
            setShowError(false);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [inputCode, appliedPromo]);

    const handleValidateCode = async (code: string) => {
        try {
            const result = await validate({
                promo_code: code,
                packet_id: packet?.id as string
            }).unwrap();

            if (result.is_valid) {
                setValidationState('success');
                setShowError(false);
                if (applyAfterValid) {
                    setAppliedPromo(result);
                    if (onValidPromo) {
                        onValidPromo(result);
                    }
                }
            } else {
                setValidationState('error');
                setErrorMessage(
                    result.message ||
                        'Maaf, kode referral ini tidak dapat digunakan'
                );
                setShowError(true);
            }
        } catch (error) {
            setValidationState('error');
            setErrorMessage('Maaf, kode referral ini tidak dapat digunakan');
            setShowError(true);
        }
    };

    const handleApplyCode = (promo: ValidatePromoResponse): void => {
        setAppliedPromo(promo);
        if (onValidPromo) {
            onValidPromo(promo);
        }
    };

    const handleRemovePromo = (): void => {
        setAppliedPromo(undefined);
        setInputCode('');
        setValidationState('idle');
        setShowError(false);
    };

    const handleCloseError = () => {
        setShowError(false);
        setErrorMessage('');
    };

    const getInputIcon = () => {
        switch (validationState) {
            case 'loading':
                return (
                    <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                );
            case 'success':
                return <Check className="w-5 h-5 text-green-500" />;
            default:
                return variant === 'modal' ? (
                    <Search className="w-5 h-5 text-purple-500" />
                ) : null;
        }
    };

    const inputStyles =
        variant === 'modal'
            ? 'w-full px-4 py-3 pr-12 bg-[#2D2D2D] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors'
            : 'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500';

    const errorStyles =
        variant === 'modal'
            ? 'mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center justify-between'
            : 'p-2 bg-red-900/20 border border-red-500/30 rounded text-sm';

    const successStyles =
        variant === 'modal'
            ? 'mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-between'
            : 'p-2 bg-green-900/20 border border-green-500/30 rounded text-sm';

    const isCurrentlyApplied = appliedPromo?.promo_code === inputCode;

    return (
        <div className={className}>
            {/* Input Field */}
            <div className="relative mb-2">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className={inputStyles}
                />
                {variant === 'modal' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getInputIcon()}
                    </div>
                )}
                {variant === 'inline' && getInputIcon() && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getInputIcon()}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {showError && errorMessage && (
                <div className={errorStyles}>
                    <span className="text-red-400 text-sm">{errorMessage}</span>
                    {variant === 'modal' && (
                        <button
                            onClick={handleCloseError}
                            className="text-red-400 hover:text-red-300 transition-colors ml-2">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {/* Success State */}
            {validationState === 'success' &&
                (validationResult || isCurrentlyApplied) && (
                    <div className={successStyles}>
                        <div className="flex items-center">
                            <Check className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-green-400 text-sm font-medium">
                                {inputCode}
                            </span>
                            {isCurrentlyApplied && (
                                <span className="text-green-400 text-xs ml-2">
                                    (Diterapkan)
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {showApplyButton &&
                                !isCurrentlyApplied &&
                                validationResult && (
                                    <button
                                        onClick={() =>
                                            handleApplyCode(validationResult)
                                        }
                                        className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full transition-colors">
                                        Pakai
                                    </button>
                                )}
                            {isCurrentlyApplied && (
                                <button
                                    onClick={handleRemovePromo}
                                    className="px-4 py-1 bg-[#EA5D49] hover:bg-[#D85140] text-white text-sm rounded-full transition-colors flex items-center justify-center">
                                    Hapus
                                </button>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
};

export default PromoCodeInput;
