'use client';

import { Loader2, X } from 'lucide-react';
import Modal from 'commons/components/modules/Modal';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useGetAllCouponsQuery } from 'referral/redux/referalApi';
import PromoCodeInput from './PromoCodeInput2';
import { toast } from 'react-toastify';

export const PromoCodeModal = ({
    isOpen,
    setOpen
}: ModalBaseProps): JSX.Element => {
    const {
        packet,
        appliedPromo,
        setAppliedPromo,
        promoAppliedManually,
        setPromoAppliedManually,
        paymentMethod
    } = usePayment();

    const packetId = packet?.id ?? '';
    const { data: couponsData, isLoading: isLoadingCoupons } =
        useGetAllCouponsQuery({ packet_id: packetId }, { skip: !packetId });

    // if there’s an applied promo, pull it up to the front
    const coupons = couponsData?.coupons ?? [];
    const sortedCoupons = appliedPromo
        ? [
              // first the matching coupon
              ...coupons.filter(
                  (c) => c.promo_code === appliedPromo.promo_code
              ),
              // then the rest
              ...coupons.filter((c) => c.promo_code !== appliedPromo.promo_code)
          ]
        : coupons;

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
        if (
            paymentMethod === 'VOUCHER' &&
            promo.promo_type != 'OFFLINE VOUCHER'
        ) {
            toast.error(
                'Kode promo tidak valid untuk metode pembayaran voucher',
                {
                    position: 'top-center',
                    theme: 'colored',
                    toastId: 'INVALID_VOUCHER'
                }
            );
            return;
        }
        setAppliedPromo(promo);
        setPromoAppliedManually(false);
        setOpen(false);
    };

    const handleRemovePromo = (): void => {
        setAppliedPromo(undefined);
        setPromoAppliedManually(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            className="!bg-[#222222] w-full rounded-lg">
            <div className="flex flex-col w-full space-y-4">
                {/* Header */}
                <h2 className="text-lg font-bold text-white font-body">
                    Kode Promo/Referral
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-white font-body">
                    {appliedPromo
                        ? 'Ganti dengan kode lain atau pilih dari kode yang tersedia'
                        : 'Masukkan kode referral dari teman atau kode promo dari Gradient'}
                </p>

                {/* Promo Code Input */}
                {/* <PromoCodeInput
                    placeholder="Masukkan kode referral"
                    onValidPromo={handleApplyCode}
                    showApplyButton={true}
                    variant="modal"
                    applyAfterValid={false}
                /> */}

                <PromoCodeInput
                    placeholder="Masukkan kode promo/referral"
                    onApply={() => setOpen(false)}
                />

                {/* Available Promo Codes */}
                {isLoadingCoupons ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        <span className="text-gray-400 text-sm ml-2">
                            Loading promo codes...
                        </span>
                    </div>
                ) : sortedCoupons && sortedCoupons.length > 0 ? (
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                        {sortedCoupons.map((promo) => {
                            const isCurrentlyAppliedInList =
                                !promoAppliedManually &&
                                appliedPromo?.promo_code === promo.promo_code;

                            return (
                                <div
                                    key={promo.promo_id}
                                    className={`p-4 rounded-lg ${
                                        isCurrentlyAppliedInList
                                            ? 'bg-[#03AC5C]/10'
                                            : 'bg-[#2A225F]'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-white font-semibold text-sm mb-1 font-body">
                                                Diskon{' '}
                                                {promo.discount_amount_original}
                                            </h3>
                                            <p className="text-[#B6A6F3] text-xs font-body">
                                                Valid s.d.{' '}
                                                {formatDate(promo.expired_at)}
                                            </p>
                                        </div>
                                        {isCurrentlyAppliedInList ? (
                                            <button
                                                onClick={handleRemovePromo}
                                                className="w-24 h-10 bg-accent-purple text-white text-sm rounded-full font-body flex items-center justify-center">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-2">
                                                        <X className="w-4 h-4 text-white font-extrabold" />
                                                        <span className="text-sm font-body">
                                                            Batal
                                                        </span>
                                                    </div>
                                                </div>
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
                                                className="w-24 h-10 bg-accent-purple text-white text-sm rounded-full font-body">
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
