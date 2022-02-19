// import CheckoutButton from '../components/checkoutButton';
import ModalCheckout from '../components/ModalCheckout';
// import EwalletBox from '../components/EWallet';
import VirtualAccountBox from '../components/VitualAccount';
import { usePayment } from '../contexts/PaymentProvider';

const SubscriptionContainer = (): JSX.Element => {
    const { isModalCheckoutOpen, setModalCheckoutOpen } = usePayment();

    return (
        <section className="min-h-screen pt-24 px-[7.5rem]">
            <h1 className="text-5xl font-bold">Pilih metode pembayaran</h1>
            {/* <EwalletBox /> */}
            <VirtualAccountBox />
            <ModalCheckout
                isOpen={isModalCheckoutOpen}
                setOpen={setModalCheckoutOpen}
            />
        </section>
    );
};

export default SubscriptionContainer;
