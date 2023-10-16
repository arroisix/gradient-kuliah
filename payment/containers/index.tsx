import FreeBox from 'payment/components/FreeBox';
import FreeModalCheckout from 'payment/components/ModalCheckout/freeModal';
import OtherPaymentBox from 'payment/components/OtherPayment';
import ModalCheckout from '../components/ModalCheckout';
import { AiFillBank, AiFillShop, AiOutlineMobile } from 'react-icons/ai';
import { usePayment } from '../contexts/PaymentProvider';
import { useEffect, useRef } from 'react';
import MethodListBox from '../components/MethodListBox';
import MethodBox from 'payment/components/MethodBox';
import { MdOutlineQrCodeScanner } from 'react-icons/md';

const SubscriptionContainer = (): JSX.Element => {
    const otherPaymentMethodRef = useRef<HTMLDivElement>(null);
    const { isModalCheckoutOpen, setModalCheckoutOpen, packet } = usePayment();

    useEffect(() => {
        localStorage.removeItem('packetId');
    }, []);

    const scrollToOtherPayment = (): void => {
        otherPaymentMethodRef.current?.scrollIntoView({
            inline: 'center',
            behavior: 'smooth'
        });
    };

    return (
        <section className="min-h-screen pt-24 px-4 md:px-[7.5rem]">
            <h1 className="text-3xl font-bold md:text-5xl">
                Pilih metode pembayaran
            </h1>
            <div className="flex flex-col gap-4 mt-6 md:gap-6">
                {packet?.is_free ? (
                    <FreeBox />
                ) : (
                    <>
                        <MethodListBox
                            title="E-Wallet / QRIS"
                            icon={
                                <AiOutlineMobile className="mr-2 text-base" />
                            }>
                            <MethodBox paymentMethod="QRIS">
                                <div className="flex flex-col items-center text-neutral-900">
                                    <MdOutlineQrCodeScanner
                                        size={24}
                                        className="text-accent-purple"
                                    />
                                    <div className="text-sm">Scan QRIS</div>
                                </div>
                            </MethodBox>
                            <MethodBox paymentMethod="GOPAY" />
                            <MethodBox paymentMethod="ID_DANA" />
                            <MethodBox paymentMethod="ID_OVO" />
                            <MethodBox paymentMethod="ID_SHOPEEPAY" />
                            <MethodBox paymentMethod="ID_LINKAJA" />
                        </MethodListBox>
                        <MethodListBox
                            title="Transfer Bank via Virtual Account"
                            icon={<AiFillBank className="mr-2 text-base" />}>
                            <MethodBox paymentMethod="VA_BCA" isManual />
                            <MethodBox paymentMethod="VA_BNI" />
                            {/* <MethodBox paymentMethod="VA_MANDIRI" /> */}
                            <MethodBox paymentMethod="VA_BRI" />
                            <MethodBox paymentMethod="VA_PERMATA" />
                            <MethodBox paymentMethod="VA_BJB" />
                            <MethodBox
                                paymentMethod="OTHER"
                                onClick={scrollToOtherPayment}>
                                <div className="flex flex-col items-center text-neutral-900">
                                    <AiFillBank
                                        size={32}
                                        className="text-accent-purple"
                                    />
                                    <div className="text-sm">Bank lainnya</div>
                                </div>
                            </MethodBox>
                        </MethodListBox>
                        <MethodListBox
                            title="Pembayaran Tunai"
                            icon={<AiFillShop className="mr-2 text-base" />}>
                            <MethodBox paymentMethod="INDOMARET" />
                            <MethodBox paymentMethod="ALFAMART" />
                        </MethodListBox>
                        <OtherPaymentBox ref={otherPaymentMethodRef} />
                    </>
                )}
            </div>
            {packet?.is_free ? (
                <FreeModalCheckout
                    isOpen={isModalCheckoutOpen}
                    setOpen={setModalCheckoutOpen}
                />
            ) : (
                <ModalCheckout
                    isOpen={isModalCheckoutOpen}
                    setOpen={setModalCheckoutOpen}
                />
            )}
        </section>
    );
};

export default SubscriptionContainer;
