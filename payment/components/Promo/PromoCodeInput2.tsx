import { Check, Loader2, Search, X } from 'lucide-react';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useEffect, useState } from 'react';
import { useValidatePromoMutation } from 'referral/redux/referalApi';

const PromoCodeInput = ({
    placeholder,
    className,
    applyAfterValid = false,
    onApply
}: {
    placeholder: string;
    className?: string;
    applyAfterValid?: boolean;
    onApply?: () => void;
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

    const [validate, { data: validationResult }] = useValidatePromoMutation();

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
        if (promoAppliedManually && appliedPromo) {
            setCode(appliedPromo.promo_code!);
            setValidationState('reopen');
            setError(undefined);
        }
    }, [promoAppliedManually, appliedPromo]);

    const handleClick = async (): Promise<void> => {
        if (!code || !packet?.id) return;

        if (validationState === 'idle') {
            setValidationState('loading');
            try {
                const result = await validate({
                    promo_code: code,
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
                    if (applyAfterValid) {
                        setAppliedPromo(result);
                        setPromoAppliedManually(true);
                        setValidationState('reopen');
                        onApply?.();
                    } else {
                        setValidationState('success');
                    }
                } else {
                    setValidationState('error');
                    setError(result.message || 'Kode tidak valid');
                }
            } catch (e) {
                setValidationState('error');
                setError('Gagal memvalidasi kode');
            }
        } else if (validationState === 'success') {
            if (validationResult) {
                if (
                    paymentMethod === 'VOUCHER' &&
                    validationResult.promo_type !== 'OFFLINE VOUCHER'
                ) {
                    setValidationState('error');
                    setError('Kode tidak valid untuk metode voucher');
                    return;
                }

                setAppliedPromo(validationResult);
                setPromoAppliedManually(true);
                if (onApply) {
                    onApply();
                }
            }
        } else if (validationState === 'reopen') {
            setAppliedPromo(undefined);
            setPromoAppliedManually(false);
            setIdle();
        } else if (validationState === 'error') {
            setIdle();
            setCode('');
        }
    };

    const handleChange = (newCode: string): void => {
        if (validationState !== 'idle') {
            setIdle();
        }
        if (appliedPromo && appliedPromo.promo_code === newCode) {
            setValidationState('success');
        }
        setCode(newCode);
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
                return 'bg-transparent border-[#666666]';
        }
    };

    const getButtonStyle = (): string => {
        switch (validationState) {
            case 'success':
            case 'reopen':
                return 'bg-accent-purple rounded-full';
            case 'error':
                return 'bg-transparent rounded-lg';
            case 'loading':
            case 'idle':
            default:
                return 'bg-accent-purple rounded-lg';
        }
    };

    const getInputIcon = (): JSX.Element => {
        switch (validationState) {
            case 'loading':
                return <Loader2 className="w-5 h-5 text-white animate-spin" />;
            case 'success':
                return (
                    <div className="flex items-center space-x-2 px-3 py-1">
                        <div className="flex items-center justify-center w-3 h-3 rounded-full bg-white">
                            <Check className="text-accent-purple" />
                        </div>
                        <span className="text-sm font-body">Pakai</span>
                    </div>
                );
            case 'reopen':
                return (
                    <div className="flex items-center space-x-2 px-3 py-1">
                        <X className="w-4 h-4 text-white font-extrabold" />
                        <span className="text-sm font-body">Batal</span>
                    </div>
                );
            case 'error':
                return <X className="w-h h-5 text-white" />;
            default:
                return <Search className="w-5 h-5 text-white" />;
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
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${getButtonStyle()}`}
                    onClick={handleClick}
                    disabled={validationState === 'loading'}>
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
