import { usePayment } from '../contexts/PaymentProvider';

const MethodBox = (): JSX.Element => {
    const { setModalCheckoutOpen } = usePayment();
    return (
        <div
            aria-hidden
            className="rounded-lg bg-white p-2 h-[150px] cursor-pointer"
            onClick={() => setModalCheckoutOpen(1)}></div>
    );
};

export default MethodBox;
