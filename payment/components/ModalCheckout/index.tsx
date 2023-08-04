import moment from 'moment';
import Image from 'next/image';
import { BsShieldFillCheck } from 'react-icons/bs';
import Modal from 'commons/components/modules/Modal';
import { formatCurrency } from 'commons/utils';
import { usePayment } from 'payment/contexts/PaymentProvider';
import CheckoutButton from '../CheckoutButton';
import { LOGO_PAYMENT, NAME_PAYMENT } from '../constant';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import Spinner from 'commons/components/elements/Spinner';
import { useValidatePromoMutation } from 'referal/redux/referalApi';

const ModalCheckout = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    const [inputCode, setInputCode] = useState('');
    const [loadingValidate, setLoadingValidate] = useState(false);

    const { packet, paymentMethod } = usePayment();
    const [validate, { data: validateResult, isLoading: isLoadingValidate }] =
        useValidatePromoMutation();
    const activePacket = new Date();
    activePacket.setDate(
        packet?.active_duration
            ? activePacket.getDate() + packet?.active_duration
            : 0
    );

    useEffect(() => {
        let getData: NodeJS.Timeout;

        if (inputCode !== '') {
            setLoadingValidate(true);
            getData = setTimeout(() => {
                handleCheckPromo();
            }, 1000);
        }

        return () => clearTimeout(getData);
    }, [inputCode]);

    function handleCheckPromo(): void {
        validate({
            promo_code: inputCode,
            packet_id: packet?.id as string
        });

        setLoadingValidate(false);
    }

    async function handlePaste(): Promise<void> {
        try {
            const text = await navigator.clipboard.readText();
            setInputCode(text);
        } catch (error) {
            toast.error('Failed to paste', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true,
                toastId: 'PASTE_FAILED'
            });
        }
    }

    return (
        <Modal
            isOpen={isOpen ? 1 : 0}
            setOpen={() => setOpen(0)}
            variant="dark"
            className="!bg-[#1D1D1D]">
            <div className="w-full flex flex-col mb-4">
                <h1 className="font-extrabold">Konfirmasi Pembayaran</h1>
            </div>
            <div className="w-full flex flex-col mb-4">
                <p className="font-body text-xs text-neutral-400">
                    METODE PEMBAYARAN
                </p>
                <div className="flex justify-between items-center w-full mt-2 p-4 bg-[#242424] rounded-[6px]">
                    <p className="text-base font-bold">
                        {NAME_PAYMENT[paymentMethod]}
                    </p>
                    <div className="rounded-lg h-[50px] w-[100px] bg-white flex items-center justify-center">
                        <div className="h-[20px] w-[65px] relative">
                            <Image
                                src={`https://d2uqn6ndx4ow3t.cloudfront.net/assets/payments/${LOGO_PAYMENT[paymentMethod]}`}
                                layout="fill"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col mb-4">
                <p className="font-body text-xs text-neutral-400">
                    Pilihan Paket
                </p>
                <div className="flex justify-between items-center gap-4 w-full mt-2 p-4 bg-[#242424] rounded-[6px]">
                    <div>
                        <span className="inline-block font-extrabold text-sm">
                            {packet?.packet_name}
                        </span>
                        <span className="inline-block font-body text-neutral-400 text-xs">
                            {`Langganan hingga `}
                            <span className="inline-block">
                                {moment()
                                    .add(packet?.active_duration, 'd')
                                    .utc()
                                    .format('D-MM-YYYY')}
                            </span>
                        </span>
                    </div>
                    <span className="font-extrabold">
                        {formatCurrency(packet?.price as string)}
                    </span>
                </div>
            </div>
            <div className="w-full flex flex-col mb-4">
                <p className="font-body text-xs text-neutral-400">
                    Kode Voucher
                </p>
                <div className="flex justify-between items-center gap-3 w-full mt-2 px-4 bg-[#2D2D2D] rounded-[6px]">
                    <input
                        type="text"
                        placeholder="Masukan kode voucher"
                        value={inputCode}
                        onChange={(event) => setInputCode(event.target.value)}
                        className="w-full text-xs px-0 py-4 bg-transparent border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 focus:appearance-none"
                    />
                    {(loadingValidate || isLoadingValidate) && (
                        <Spinner size="small" />
                    )}
                    <span
                        className="inline-block font-body text-accent-purple text-xs cursor-pointer"
                        onClick={handlePaste}
                        aria-hidden>
                        TEMPEL
                    </span>
                </div>
                {!!validateResult &&
                    !!inputCode &&
                    !loadingValidate &&
                    !isLoadingValidate && (
                        <div
                            className={`font-body text-xs px-2 pt-2 ${
                                validateResult.is_valid
                                    ? 'text-state-success'
                                    : 'text-state-error'
                            }`}>
                            {validateResult.message}
                        </div>
                    )}
            </div>
            <div className="w-full flex flex-col gap-2 mb-4">
                <p className="font-body text-xs">Ringkasan Belanja</p>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className="inline-block font-body text-neutral-600 text-xs">
                            Harga Paket
                        </span>
                        <span className="inline-block font-body text-neutral-600 text-sm">
                            {formatCurrency(packet?.price as string)}
                        </span>
                    </div>
                    {validateResult?.is_valid && (
                        <div className="flex justify-between items-center">
                            <span className="inline-block font-body text-neutral-600 text-xs">
                                Diskon Voucher
                            </span>
                            <span className="inline-block font-body text-neutral-600 text-sm">
                                {formatCurrency(
                                    `${validateResult?.discount_amount}`
                                )}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="inline-block font-body text-neutral-600 text-xs">
                            Subtotal
                        </span>
                        <span className="inline-block font-extrabold text-sm">
                            {validateResult?.is_valid
                                ? formatCurrency(
                                      `${validateResult?.payment_amount}`
                                  )
                                : formatCurrency(packet?.price as string)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <CheckoutButton
                    packetId={packet?.id as string}
                    paymentMethod={paymentMethod}
                    promoCode={inputCode}
                    disabled={
                        validateResult && inputCode !== ''
                            ? !!!validateResult?.is_valid
                            : false
                    }
                />
                <span className="flex items-center text-xs mt-2">
                    <BsShieldFillCheck className="mr-2" />
                    Secure Payment
                </span>
            </div>
        </Modal>
    );
};

export default ModalCheckout;
