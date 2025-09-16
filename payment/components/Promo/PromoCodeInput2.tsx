import { Loader2, Search, X } from 'lucide-react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useEffect, useState, useCallback } from 'react';
import { useValidatePromoMutation } from 'referral/redux/referalApi';
import { useDebounce } from 'commons/hooks/useDebounce';

const PromoCodeInput = ({
    placeholder,
    className,
    applyAfterValid = false,
    onApply,
    bgTransparent = true
}: {
    placeholder: string;
    className?: string;
    applyAfterValid?: boolean;
    onApply?: () => void;
    bgTransparent?: boolean;
}): JSX.Element => {
    const {
        packet,
        appliedPromo,
        setAppliedPromo,
        promoAppliedManually,
        setPromoAppliedManually,
        paymentMethod
    } = usePayment();
    const initialCode = promoAppliedManually
        ? appliedPromo?.promo_code ?? ''
        : '';
    const initialState =
        promoAppliedManually && appliedPromo ? 'reopen' : 'idle';
    const [code, setCode] = useState<string>(initialCode);
    const [validationState, setValidationState] = useState<
        'idle' | 'loading' | 'success' | 'error' | 'reopen'
    >(initialState);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isManuallyClearing, setIsManuallyClearing] = useState(false);
    const [validate] = useValidatePromoMutation();
    const debouncedCode = useDebounce(code, 1000);

    const validatePromoCode = useCallback(async (promoCode: string) => {
        if (!promoCode || !packet?.id) return;

        setValidationState('loading');
        try {
            const result = await validate({
                promo_code: promoCode,
                packet_id: packet.id
            }).unwrap();

            if (
                paymentMethod === 'VOUCHER' &&
                result.promo_type !== 'OFFLINE VOUCHER'
            ) {
                setValidationState('error');
                setError('Kode tidak valid untuk metode voucher');
                return;
            }

            if (result.is_valid) {
                setAppliedPromo(result);
                setPromoAppliedManually(true);
                setValidationState('reopen');
                onApply?.();
            } else {
                setValidationState('error');
                setError(result.message || 'Promo code does not exist');
            }
        } catch (e) {
            setValidationState('error');
            setError('Gagal memvalidasi kode');
        }
    }, [packet?.id, paymentMethod, validate, setAppliedPromo, setPromoAppliedManually, onApply]);

    // reset local code when the user manually un‐applies the promo
    useEffect(() => {
        if (!promoAppliedManually) {
            setCode(''); // clear the textbox
            setValidationState('idle'); // back to idle state
            setError(undefined); // clear any error
        }
    }, [promoAppliedManually]);

    // when they apply a promo manually elsewhere, reflect it inline too
    useEffect(() => {
        if (promoAppliedManually && appliedPromo && !isManuallyClearing) {
            setCode(appliedPromo.promo_code!);
            setValidationState('reopen');
            setError(undefined);
        }
    }, [promoAppliedManually, appliedPromo, isManuallyClearing]);

    useEffect(() => {
        if (debouncedCode && validationState === 'idle' && debouncedCode === code) {
            validatePromoCode(debouncedCode);
        }
    }, [debouncedCode, validationState, validatePromoCode, code]);

    const handleClick = async (): Promise<void> => {
        if (validationState === 'reopen') {
            setIsManuallyClearing(true);
            setCode('');
            setIdle();
            setAppliedPromo(undefined);
            setPromoAppliedManually(false);
            setTimeout(() => setIsManuallyClearing(false), 100);
        } else if (validationState === 'error') {
            setIdle();
            setCode('');
        }
    };

    const handleChange = (newCode: string): void => {
        if (newCode === '') {
            setCode(newCode);
            if (validationState !== 'idle') {
                setIdle();
            }
            if (error) {
                setError(undefined);
            }
            if (appliedPromo && promoAppliedManually) {
                setAppliedPromo(undefined);
                setPromoAppliedManually(false);
            }
            return;
        }
        
        if (validationState === 'error' || validationState === 'success' || validationState === 'reopen') {
            setIdle();
        }
        
        setCode(newCode);
        
        if (error) {
            setError(undefined);
        }
    };

    const setIdle = (): void => {
        setValidationState('idle');
        setError('');
    };

    const getInputStyle = (): string => {
        switch (validationState) {
            case 'success':
            case 'reopen':
                return 'bg-[#03AC5C]/10 border-[#03AC5C]/10';
            case 'error':
                return 'bg-[#FF3B30]/10 border-[#FF3B30]/10';
            case 'loading':
            case 'idle':
            default:
                if (bgTransparent) {
                    return 'bg-transparent border-[#666666]';
                } else {
                    return 'bg-[#222222] border-transparent';
                }
        }
    };

    const getButtonStyle = (): string => {
        switch (validationState) {
            case 'reopen':
                return 'bg-accent-purple rounded-full';
            case 'error':
                return 'bg-transparent rounded-lg';
            case 'loading':
            case 'idle':
            default:
                return 'bg-transparent';
        }
    };

    const getInputIcon = (): JSX.Element => {
        switch (validationState) {
            case 'loading':
                return <Loader2 className="w-5 h-5 text-white animate-spin" />;
            case 'reopen':
                return (
                    <div className="flex items-center space-x-2 px-3 py-1">
                        <X className="w-4 h-4 text-white font-extrabold" />
                        <span className="text-sm font-body">Batal</span>
                    </div>
                );
            case 'error':
                return <X className="w-5 h-5 text-white" />;
            default:
                return <Search className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            {/* Input Field */}
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={code}
                    onChange={(e) => handleChange(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-purple-500 transition-colors ${getInputStyle()}`}
                />
                <button
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${getButtonStyle()} ${
                        validationState === 'reopen' || validationState === 'error' 
                            ? 'cursor-pointer' 
                            : 'cursor-default'
                    }`}
                    onClick={handleClick}
                    disabled={validationState === 'loading' || (validationState !== 'reopen' && validationState !== 'error')}>
                    {getInputIcon()}
                </button>
            </div>
            {error && (
                <span className="font-body text-sm text-[#FF3B30]">
                    {error}
                </span>
            )}
        </div>
    );
};

export default PromoCodeInput;
