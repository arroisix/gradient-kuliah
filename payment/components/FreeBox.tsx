import { usePayment } from 'payment/contexts/PaymentProvider';

const FreeBox = (): JSX.Element => {
    const { setModalCheckoutOpen } = usePayment();

    const onClick = (): void => {
        setModalCheckoutOpen(1);
    };

    return (
        <div className="rounded-lg bg-neutral-900 p-8 w-full mt-4 mb-16">
            <div className="mb-4 flex items-center">
                <h3 className="text-base font-bold">Pembayaran Gratis</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div
                    aria-hidden
                    onClick={onClick}
                    className="rounded-lg bg-white p-8 h-[150px] cursor-pointer flex items-center justify-center">
                    <p className="text-black">Beli Gratis!</p>
                </div>
            </div>
        </div>
    );
};

export default FreeBox;
