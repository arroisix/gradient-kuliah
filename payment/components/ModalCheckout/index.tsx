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
import { useValidatePromoMutation } from 'referral/redux/referalApi';
import { useTracker } from 'tracker/tracker';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import Ticket from 'commons/components/elements/Icons/Ticket';

const ModalCheckout = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(
        null
    );
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

    const tracker = useTracker();
    useEffect(() => {
        if (isOpen) {
            tracker?.genericTrack('Get Payment Confirmation Prompt', {
                'Method Name': paymentMethod
            });
        }
    }, [isOpen]);

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
        }).then((res) => {
            if ('error' in res) return;

            if (res.data.is_valid) {
                tracker?.genericTrack('Enter Promo Code', {
                    'Method Name': paymentMethod,
                    'Promo Code': inputCode
                });
            }
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

    function handleCloseModal(state: boolean): void {
        tracker?.genericTrack('Close Payment Confirmation Prompt', {
            'Method Name': paymentMethod
        });
        setOpen(state);
    }

    function handleSetPhoneNumber(phoneNumber: string): void {
        if (!phoneNumber.match(/^\d{1,14}$/)) {
            setPhoneNumberError('Invalid phone number format');
        } else {
            setPhoneNumberError(null);
        }
        setPhoneNumber(phoneNumber);
    }

    const renderPaymentMethodLogo = () => {
        if (paymentMethod === 'QRIS') {
            return (
                <div className="flex flex-col items-center text-neutral-900">
                    <MdOutlineQrCodeScanner
                        size={20}
                        className="text-accent-purple"
                    />
                    <div className="text-xs">Scan QRIS</div>
                </div>
            );
        }

        if (paymentMethod === 'VOUCHER') {
            return (
                <div className="flex flex-col items-center text-neutral-900">
                    <Ticket color="#5f2bce" size="20" />
                    <div className="text-xs">Kode Voucher</div>
                </div>
            );
        }

        return (
            <div className="h-[20px] w-[65px] relative">
                <Image
                    src={`https://d2uqn6ndx4ow3t.cloudfront.net/assets/payments/${LOGO_PAYMENT[paymentMethod]}`}
                    layout="fill"
                />
            </div>
        );
    };

    return (
        <Modal
            key={paymentMethod}
            isOpen={isOpen}
            setOpen={handleCloseModal}
            variant="dark"
            className="!bg-[#1D1D1D]">
            <div className="flex flex-col w-full mb-4">
                <h1 className="font-extrabold">Konfirmasi Pembayaran</h1>
            </div>
            <div className="flex flex-col w-full mb-4">
                <p className="text-xs font-body text-neutral-400">
                    Metode Pembayaran
                </p>
                <div className="flex justify-between items-center w-full mt-2 p-4 bg-[#242424] rounded-[6px]">
                    <p className="text-base font-bold">
                        {NAME_PAYMENT[paymentMethod]}
                    </p>
                    <div className="rounded-lg h-[50px] w-[100px] bg-white flex items-center justify-center">
                        {renderPaymentMethodLogo()}
                    </div>
                </div>
            </div>
            {paymentMethod === 'ID_OVO' && (
                <div className="flex flex-col w-full mb-4">
                    <p className="text-xs font-body text-neutral-400">
                        Nomor Telepon Yang Terdaftar Pada OVO
                    </p>
                    <div className="flex justify-between items-center gap-3 w-full mt-2 px-4 bg-[#2D2D2D] rounded-[6px]">
                        <div>
                            <span className="text-neutral-400">+62</span>
                        </div>
                        <input
                            type="tel"
                            placeholder="8211234567"
                            required={true}
                            pattern="\+[1-9]\d{10,14}"
                            onChange={(event) =>
                                handleSetPhoneNumber(event.target.value)
                            }
                            className="w-full px-0 py-4 text-xs bg-transparent border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 focus:appearance-none"
                        />
                    </div>
                    {phoneNumberError && (
                        <div className="px-2 pt-2 text-xs font-body text-state-error">
                            {phoneNumberError}
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col w-full mb-4">
                <p className="text-xs font-body text-neutral-400">
                    Pilihan Paket
                </p>
                <div className="flex justify-between items-center gap-4 w-full mt-2 p-4 bg-[#242424] rounded-[6px]">
                    <div>
                        <p className="text-sm font-extrabold">
                            {packet?.packet_name}
                        </p>
                        <p className="text-xs font-body text-neutral-400">
                            {`Langganan hingga `}
                            <span className="inline-block">
                                {moment()
                                    .add(packet?.active_duration, 'd')
                                    .utc(true)
                                    .format('D-MM-YYYY')}
                            </span>
                        </p>
                    </div>
                    <span className="font-extrabold">
                        {formatCurrency(packet?.price as string)}
                    </span>
                </div>
            </div>
            <div className="flex flex-col w-full mb-4">
                <p className="text-xs font-body text-neutral-400">
                    {paymentMethod === 'VOUCHER'
                        ? 'Kode Voucher'
                        : 'Kode Promo/Referral'}
                </p>
                <div className="flex justify-between items-center gap-3 w-full mt-2 px-4 bg-[#2D2D2D] rounded-[6px]">
                    <input
                        type="text"
                        placeholder={
                            paymentMethod === 'VOUCHER'
                                ? 'Masukkan kode yang ada di voucher'
                                : 'Masukkan kode untuk dapat diskon'
                        }
                        value={inputCode}
                        onChange={(event) => setInputCode(event.target.value)}
                        className="w-full px-0 py-4 text-xs bg-transparent border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 focus:appearance-none"
                    />
                    {(loadingValidate || isLoadingValidate) && (
                        <Spinner size="small" />
                    )}
                    <span
                        className="inline-block text-xs cursor-pointer font-body text-accent-purple"
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
            <div className="flex flex-col w-full gap-2 mb-4">
                <p className="text-xs font-body">Ringkasan Belanja</p>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="inline-block text-xs font-body text-neutral-600">
                            Harga Paket
                        </span>
                        <span className="inline-block text-sm font-body text-neutral-600">
                            {formatCurrency(packet?.price as string)}
                        </span>
                    </div>
                    {validateResult?.is_valid && (
                        <div className="flex items-center justify-between">
                            <span className="inline-block text-xs font-body text-neutral-600">
                                Diskon Voucher
                            </span>
                            <span className="inline-block text-sm font-body text-neutral-600">
                                {formatCurrency(
                                    `${validateResult?.discount_amount}`
                                )}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="inline-block text-xs font-body text-neutral-600">
                            Subtotal
                        </span>
                        <span className="inline-block text-sm font-extrabold">
                            {validateResult?.is_valid
                                ? formatCurrency(
                                      `${validateResult?.payment_amount}`
                                  )
                                : formatCurrency(packet?.price as string)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                <CheckoutButton
                    packetId={packet?.id as string}
                    paymentMethod={paymentMethod}
                    promoCode={inputCode}
                    disabled={
                        (paymentMethod === 'VOUCHER' &&
                            (!inputCode ||
                                !!!validateResult?.is_valid ||
                                loadingValidate)) ||
                        (inputCode === ''
                            ? false
                            : validateResult || loadingValidate
                            ? !!!validateResult?.is_valid || loadingValidate
                            : false) ||
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
        </Modal>
    );
};

export default ModalCheckout;
