// import CheckoutButton from '../components/checkoutButton';
import FreeBox from 'payment/components/FreeBox';
import FreeModalCheckout from 'payment/components/ModalCheckout/freeModal';
import OtherPaymentBox from 'payment/components/OtherPayment';
import ModalCheckout from '../components/ModalCheckout';
import VirtualAccountBox from '../components/VitualAccount';
import { usePayment } from '../contexts/PaymentProvider';

const SubscriptionContainer = (): JSX.Element => {
    const { isModalCheckoutOpen, setModalCheckoutOpen, packet } = usePayment();

    return (
        <section className="min-h-screen pt-24 px-4 md:px-[7.5rem]">
            <h1 className="text-3xl md:text-5xl font-bold">
                Pilih metode pembayaran
            </h1>
            <div className="flex flex-col gap-4 mt-4">
                {packet.is_free ? <FreeBox /> : <VirtualAccountBox />}
                <OtherPaymentBox />
            </div>
            {packet.is_free ? (
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
