import Button from 'commons/components/elements/Button';
import { usePayment } from 'payment/contexts/PaymentProvider';

const FreeBox = (): JSX.Element => {
    const { setModalCheckoutOpen } = usePayment();

    const onClick = (): void => {
        setModalCheckoutOpen(true);
    };

    return (
        <div className="rounded-lg bg-neutral-900 p-8 w-full mt-4 mb-16">
            <div className="mb-4 flex items-center">
                <h3 className="text-base font-bold">Pembayaran Gratis</h3>
            </div>
            <div className="grid lg:grid-cols-4 gap-4">
                <div
                    aria-hidden
                    className="rounded-lg bg-white p-8 h-[150px] cursor-pointer flex items-center justify-center">
                    <Button onClick={onClick} variant="primary">
                        Beli Gratis!
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FreeBox;
