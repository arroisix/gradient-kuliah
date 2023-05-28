import Image from 'next/image';
import { usePayment } from '../contexts/PaymentProvider';

const MethodBox = ({
    logoUrl,
    paymentMethod
}: {
    logoUrl: string;
    paymentMethod: PaymentMethod;
}): JSX.Element => {
    const { setModalCheckoutOpen, setPaymentMethod } = usePayment();

    const onClick = (): void => {
        setPaymentMethod(paymentMethod);
        setModalCheckoutOpen(1);
    };
    return (
        <div
            aria-hidden
            className="rounded-lg bg-white p-8 h-[150px] cursor-pointer flex items-center justify-center"
            onClick={onClick}>
            <div className="w-[170px] h-[50px] relative">
                <Image src={logoUrl} layout="fill" className="object-contain" />
            </div>
        </div>
    );
};

export default MethodBox;
