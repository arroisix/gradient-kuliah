'use client';

import { useState, useEffect } from 'react';
import { Search, X, Check, Loader2 } from 'lucide-react';
import Modal from 'commons/components/modules/Modal';
import { usePayment } from 'payment/contexts/PaymentProvider';
import {
    useGetAllCouponsQuery,
    useValidatePromoMutation
} from 'referral/redux/referalApi';

export const PromoCodeModal = ({
    isOpen,
    setOpen
}: ModalBaseProps): JSX.Element => {
    const { packet, setAppliedPromo } = usePayment();
    const [inputCode, setInputCode] = useState<string>('');
    const [validationState, setValidationState] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    const [validate, { data: validationResult }] = useValidatePromoMutation();
    const { data: couponsData, isLoading: isLoadingCoupons } =
        useGetAllCouponsQuery({ packet_id: packet?.id }, { skip: !packet?.id });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (inputCode && inputCode.length > 0) {
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
    }, [inputCode]);

    const handleValidateCode = async (code: string) => {
        try {
            const result = await validate({
                promo_code: code,
                packet_id: packet?.id as string
            }).unwrap();

            if (result.is_valid) {
                setValidationState('success');
                setShowError(false);
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
        setOpen(false);
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
                return <Search className="w-5 h-5 text-purple-500" />;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            className="!bg-[#1D1D1D] !max-w-md">
            <div className="flex flex-col w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">
                        Kode Promo/Referral
                    </h2>
                </div>

                {/* Subtitle */}
                <p className="text-sm text-gray-400 mb-6">
                    Masukkan kode referral dari teman atau kode promo dari
                    Gradient
                </p>

                {/* Input Field */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Masukkan kode referral"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-[#2D2D2D] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getInputIcon()}
                    </div>
                </div>

                {/* Error Message */}
                {showError && errorMessage && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center justify-between">
                        <span className="text-red-400 text-sm">
                            {errorMessage}
                        </span>
                        <button
                            onClick={handleCloseError}
                            className="text-red-400 hover:text-red-300 transition-colors ml-2">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Success State for Current Input */}
                {validationState === 'success' && validationResult && (
                    <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <Check className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-green-400 text-sm font-medium">
                                {inputCode}
                            </span>
                        </div>
                        <button
                            onClick={() => handleApplyCode(validationResult)}
                            className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full transition-colors">
                            Pakai
                        </button>
                    </div>
                )}

                {/* Available Promo Codes */}
                {isLoadingCoupons ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        <span className="text-gray-400 text-sm ml-2">
                            Loading promo codes...
                        </span>
                    </div>
                ) : couponsData?.coupons && couponsData.coupons.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {couponsData.coupons.map((promo) => (
                            <div
                                key={promo.promo_id}
                                className="p-4 bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-500/30 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-semibold text-sm mb-1">
                                            Diskon{' '}
                                            {promo.discount_amount_original}
                                        </h3>
                                        <p className="text-gray-400 text-xs">
                                            Valid s.d.{' '}
                                            {formatDate(promo.expired_at)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleApplyCode({
                                                ...promo,
                                                is_valid: true,
                                                message: ''
                                            })
                                        }
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full transition-colors">
                                        Pakai
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                        No promo codes available
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PromoCodeModal;
