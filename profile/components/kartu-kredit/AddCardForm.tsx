import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Script from 'next/script';
import { HiShieldCheck } from 'react-icons/hi';
import Link from 'next/link';
import CardProtectionModal from './modals/CardProtectionModal';
import CVVInfoModal from './modals/CVVInfoModal';
import ConfirmAddCardModal from './modals/ConfirmAddCardModal';
import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Field, Formik } from 'formik';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { useDebouncedCallback } from 'use-debounce';
import {
    useAddUserCardMutation,
    useLazyCheckUserCardNameAvailabilityQuery
} from 'payment/redux/api/transactionApi';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import moment from 'moment';

const MAX_NAME_LENGTH = 20;

declare global {
    interface Window {
        Xendit: any;
    }
}

const AddCardForm = (): JSX.Element => {
    const router = useRouter();
    const redirectUrl =
        (router.query.redirect as string) || '/profil/kartu-kredit';
    const fromCheckout = Boolean(router.query.redirect);
    const [showProtectionModal, setShowProtectionModal] = useState(false);
    const [showCVVModal, setShowCVVModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isNameAvailable, setIsNameAvailable] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [cardData, setCardData] = useState<any>();
    const [isXenditReady, setIsXenditReady] = useState(false);

    const [saveUserCard, { isLoading: isSaving, isSuccess: successSaving }] =
        useAddUserCardMutation();

    const [triggerCheckName, { isFetching: isCheckingName }] =
        useLazyCheckUserCardNameAvailabilityQuery();

    useEffect(() => {
        const success = async (): Promise<void> => {
            if (successSaving) {
                await router.push(redirectUrl);
                toast.success('Berhasil menghubungkan kartu kredit/debit!', {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                });
            }
        };
        success();
    }, [successSaving, router, redirectUrl]);

    const handleXenditLoad = (): void => {
        if (window.Xendit) {
            window.Xendit.setPublishableKey(
                process.env.NEXT_PUBLIC_XENDIT_KEY as string
            );
            setIsXenditReady(true);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Xendit && !isXenditReady) {
            handleXenditLoad();
        }
    }, [isXenditReady]);

    const debouncedCheckName = useDebouncedCallback(
        async (
            value: string,
            setFieldError: (f: string, msg?: string) => void
        ) => {
            if (!value.trim()) return;
            const available = await triggerCheckName({
                card_name: value
            }).unwrap();
            setIsNameAvailable(available);
            setIsTyping(false);
            if (available) {
                setFieldError('cardName', undefined);
            } else {
                setFieldError('cardName', 'Label kartu sudah pernah digunakan');
            }
        },
        1000
    );

    const NameIcon =
        isCheckingName || isTyping
            ? FaSpinner
            : isNameAvailable
            ? FaCheckCircle
            : FaTimesCircle;
    const nameIconClass =
        isCheckingName || isTyping
            ? 'animate-spin text-gray-400'
            : isNameAvailable
            ? 'text-green-500'
            : 'text-red-500';

    return (
        <>
            <Script
                src="https://js.xendit.co/v1/xendit.min.js"
                strategy="afterInteractive"
                onLoad={handleXenditLoad}
            />

            <div className="flex flex-col items-center w-full max-h-[75vh] overflow-y-auto">
                <div className="p-4 space-y-4">
                    <div className="mb-8 flex items-center gap-x-3 bg-[#03AC5C]/10 p-4 rounded-lg text-green-400">
                        <HiShieldCheck
                            size={20}
                            className="w-5 h-5 flex-shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                            <span className="font-medium">
                                Detail Kartumu Terlindungi
                            </span>
                            <p className="text-sm text-green-200">
                                CVV tidak disimpan, akan diminta setiap
                                transaksi
                            </p>
                        </div>
                        <button
                            onClick={() => setShowProtectionModal(true)}
                            className="p-1 flex-shrink-0 rounded hover:bg-green-800 transition-colors">
                            <Info className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <div className="h-5 w-5 bg-white rounded flex items-center justify-center p-[2px] overflow-hidden">
                            <Image
                                src={`${CDN_URL}/assets/payments/mastercard.png`}
                                width={20}
                                height={12}
                            />
                        </div>
                        <div className="h-5 w-5 bg-white rounded flex items-center justify-center p-[2px] overflow-hidden">
                            <Image
                                src={`${CDN_URL}/assets/payments/visa.png`}
                                width={20}
                                height={8}
                            />
                        </div>
                        <div className="h-5 w-5 bg-white rounded flex items-center justify-center p-[2px] overflow-hidden">
                            <Image
                                src={`${CDN_URL}/assets/payments/amex.png`}
                                width={20}
                                height={20}
                            />
                        </div>
                        <div className="h-5 w-5 bg-white rounded flex items-center justify-center p-[2px] overflow-hidden">
                            <Image
                                src={`${CDN_URL}/assets/payments/jcb.png`}
                                width={20}
                                height={20}
                            />
                        </div>
                    </div>

                    <Formik
                        initialValues={{
                            cardName: '',
                            cardNumber: '',
                            cardExp: '',
                            cardCVV: '',
                            cardHolderFirstName: '',
                            cardHolderLastName: '',
                            cardHolderEmail: '',
                            cardHolderPhoneNumber: '',
                            saveCard: false
                        }}
                        validate={(values) => {
                            const errors: Record<string, string> = {};

                            // card name
                            console.log({ isNameAvailable });
                            if (!values.cardName.trim()) {
                                errors.cardName = 'Label kartu wajib diisi';
                            } else if (
                                values.cardName.length > MAX_NAME_LENGTH
                            ) {
                                errors.cardName = `Maksimal ${MAX_NAME_LENGTH} karakter`;
                            } else if (!isTyping && !isNameAvailable) {
                                errors.cardName =
                                    'Label kartu sudah pernah digunakan';
                            }

                            // card num
                            const rawNum = values.cardNumber.replace(
                                /\s+/g,
                                ''
                            );
                            if (!rawNum)
                                errors.cardNumber = 'Nomor kartu wajib diisi';
                            else if (
                                rawNum.length < 12 ||
                                !window.Xendit.card.validateCardNumber(rawNum)
                            )
                                errors.cardNumber = 'Nomor kartu tidak valid';

                            // expiry
                            const [mm, yy] = values.cardExp.split('/');
                            if (!mm || !yy)
                                errors.cardExp =
                                    'Tanggal kedaluwarsa wajib diisi';
                            else if (
                                yy.length < 2 ||
                                !window.Xendit.card.validateExpiry(
                                    mm,
                                    `20${yy}`
                                )
                            )
                                errors.cardExp =
                                    'Tanggal kedaluwarsa tidak valid';

                            // cvv
                            if (!values.cardCVV)
                                errors.cardCVV = 'CVV wajib diisi';
                            else if (
                                values.cardCVV.length < 3 ||
                                !window.Xendit.card.validateCvn(values.cardCVV)
                            )
                                errors.cardCVV = 'CVV tidak valid';

                            if (!values.cardHolderPhoneNumber) {
                                errors.cardHolderPhoneNumber =
                                    'Nomor handphone tidak boleh kosong';
                            } else if (
                                !values.cardHolderPhoneNumber.match(
                                    /^\d{1,14}$/
                                )
                            ) {
                                errors.cardHolderPhoneNumber =
                                    'Masukkan nomor handphone yang valid';
                            }

                            return errors;
                        }}
                        validateOnChange
                        validateOnBlur
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            try {
                                const [mm, yyPart] = values.cardExp.split('/');
                                const year =
                                    yyPart.length === 2
                                        ? `20${yyPart}`
                                        : yyPart;
                                const rawNumber = values.cardNumber.replace(
                                    /\s+/g,
                                    ''
                                );
                                const token: any = await new Promise(
                                    (res, rej) =>
                                        window.Xendit.card.createToken(
                                            {
                                                card_number: rawNumber,
                                                card_exp_month: mm,
                                                card_exp_year: year,
                                                card_cvn: values.cardCVV,
                                                card_holder_first_name:
                                                    values.cardHolderFirstName,
                                                card_holder_last_name:
                                                    values.cardHolderLastName,
                                                card_holder_email:
                                                    values.cardHolderEmail,
                                                card_holder_phone_number: `+62${values.cardHolderPhoneNumber}`,
                                                is_multiple_use: true
                                            },
                                            (err: any, r: any) =>
                                                err ? rej(err) : res(r)
                                        )
                                );
                                if (token.status === 'FAILED')
                                    throw new Error(
                                        token.failure_reason ||
                                            'Tokenisasi gagal'
                                    );

                                if (fromCheckout && !values.saveCard) {
                                    localStorage.setItem(
                                        'tempCard',
                                        JSON.stringify({
                                            id: 'temp_card',
                                            name: 'Temporary Card',
                                            brand: token.card_info.brand,
                                            card_token: token.id,
                                            needs_refresh: false,
                                            created_at: moment().toISOString(),
                                            updated_at: moment().toISOString()
                                        })
                                    );
                                    router.push(redirectUrl);
                                    return;
                                }

                                setCardData({
                                    ...token,
                                    cardName: values.cardName
                                });
                                setShowConfirmationModal(true);
                            } catch (err: any) {
                                toast.error(err.message, {
                                    position: 'top-center',
                                    theme: 'colored',
                                    toastId: 'XENDIT_ERROR'
                                });
                            } finally {
                                setSubmitting(false);
                            }
                        }}>
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            setFieldError,
                            isSubmitting,
                            isValid,
                            isValidating
                        }) => (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col space-y-4">
                                    <h2 className="font-bold text-md">
                                        Rincian Kartu
                                    </h2>
                                    <div className="flex flex-col items-stretch space-y-2">
                                        <Input
                                            type="text"
                                            label="Label Kartu"
                                            name="cardName"
                                            placeholder="Contoh: Kartu Utama, Kartu Ibu"
                                            onBlur={handleBlur}
                                            value={values.cardName}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setIsNameAvailable(false);
                                                setIsTyping(true);
                                                debouncedCheckName(
                                                    e.target.value,
                                                    setFieldError
                                                );
                                            }}
                                            error={
                                                touched.cardName &&
                                                errors.cardName
                                                    ? errors.cardName
                                                    : undefined
                                            }
                                            endAddorment={
                                                values.cardName !== '' ? (
                                                    <NameIcon
                                                        className={
                                                            nameIconClass
                                                        }
                                                    />
                                                ) : undefined
                                            }
                                        />
                                        <div className="flex space-x-2">
                                            <Info className="w-4 h-4 text-neutral-400" />
                                            <span className="text-xs text-neutral-400 flex-1">
                                                Isi apa saja untuk bantu kamu
                                                mengenali kartu
                                            </span>
                                        </div>
                                    </div>

                                    <Input
                                        type="text"
                                        label="Nomor Kartu"
                                        name="cardNumber"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        value={values.cardNumber}
                                        onChange={(e) => {
                                            const digits =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ''
                                                );
                                            setFieldValue(
                                                'cardNumber',
                                                digits
                                                    .match(/.{1,4}/g)
                                                    ?.join(' ') ?? digits
                                            );
                                        }}
                                        onBlur={handleBlur}
                                        error={
                                            touched.cardNumber &&
                                            errors.cardNumber
                                                ? errors.cardNumber
                                                : undefined
                                        }
                                    />

                                    <div className="flex space-x-4">
                                        <Input
                                            type="text"
                                            label="Tanggal Kedaluwarsa"
                                            name="cardExp"
                                            placeholder="MM/YY"
                                            value={values.cardExp}
                                            onChange={(e) => {
                                                const raw = e.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 4);
                                                const formatted =
                                                    raw.length > 2
                                                        ? `${raw.slice(
                                                              0,
                                                              2
                                                          )}/${raw.slice(2)}`
                                                        : raw;
                                                setFieldValue(
                                                    'cardExp',
                                                    formatted
                                                );
                                            }}
                                            onBlur={handleBlur}
                                            error={
                                                touched.cardExp &&
                                                errors.cardExp
                                                    ? errors.cardExp
                                                    : undefined
                                            }
                                        />

                                        <Input
                                            type="text"
                                            label="CVV"
                                            name="cardCVV"
                                            placeholder="XXX"
                                            value={values.cardCVV}
                                            onChange={(e) => {
                                                const digits = e.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 4);
                                                setFieldValue(
                                                    'cardCVV',
                                                    digits
                                                );
                                            }}
                                            onBlur={handleBlur}
                                            error={
                                                touched.cardCVV &&
                                                errors.cardCVV
                                                    ? errors.cardCVV
                                                    : undefined
                                            }
                                            endAddorment={
                                                <Info
                                                    className="w-4 h-4 cursor-pointer"
                                                    onClick={() =>
                                                        setShowCVVModal(true)
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-4">
                                    <h2 className="font-bold text-md">
                                        Identitas Pemilik Kartu
                                    </h2>
                                    <div className="flex space-x-4">
                                        <Input
                                            type="text"
                                            label="Nama Depan"
                                            name="cardHolderFirstName"
                                            placeholder="Nama Depan"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.cardHolderFirstName}
                                            error={
                                                touched.cardHolderFirstName &&
                                                errors.cardHolderFirstName
                                                    ? errors.cardHolderFirstName
                                                    : undefined
                                            }
                                        />

                                        <Input
                                            type="text"
                                            label="Nama Belakang"
                                            name="cardHolderLastName"
                                            placeholder="Nama Belakang"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.cardHolderLastName}
                                            error={
                                                touched.cardHolderLastName &&
                                                errors.cardHolderLastName
                                                    ? errors.cardHolderLastName
                                                    : undefined
                                            }
                                        />
                                    </div>

                                    <Input
                                        type="email"
                                        label="Email"
                                        name="cardHolderEmail"
                                        placeholder="Email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.cardHolderEmail}
                                        error={
                                            touched.cardHolderEmail &&
                                            errors.cardHolderEmail
                                                ? errors.cardHolderEmail
                                                : undefined
                                        }
                                    />

                                    <Input
                                        type="tel"
                                        label="Nomor Handphone"
                                        placeholder="8211234567"
                                        name="cardHolderPhoneNumber"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        startAddorment={
                                            <span className="text-neutral-400">
                                                +62
                                            </span>
                                        }
                                        error={
                                            touched.cardHolderPhoneNumber &&
                                            errors.cardHolderPhoneNumber
                                                ? errors.cardHolderPhoneNumber
                                                : undefined
                                        }
                                    />
                                </div>
                                {fromCheckout && (
                                    <div className="flex items-center space-x-2">
                                        <Field
                                            type="checkbox"
                                            name="saveCard"
                                            className="rounded-md text-accent-purple"
                                        />
                                        <span className="font-body text-white text-sm">
                                            Simpan kartu untuk pembayaran
                                            berikutnya
                                        </span>
                                    </div>
                                )}

                                <p className="text-xs text-center">
                                    Dengan konfirmasi, Anda menyetujui{' '}
                                    <Link
                                        className="font-bold text-[#7264EB] underline cursor-pointer hover:text-[#7264EB]/75 transition-all duration-500"
                                        href={'/syarat-dan-ketentuan'}>
                                        Syarat &amp; Ketentuan
                                    </Link>{' '}
                                    dan{' '}
                                    <Link
                                        className="font-bold text-[#7264EB] underline cursor-pointer hover:text-[#7264EB]/75 transition-all duration-500"
                                        href={'/kebijakan-privasi'}>
                                        Kebijakan Privasi
                                    </Link>{' '}
                                    Gradient
                                </p>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    disabled={
                                        isValidating || !isValid || isSubmitting
                                    }>
                                    {isSubmitting || isSaving
                                        ? 'Menyimpan...'
                                        : 'Konfirmasi'}
                                </Button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
            <CardProtectionModal
                isOpen={showProtectionModal}
                setOpen={setShowProtectionModal}
            />
            <CVVInfoModal isOpen={showCVVModal} setOpen={setShowCVVModal} />
            <ConfirmAddCardModal
                isOpen={showConfirmationModal}
                setOpen={setShowConfirmationModal}
                disabled={isSaving}
                onConfirm={async () => {
                    if (cardData) {
                        await saveUserCard({
                            name: cardData.cardName,
                            brand: cardData.card_info.brand,
                            card_token: cardData.id
                        });
                    }
                }}
            />
        </>
    );
};

export default AddCardForm;
