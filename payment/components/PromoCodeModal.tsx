'use client';

import { Loader2 } from 'lucide-react';
import Modal from 'commons/components/modules/Modal';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useGetAllCouponsQuery } from 'referral/redux/referalApi';
import PromoCodeInput from './PromoCodeInput';

export const PromoCodeModal = ({
    isOpen,
    setOpen
}: ModalBaseProps): JSX.Element => {
    const { packet, appliedPromo, setAppliedPromo } = usePayment();
    const { data: couponsData, isLoading: isLoadingCoupons } =
        useGetAllCouponsQuery({ packet_id: packet?.id }, { skip: !packet?.id });

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    const handleApplyCode = (promo: ValidatePromoResponse): void => {
        setAppliedPromo(promo);
        setOpen(false);
    };

    const handleRemovePromo = (): void => {
        setAppliedPromo(undefined);
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
                    {appliedPromo
                        ? 'Ganti dengan kode lain atau pilih dari kode yang tersedia'
                        : 'Masukkan kode referral dari teman atau kode promo dari Gradient'}
                </p>

                {/* Promo Code Input */}
                <PromoCodeInput
                    placeholder="Masukkan kode referral"
                    onValidPromo={handleApplyCode}
                    showApplyButton={true}
                    variant="modal"
                    className="mb-4"
                    applyAfterValid={false}
                />

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
                        {couponsData.coupons.map((promo) => {
                            const isCurrentlyApplied =
                                appliedPromo?.promo_code === promo.promo_code;

                            return (
                                <div
                                    key={promo.promo_id}
                                    className={`p-4 bg-gradient-to-r border rounded-lg ${
                                        isCurrentlyApplied
                                            ? 'from-green-900/40 to-green-800/40 border-green-500/30'
                                            : 'from-purple-900/40 to-purple-800/40 border-purple-500/30'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-white font-semibold text-sm mb-1">
                                                Diskon{' '}
                                                {promo.discount_amount_original}
                                                {isCurrentlyApplied && (
                                                    <span className="text-green-400 text-xs ml-2">
                                                        (Aktif)
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-gray-400 text-xs">
                                                Valid s.d.{' '}
                                                {formatDate(promo.expired_at)}
                                            </p>
                                        </div>
                                        {isCurrentlyApplied ? (
                                            <button
                                                onClick={handleRemovePromo}
                                                className="px-4 py-2 bg-[#EA5D49] hover:bg-[#D85140] text-white text-sm rounded-full transition-colors flex items-center justify-center">
                                                Hapus
                                            </button>
                                        ) : (
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
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
